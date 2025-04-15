import { IMessagesFooterProps } from "@/app/lib/descriptors";
import { EmojiPicker } from "@/lib/utils/hooks/EmojiPicker";
import useOutsideClick from "@/lib/utils/hooks/useOutsideClick";
import { EmojiClickData } from "emoji-picker-react";
import { AnimatePresence, motion } from "framer-motion";
import { useRef, useState } from "react";
import { Input } from "../input";
// import { FaceSmileIcon, PhotoIcon } from "@heroicons/react/16/solid";
import { FaceSmileIcon, PhotoIcon } from '@heroicons/react/24/outline';

export default function MessagesFooter({ 
        handleChatSelection, 
        selectedChat, 
        messageSelectionEnabled, 
        setMessageSelectionEnabled,
        selectedMessages
    } : IMessagesFooterProps ) 
{

    const [message, setMessage] = useState<string>('');
    const [isEmojiPickerOpen, setIsEmojiPickerOpen] = useState<boolean>(false);


    const containerRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);


    useOutsideClick(containerRef, () => {
        console.log('clicked outside of emoji picker')
        setIsEmojiPickerOpen(false);        
    });

    const onEmojiClick = (emoijiData : EmojiClickData) => {
        if (!inputRef.current) return

        const input = inputRef.current
        const start = input.selectionStart || 0
        const end = input.selectionEnd || 0
      
        const newText = message.slice(0, start) + emoijiData.emoji + message.slice(end)
        setMessage(newText)
      
        // Move cursor to after inserted emoji
        requestAnimationFrame(() => {
          input.setSelectionRange(start + emoijiData.emoji.length, start + emoijiData.emoji.length)
          input.focus()
        })
    };

    const onFormSubmit = (e) => {
        e.preventDefault();

        // alert('This message will be sent to api.  : '  + e.target.messageEntered.value);
        if (e.target.messageEntered.value === '')
            return;

        const newMessage = {
            messageId : 9,
            sender : {
                name: 'Rituparn',
                id : '628c9c75-c638-4fd6-8c39-515328e5a38b',
                email : 'rpgehlot1991@gmail.com',
                avatarUrl : 'https://randomuser.me/api/portraits/men/44.jpg'
            },
            createdAt : '2025-04-07T14:15:19.832Z',
            content : e.target.messageEntered.value,
            loggedInUserId : '628c9c75-c638-4fd6-8c39-515328e5a38b',
            read : false,
            displayName : true
        };

        handleChatSelection({
            ...selectedChat,
            messages : [
                ...(selectedChat?.messages || []),
                newMessage
            ]
        });

        setMessage('');
    }

    return (
        <div className="flex h-14 sm:h-16 bg-zinc-200/70 p-2 box-border relative items-center justify-start">
            {!messageSelectionEnabled && <form className="grow flex" onSubmit={onFormSubmit}>
                    <div className="relative grow flex">
                        <div className="absolute left-2 top-1/2 align-middle transform -translate-y-[50%] cursor-pointer">
                            <span className="flex items-center cursor-pointer text-zinc-600" onClick={()=> setIsEmojiPickerOpen(true)}>
                                <FaceSmileIcon className="size-8 text-zinc-600"/>
                            </span>
                            <AnimatePresence>
                                {isEmojiPickerOpen && (
                                    <motion.div
                                        initial={{ opacity: 0, scale: 0.95, y: 10 }}
                                        animate={{ opacity: 1, scale: 1, y: 0 }}
                                        exit={{ opacity: 0, scale: 0.95, y: 10 }}
                                        transition={{ duration: 0.2 }}
                                        className="absolute -top-[405px] left-0 z-50"
                                    >
                                        <EmojiPicker
                                            onEmojiClick={(emojiData) => {
                                                onEmojiClick(emojiData)
                                                setIsEmojiPickerOpen(false) // auto-close on select
                                            }}
                                            lazyLoadEmojis={true}
                                            ref={containerRef}
                                            height={400} 
                                            
                                        />
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>

                        <div className="absolute left-12 top-1/2 align-middle transform -translate-y-[50%] cursor-pointer">
                            <PhotoIcon className="size-8 text-zinc-600"/>
                        </div>

                        <Input ref={inputRef} name="messageEntered" className="bg-white border-0 h-10 sm:h-12 hover:border-none focus-visible:ring-[1px] md:text-base pl-24" placeholder="Type a message"  value={message} onChange={(e) => setMessage(e.target.value)}/>
                    </div>
                    <button type="submit" className="min-w-12 flex items-center justify-center cursor-pointer hover:bg-zinc-200/50">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 12 3.269 3.125A59.769 59.769 0 0 1 21.485 12 59.768 59.768 0 0 1 3.27 20.875L5.999 12Zm0 0h7.5" />
                        </svg>
                    </button>
            </form>}
            {messageSelectionEnabled && (
                <>
                    <span  onClick={() => setMessageSelectionEnabled(false)}>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-8 text-primary/60">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                        </svg>

                    </span>

                    <span className="p-2 text-base text-primary/60">
                        {selectedMessages.length} messages selected
                    </span>

                    <span className="ml-auto mr-8 cursor-pointer">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-8 text-primary/60">
                            <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                        </svg>
                    </span>
                </>
            )}
        </div>
    );
}
