'use client';

import { ChatProps } from "@/app/lib/descriptors";
import { useState } from "react";
import Sidebar from "./Sidebar";
import MessagesWrapper from "./MessagesWrapper";
import { createClient } from "@/utils/supabase/client";
import { User } from "@supabase/supabase-js";
  
type ChatWrapperProps = {
    chats : ChatProps[];
    user: User;
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
                user={props.user}
            />

            <MessagesWrapper 
                selectedChat={selectedChat} 
                handleChatSelection={handleClick} 
                user={props.user}
            />
           
        </div>
    )
}