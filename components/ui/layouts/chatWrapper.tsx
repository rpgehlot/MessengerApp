'use client';

import { ChatProps, ChatState, Message } from "@/app/lib/descriptors";
import { useEffect, useState, createContext } from "react";
import Sidebar from "./Sidebar";
import MessagesWrapper from "./MessagesWrapper";
import { createClient } from "@/utils/supabase/client";
import { User } from "@supabase/supabase-js";
  
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

            const newMessage = payload.new;
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
                .eq("id", payload.new.sender_id)
                .single();
            if(error){
                console.log(error);
                return;
            }

            console.log({payload});
            
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


            console.log(chatState)
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
        function messageReceived(payload) {
            console.log(payload);
            setChats([payload.payload, ...chats])
        }
        // Subscribe to the Channel
        myChannel
            .on(
                'broadcast',
                { event: 'shout' }, // Listen for "shout". Can be "*" to listen to all events
                (payload) => messageReceived(payload)
            )
            .subscribe()
    },[])


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