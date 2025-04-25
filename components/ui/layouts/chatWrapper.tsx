'use client';

import { ChatProps, ChatState, Message } from "@/app/lib/descriptors";
import { useEffect, useState, createContext } from "react";
import Sidebar from "./Sidebar";
import MessagesWrapper from "./MessagesWrapper";
import { createClient } from "@/utils/supabase/client";
import { User } from "@supabase/supabase-js";
import { Tables } from "@/app/lib/database-types";
  
type ChatWrapperProps = {
    chats : ChatProps[];
    user: User;
};

const supabase = createClient();

export const ChatAppContext = createContext<any>(null);

export function ChatWrapper(props : ChatWrapperProps) {
    const [selectedChat, setSelectedChat] = useState<ChatProps | null>(null);

    const [chatState, setChatState] = useState<{[chatId : number] : ChatState}>({});
    const [chats, setChats] = useState<ChatProps[]>(props.chats);
    const [onlineUsers, setOnlineUsers] = useState<Set<string>>(new Set([]));

    const handleNewMessage = async (newMessage : Tables<'messages'>) => {
        const { data: sender, error } = await supabase
            .from("users")
            .select(`
                id,
                email,
                users_metadata (
                    first_name,
                    last_name,
                    username,
                    avatar_url
                )
            `)
            .eq("id", newMessage.sender_id)
            .single();
        if(error){
            console.log(error);
            return;
        }

        
        setChatState((s) => {
            const data =  s[newMessage.channel_id] || { visited : false, messages : [] };

            return {
                ...s,
                [newMessage.channel_id] : {
                    ...data,
                    latestMessage : {
                        content : newMessage.content,
                        messageId : newMessage.message_id,
                        createdAt : newMessage.created_at,
                        read : true,
                        senderId : newMessage.sender_id
                    },
                    messages : [...data.messages, {
                        content : newMessage.content,
                        createdAt : newMessage.created_at,
                        messageId : newMessage.message_id,
                        read: true,
                        sender : {
                            avatarUrl : sender?.users_metadata?.avatar_url ?? '',
                            email : sender?.email,
                            id : sender?.id,
                            name : `${sender?.users_metadata?.first_name} ${sender?.users_metadata?.last_name}`
                        }
                    }]
                }
            }
        });
    };

    useEffect(() => {

        const chatIds = chats.map(chat => chat.chatId);
        if (chatIds.length == 0)
            return;

        const channel = supabase.channel('realtime_changes').on('postgres_changes',{
            event : 'INSERT',
            schema : 'public',
            table : 'messages',
            filter: `channel_id=in.(${chatIds.join(',')})`
        },async (payload) => {
            const newMessage = payload.new as Tables<'messages'>;
            handleNewMessage(newMessage);
        }).subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    },[chats, supabase, chatState, setChatState]);

    const handleClick = async (chat : ChatProps | null) => {

        console.log('chat : ',chat)
        setSelectedChat(chat);

        if (chat === null || !chatState[chat.chatId] || !chatState[chat.chatId].latestMessage || chatState[chat.chatId].visited)
            return;

        try {
            const res = await fetch(`/api/messages?channelId=${chat.chatId}&lastMessageId=${chatState[chat.chatId].latestMessage?.messageId}`);
            const { data } = await res.json();
            console.log('Received data:', data);

            setChatState((s) => {
                const curr = s[chat.chatId] || {};
                return {
                    ...s,
                    [chat.chatId] : {
                        visited : true,
                        latestMessage : curr.latestMessage ? {...curr.latestMessage} : undefined,
                        messages : [ ...data]
                    }
                }
            });

        }catch(error) {
            console.error('Fetch error:', error);
        }
    };

    useEffect(() => {

        console.log('props.chats changed');
        
        props.chats.forEach((chat) => {
            setChatState((s) => {
                return {
                    ...s,
                    [chat.chatId] : {
                        visited : false,
                        latestMessage : chat.latestMessage ? {...chat.latestMessage} : undefined,
                        messages : [],
                    }
                }
            })
        });

    },[props.chats]);

    useEffect(() => {

        // Join a room/topic. Can be anything except for 'realtime'.
        const myChannel = supabase.channel(props.user.id)
        // Simple function to log any messages we receive
        function onNewChatReceived(payload : ChatProps) {
            console.log(payload);
            setChats([payload, ...chats])
        }

        // Subscribe to the Channel
        myChannel
            .on(
                'broadcast',
                { event: 'shout' }, // Listen for "shout". Can be "*" to listen to all events
                (msg) => {
                    if (msg.payload.event === 'queuedMessages'){
                        console.log('Recieved queued messages : ' ,msg.payload.data)
                        if (msg.payload.data?.length > 0)
                            msg.payload.data.map((m: Tables<'messages'>) => handleNewMessage(m))
                    }
                    else if (msg.payload.event === 'newChat')
                        onNewChatReceived(msg.payload.data);
                }
            )
            .subscribe();

        const channel = supabase.channel('online-users', {
            config: {
                presence: {
                    key: props.user.id
                },
            },
        });
        
        channel.on('presence', { event: 'sync' }, () => {
            const presentState = channel.presenceState()
            console.log('inside presence: ', presentState);
            const tempSet = new Set(onlineUsers);
            Object.keys(presentState).map((id) => {
                tempSet.add(id);
            });

            setOnlineUsers(tempSet);
        });
        
        console.log('registering New users have joined callback');
        channel.on('presence', { event: 'join' }, ({ newPresences }) => {
            console.log('New users have joined: ', newPresences);
            const tempSet = new Set(onlineUsers);
            newPresences.map((presence) => tempSet.add(presence.user_name));
            setOnlineUsers(tempSet);
        })

        channel.on('presence', { event: 'leave' }, ({ leftPresences }) => {
            console.log('users have left: ', leftPresences);
            const tempSet = new Set(onlineUsers);
            leftPresences.map((presence) => tempSet.delete(presence.user_name));
            setOnlineUsers(tempSet);
        });
    
        channel.subscribe(async (status) => {
            if (status === 'SUBSCRIBED') {
                const status = await channel.track({
                    userId: props.user.id
                })
                console.log('status: ', status)
            }
        });
          
        return () => {
            myChannel.unsubscribe();
            channel.untrack();
            channel.unsubscribe();
        };
    },[supabase])


    const updateChats = (chat:ChatProps) => {
        setChats([chat, ...chats]);
        setChatState((s) => {
            return {
                ...s,
                [chat.chatId] : {
                    visited : false,
                    messages : [],
                }
            }
        })
    };

    return (
        <ChatAppContext.Provider value={{
            selectedChat,
            handleClick,
            chats: chats,
            setSelectedChat : (chat:ChatProps) => setSelectedChat(chat),
            updateChats ,
            user:props.user
        }}>
            <div className='flex w-full h-[100%] md:h-[calc(100vh-88px)] box-border sm:border-1 sm:shadow-lg sm:mt-2 mb-4'>
                <Sidebar 
                    selectedChat={selectedChat} 
                    chats={chats} 
                    handleChatSelection={handleClick} 
                    user={props.user}
                    chatState={chatState}
                    onlineUsers={onlineUsers}
                />

                <MessagesWrapper 
                    selectedChat={selectedChat}
                    handleChatSelection={handleClick}
                    user={props.user}
                    messages={selectedChat ? chatState[selectedChat?.chatId]?.messages : []}
                />
            
            </div>
        </ChatAppContext.Provider>
       
    )
}