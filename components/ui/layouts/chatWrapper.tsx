'use client';

import { ChatProps, UserData } from "@/app/lib/descriptors";
import { useState } from "react";
import Sidebar from "./Sidebar";
import MessagesWrapper from "./MessagesWrapper";
  
type ChatWrapperProps = {
    chats : ChatProps[];
    user: UserData;
};

export function ChatWrapper(props : ChatWrapperProps) {
  
    const [selectedChat, setSelectedChat] = useState<ChatProps | null>(null);


    const handleClick = (chat : ChatProps | null) => {
        setSelectedChat(chat);
    };

    return (
        <div className='flex w-full h-[100%] md:h-[calc(100vh-88px)] box-border sm:border-1 sm:shadow-lg sm:mt-2 mb-4'>
           
           <Sidebar 
                selectedChat={selectedChat} 
                chats={props.chats} 
                handleChatSelection={handleClick} 
            />

            <MessagesWrapper 
                selectedChat={selectedChat} 
                handleChatSelection={handleClick} 
                user={props.user}
            />
           
        </div>
    )
}