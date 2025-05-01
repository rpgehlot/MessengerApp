'use client';

import { ChatProps, ChatState, Message } from "@/app/lib/descriptors";
import { useEffect, useState, createContext, useCallback, MutableRefObject } from "react";
import Sidebar from "./Sidebar";
import MessagesWrapper from "./MessagesWrapper";
import { createClient } from "@/utils/supabase/client";
import { User } from "@supabase/supabase-js";
import { Tables, Enums } from "@/app/lib/database-types";
import { useWebSocket } from "@/lib/utils/hooks/useWebSocket";

type ChatWrapperProps = {
    chats : ChatProps[];
    user: User;
};

const supabase = createClient();
const pendingUpdates: Map<number, Tables<'messages'>> = new Map();

export const ChatAppContext = createContext<any>(null);
export const WebSocketContext = createContext<MutableRefObject<WebSocket | null> | null>(null);

export function ChatWrapper(props : ChatWrapperProps) {
    const [selectedChat, setSelectedChat] = useState<ChatProps | null>(null);

    const [chatState, setChatState] = useState<{[chatId : number] : ChatState}>({});
    const [chats, setChats] = useState<ChatProps[]>(props.chats);
    const [onlineUsers, setOnlineUsers] = useState<Set<string>>(new Set([]));
    const [typingUsers , setTypingUsers] = useState<{
        channelId : number;
        userId : string;
    }[]>([]);
    const handleWsMessage = useCallback((event: string, payload : any) => {


        if( event === 'auth-success') {
            console.log('auth-success : ',payload)

            const tempSet = new Set([...payload]);
            setOnlineUsers(tempSet);

            socket.current?.send(JSON.stringify({
                event : 'subscribe',
                payload: { topics : ['online-users'] }
            }));

            socket.current?.send(JSON.stringify({
                event : 'queued-messages',
            }));

        }
        else if (event === 'userjoined') {
            console.log('userjoined : ',payload);
            setOnlineUsers((prev) => new Set(prev).add(payload.userid));
        }
        else if (event === 'userleft') {
            console.log('userleft : ',payload);
            setOnlineUsers((prev) => {
                const next = new Set(prev);
                next.delete(payload.userid);
                return next;
            });
        } 
        else if (event === 'queued-messages') {
            console.log('Recieved queued messages : ' ,payload)
            if (payload?.length > 0)
                payload.map((m: Tables<'messages'>) => handleNewMessage(m))
        }
        else if (event === 'typing-start') {
            console.log(event, payload);
            setTypingUsers((typingUsers) => {
                const found = typingUsers.find((entry) => entry.channelId === payload.channel_id && entry.userId === payload.userId);
                if (found)
                    return typingUsers;
                return [...typingUsers, {...payload, channelId : payload.channel_id}];
            });
        }
        else if (event === 'typing-end') {
            console.log(event, payload);
            setTypingUsers((typingUsers) => {
                const clonedTypingUsers = [...typingUsers.map(u => { return {...u} } )];
                const foundIndex = clonedTypingUsers.findIndex((entry) => entry.channelId === payload.channel_id && entry.userId === payload.userId);
                if (foundIndex >= 0)
                    clonedTypingUsers.splice(foundIndex,1);
                return clonedTypingUsers;
            });
        }
        
    },[]);

    const { socket } = useWebSocket({
        wsurl : 'https://vxvgrflvqvvmbikszhbd.supabase.co/functions/v1/onlineUsers',
        onWsMessage : handleWsMessage,
        user : props.user
    });


    const handleNewMessage = async (newMessage : Tables<'messages'>) => {
        console.log('selectedchat : ',selectedChat);
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

            let status = newMessage.status;
            if(pendingUpdates.has(newMessage.entry_id)) {
                const queuedUpdate = pendingUpdates.get(newMessage.entry_id) as Tables<'messages'>;
                status = queuedUpdate.status;
                pendingUpdates.delete(newMessage.entry_id);
            }

            const newMessageObject:Message = {
                content : newMessage.content,
                createdAt : newMessage.created_at,
                messageId : newMessage.message_id,
                status,
                sender : {
                    avatarUrl : sender?.users_metadata?.avatar_url ?? '',
                    email : sender?.email,
                    id : sender?.id,
                    name : `${sender?.users_metadata?.first_name} ${sender?.users_metadata?.last_name}`
                }
            };

            return {
                ...s,
                [newMessage.channel_id] : {
                    ...data,
                    latestMessage : {
                        ...newMessageObject
                    },
                    messages : [...data.messages, {...newMessageObject}],
                    unreadMessagesCount : (newMessage.channel_id !== selectedChat?.chatId && newMessage.sender_id !== props.user.id) ? (data.unreadMessagesCount + 1) : data.unreadMessagesCount
                }
            }
        });

        // when a new message arrives in the selected chat for a user, mark the message as read.
        if (selectedChat?.chatId === newMessage.channel_id  && newMessage.sender_id != props.user.id) {
            console.log('marking the message as read : ',selectedChat, newMessage)
            try {
                await fetch('/api/messages/mark-read',{ 
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        channelId: selectedChat.chatId,
                        senderId : props.user.id
                    }),
                });
            } catch(e){

            }
        }
    };

    const handleMessageUpdate = async(old : {[key: string]: any} , newobj : {[key: string]: any}) => {
        
        const oldPayload = old as Tables<'messages'>;
        const newPayload = newobj as Tables<'messages'>;

        if (oldPayload.status !== newPayload.status) {
            setChatState((s) => {
                const data =  s[newPayload.channel_id] || { visited : false, messages : [] };
                
                const msgIndex = data.messages.findIndex(m => m.messageId === newPayload.message_id);
                if (msgIndex >= 0 ) {
                    const newList = [...data.messages];
                    newList[msgIndex] = {
                        ...data.messages[msgIndex],
                        status : newPayload.status
                    };

                    return {
                        ...s,
                        [newPayload.channel_id] : {
                            ...data,
                            messages : newList
                        }
                    }
                }
                else {
                    pendingUpdates.set(newPayload.entry_id, newPayload);
                }

                return {
                    ...s,
                    [newPayload.channel_id] : {
                        ...data,
                    }
                }
            });
        }
    };

    const updateMessages = (chatId : number, newMessages : Message[]) => {
        setChatState((s) => {
            const curr = s[chatId] || { messages : []};
            return {
                ...s,
                [chatId] : {
                    ...curr,
                    messages : [
                        ...newMessages,                 
                        ...curr.messages
                    ]
                }
            }
        });
    };

    useEffect(() => {

        const chatIds = chats.map(chat => chat.chatId);
        if (chatIds.length == 0)
            return;

        const channel = supabase.channel('realtime_changes').on('postgres_changes',{
            event : '*',
            schema : 'public',
            table : 'messages',
            filter: `channel_id=in.(${chatIds.join(',')})`
        },async (payload) => {
            if (payload.eventType === 'INSERT'){
                const newMessage = payload.new as Tables<'messages'>;
                handleNewMessage(newMessage);
            }
            else if (payload.eventType === 'UPDATE') {
                handleMessageUpdate(payload.old, payload.new);
            }

        }).subscribe();
        


        return () => {
            supabase.removeChannel(channel);
            // supabase.removeChannel(updateListner);
        };
    },[chats, supabase, selectedChat, setSelectedChat]);

    const handleClick = async (chat : ChatProps | null) => {

        console.log('chat : ',chat)
        setSelectedChat(chat);

        if (chat === null || !chatState[chat.chatId] || !chatState[chat.chatId].latestMessage)
            return;
            
        if (chatState[chat?.chatId].unreadMessagesCount > 0) {

            try {
                await fetch('/api/messages/mark-read',{ 
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        channelId: chat.chatId,
                        senderId : props.user.id
                    }),
                });
            } catch(e){

            }

            setChatState((s) => {
                const curr = s[chat.chatId] || {};
                return {
                    ...s,
                    [chat.chatId] : {
                        ...curr,
                        unreadMessagesCount : 0,
                    }
                }
            });
        }
       

        if(!chatState[chat.chatId].visited) {
            try {
                const res = await fetch(`/api/messages?channelId=${chat.chatId}&lastMessageId=${chatState[chat.chatId].latestMessage?.messageId}`);
                const { data } = await res.json();
                console.log('Received data:', data);

                setChatState((s) => {
                    const curr = s[chat.chatId] || {};
                    return {
                        ...s,
                        [chat.chatId] : {
                            ...curr,
                            visited : true,
                            latestMessage : curr.latestMessage ? {...curr.latestMessage} : undefined,
                            messages : [...data, ...curr.messages],
                            unreadMessagesCount : 0
                        }
                    }
                });

            } catch(error) {
                console.error('Fetch error:', error);
            }
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
                        messages : chat.latestMessage ? [{...chat.latestMessage}] : [],
                        unreadMessagesCount : chat.unreadMessagesCount
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
                   if (msg.payload.event === 'newChat')
                        onNewChatReceived(msg.payload.data);
                }
            )
            .subscribe();

        return () => {
            myChannel.unsubscribe();
        };
    },[supabase]);


    const updateChats = (chat:ChatProps) => {
        setChats([chat, ...chats]);
        setChatState((s) => {
            return {
                ...s,
                [chat.chatId] : {
                    visited : false,
                    messages : [],
                    unreadMessagesCount : 0
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
            updateChats,
            updateMessages,
            user : props.user,
            typingUsers
        }}>
            <WebSocketContext.Provider value={socket}>
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
            </WebSocketContext.Provider>
        </ChatAppContext.Provider>
       
    )
}