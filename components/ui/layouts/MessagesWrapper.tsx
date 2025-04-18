import { IMessagesWrapper, MessageBlock } from "@/app/lib/descriptors";
import { useEffect, useRef, useState } from "react";
import { Message } from "../custom/MessageBlock";
import MessagesHeader from "./MessagesHeader";
import MessagesFooter from "./MessagesFooter";

export default function MessagesWrapper({ selectedChat, user, handleChatSelection } : IMessagesWrapper){

    
    const messagesContainerRef = useRef<HTMLDivElement>(null);
    const [messageSelectionEnabled, setMessageSelectionEnabled ] = useState<boolean>(false);
    const [selectedMessages, setSelectedMessages] = useState<MessageBlock[]>([]);

    useEffect(() => {
        setSelectedMessages([]);
        setMessageSelectionEnabled(false);
    },[selectedChat?.chatId]);
    
    return (
        <div className='flex flex-col grow relative'>
            {!selectedChat && (
                <div className="grow bg-zinc-200/70 relative hidden md:block">
                    <div className="absolute top-1/2 left-1/2  -translate-[50%]">
                        <svg viewBox="0 0 20 24" width="200" height="200" aria-hidden="true">
                            <path className="fill-emerald-400" d="M16 8a5 5 0 0 0-5-5H5a5 5 0 0 0-5 5v13.927a1 1 0 0 0 1.623.782l3.684-2.93a4 4 0 0 1 2.49-.87H11a5 5 0 0 0 5-5V8Z"></path>
                        </svg>
                        <h1 className="text-lg sm:text-2xl text-primary/60 font-light leading-tight mt-2">
                            Start a new chat
                        </h1>
                    </div>
                </div>
                
            )}
            {selectedChat && (
                <>
                    <MessagesHeader 
                        selectedChat={selectedChat} 
                        handleChatSelection={handleChatSelection} 
                        setMessageSelectionEnabled={setMessageSelectionEnabled}
                    />

                    <div ref={messagesContainerRef} className="textChatArea grow  h-px overflow-auto">
                        <div style={{'overflowAnchor' : 'none'}} className="min-h-[12px] grow"></div>
                        {selectedChat.messages?.map((message, i) => (
                            <Message 
                                key={`${message.messageId}_${i}`}
                                displayName={selectedChat.isGroupChat}
                                createdAt={message.createdAt}
                                sender={message.sender}
                                content={message.content}
                                loggedInUserId={user.id}
                                messageId={message.messageId}
                                media={message.media}
                                read={message.read}
                                messageSelectionEnabled={messageSelectionEnabled}
                                onMessageSelectionChange={(message, checked) => {
                                    console.log(message,checked)
                                    console.log(selectedMessages)
                                    if (checked) {
                                        setSelectedMessages((messages) => {
                                            return [
                                                ...messages,
                                                message
                                            ]
                                        });
                                    }
                                    else {
                                        setSelectedMessages((prevMessages) => prevMessages.filter(msg => msg.messageId !== message.messageId));
                                    }
                                }}
                            />
                        ))}
                        <div style={{'overflowAnchor' : 'auto'}} id="anchor" className="h-px"></div>
                    </div>

                    <MessagesFooter 
                        selectedChat={selectedChat} 
                        handleChatSelection={handleChatSelection} 
                        messageSelectionEnabled={messageSelectionEnabled}
                        setMessageSelectionEnabled={setMessageSelectionEnabled}
                        selectedMessages={selectedMessages}
                    />
                </>
            )}
    </div>
    );
}