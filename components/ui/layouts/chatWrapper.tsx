'use client';

import { Chat, ChatProps, ChatState, Message, TypingUserPayload } from "@/app/lib/descriptors";
import { useEffect, useState, createContext, useCallback, MutableRefObject } from "react";
import Sidebar from "./Sidebar";
import MessagesWrapper from "./MessagesWrapper";
import { createClient } from "@/utils/supabase/client";
import { User } from "@supabase/supabase-js";
import { Tables, Enums } from "@/app/lib/database-types";
import { useWebSocket } from "@/lib/utils/hooks/useWebSocket";

type ChatWrapperProps = {
    chats : Chat[];
    user: User;
};

const supabase = createClient();
const pendingUpdates: Map<number, Tables<'messages'>> = new Map();

export const ChatAppContext = createContext<any>(null);
export const WebSocketContext = createContext<MutableRefObject<WebSocket | null> | null>(null);

export function ChatWrapper(props : ChatWrapperProps) {
    const [selectedChat, setSelectedChat] = useState<Chat | null>(null);

    const initialState = props.chats.map(chat => { 
        return  {
            ...chat, 
            visited : false, 
        }
    });
    const [chatState, setChatState] = useState<{[chatId : number] : ChatState}>({});
    const [chats, setChats] = useState<Chat[]>(initialState);
    const [onlineUsers, setOnlineUsers] = useState<Set<string>>(new Set([]));
    const [typingUsers , setTypingUsers] = useState<TypingUserPayload[]>([]);
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
        user : props.user,
        onWsClose() {
            setOnlineUsers(new Set([]));
        },
    });


    const handleNewMessage = async (newMessage : Tables<'messages'>) => {
        console.log('handleNewMessage : ',newMessage, Date.now());
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

        setChats((prevChats) => {
            
            const foundChatIndex = prevChats.findIndex(chat => chat.chatId === newMessage.channel_id);
            
            if (foundChatIndex < 0 )
                return [...prevChats];

            const foundChat = prevChats[foundChatIndex];

            let status = newMessage.status;
            console.log('pendingUpdates : ',pendingUpdates);
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

            const clonedChats = [...prevChats];
            clonedChats[foundChatIndex] = {
                ...foundChat,
                unreadMessagesCount : (newMessage.channel_id !== selectedChat?.chatId && newMessage.sender_id !== props.user.id) ? (foundChat.unreadMessagesCount + 1) : foundChat.unreadMessagesCount,
                messages : [...foundChat.messages, {...newMessageObject}],
                latestMessage : {
                    ...newMessageObject
                },
            };

            return clonedChats;
            
        });

        // when a new message arrives in the selected chat for a user, mark the message as read.
        if (selectedChat?.chatId === newMessage.channel_id  && newMessage.sender_id != props.user.id) {
            setTimeout(async () => {
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
            },1000);
        }
    };

    const handleMessageUpdate = async(old : {[key: string]: any} , newobj : {[key: string]: any}) => {
        
        const oldPayload = old as Tables<'messages'>;
        const newPayload = newobj as Tables<'messages'>;

        console.log(`handleMessageUpdate :: old status - ${oldPayload.status} new status - ${newPayload.status}`,Date.now());

        if (oldPayload.status !== newPayload.status) {
            setChats((prevChats) => {
            
                const foundChatIndex = prevChats.findIndex(chat => chat.chatId === newPayload.channel_id);
                
                if (foundChatIndex < 0 )
                    return [...prevChats];
                
                const foundChat = prevChats[foundChatIndex];

                const msgIndex = foundChat.messages.findIndex(m => m.messageId === newPayload.message_id);
                if (msgIndex >= 0 ) {
                    const newList = [...foundChat.messages];
                    newList[msgIndex] = {
                        ...foundChat.messages[msgIndex],
                        status : newPayload.status
                    };

                    const clonedChats = [...prevChats];
                    clonedChats[foundChatIndex] = {
                        ...clonedChats[foundChatIndex],
                        messages : newList
                    };

                    return clonedChats;
                }
                else {
                    pendingUpdates.set(newPayload.entry_id, newPayload);
                }

                return [...prevChats];
            });

        }
    };

    const updateMessages = (chatId : number, newMessages : Message[]) => {
        setChats((prevChats) => {
            
            const foundChatIndex = prevChats.findIndex(chat => chat.chatId === chatId);
            
            if (foundChatIndex < 0 )
                return [...prevChats];
            
            const foundChat = prevChats[foundChatIndex];

            const clonedChats = [...prevChats];
            clonedChats[foundChatIndex] = {
                ...foundChat,
                messages : [
                    ...newMessages,
                    ...foundChat.messages,
                ]
            };

            return clonedChats;
        });

    };

    useEffect(() => {

        const { data } =  supabase.auth.onAuthStateChange((event, session) => {
            console.log(event, session)
            if (event === 'TOKEN_REFRESHED' && session) {
              console.log('New access token:', session.access_token);
              supabase.realtime.setAuth(session.access_token);
            } else if (event === 'SIGNED_IN' && session) {
                console.log('session : ',session);
              supabase.realtime.setAuth(session.access_token);
            } else if (event === 'SIGNED_OUT') {
              supabase.realtime.setAuth(null);
            } 
        });

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
            data?.subscription.unsubscribe();
        };
    },[chats, supabase, selectedChat, setSelectedChat]);

    const handleClick = async (chat : Chat | null) => {

        console.log('chat : ',chat)
        setSelectedChat(chat);

        if (chat === null)
            return;
            
        if (chat.unreadMessagesCount > 0) {

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

            setChats((prevChats) => {
                const foundChatIndex = prevChats.findIndex(c => c.chatId === chat.chatId);
            
                if (foundChatIndex < 0 )
                    return [...prevChats];
                
                const foundChat = prevChats[foundChatIndex];

                const clonedChats = [...prevChats];
                clonedChats[foundChatIndex] = {
                    ...foundChat,
                    unreadMessagesCount : 0
                };

                return clonedChats;
            });
        }
       

        if(!chat.visited && chat.latestMessage?.messageId) {
            try {
                const res = await fetch(`/api/messages?channelId=${chat.chatId}&lastMessageId=${chat.latestMessage?.messageId}`);
                const { data } = await res.json();
                console.log('Received data:', data);

                setChats((prevChats) => {
                    const foundChatIndex = prevChats.findIndex(c => c.chatId === chat.chatId);
                
                    if (foundChatIndex < 0 )
                        return [...prevChats];
                    
                    const foundChat = prevChats[foundChatIndex];
    
                    const clonedChats = [...prevChats];
                    clonedChats[foundChatIndex] = {
                        ...foundChat,
                        messages : [...data, ...(chat.latestMessage ? [{...chat.latestMessage}] : [])],
                        unreadMessagesCount : 0,
                        visited : true
                    };
    
                    return clonedChats;
                });


            } catch(error) {
                console.error('Fetch error:', error);
            }
        }
       
    };

    useEffect(() => {
        console.log('chats changed');
        if(selectedChat) {
            const foundChat = chats.find(c => c.chatId === selectedChat.chatId);
            if (foundChat)
                setSelectedChat(foundChat);
        }

    },[chats]);
     

    useEffect(() => {

        // Join a room/topic. Can be anything except for 'realtime'.
        const myChannel = supabase.channel(props.user.id)
        // Simple function to log any messages we receive
        function onNewChatReceived(payload : Chat) {
            console.log(payload);
            setChats((prevChats) => {
                return [
                    {
                        ...payload,
                        visited : false
                    },
                    ...prevChats
                ];
            });

            handleClick(payload);
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


    const updateChats = (chat:Chat) => {
        setChats([chat, ...chats]);
    };


    return (
        <ChatAppContext.Provider value={{
            selectedChat,
            handleClick,
            chats: chats,
            setSelectedChat : (chat:Chat) => setSelectedChat(chat),
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
                        messages={selectedChat ? selectedChat.messages : []}
                        // messages={selectedChat && !selectedChat.newChat ? chatState[selectedChat?.chatId]?.messages : []}
                    />
                
                </div>
            </WebSocketContext.Provider>
        </ChatAppContext.Provider>
       
    )
}