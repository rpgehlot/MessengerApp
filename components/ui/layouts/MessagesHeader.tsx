import { EllipsisVerticalIcon, VideoCameraIcon, MicrophoneIcon } from "@heroicons/react/16/solid";
import { Popover, PopoverContent, PopoverTrigger } from "../popover";
import { useState } from "react";
import clsx from "clsx";
import { messageMenuItems, messageMenuItemsForGroupChat } from "@/lib/placeholder-data";
import { IMessagesHeaderProps } from "@/app/lib/descriptors";
import ProfileSection from "../custom/ProfileSection";
import MuteNotification from "../custom/muteNotificationsPop";
import DeleteChat from "../custom/DeleteChat";


export default function MessagesHeader({ handleChatSelection, selectedChat, setMessageSelectionEnabled } : IMessagesHeaderProps) {

    const [ messageMenuOpenState, setMessageMenuOpenState ] = useState<boolean>(false);

    return (
            <div className='h-14 sm:h-18 bg-zinc-200/70 p-4 flex gap-6 items-center'>
                <span className="md:hidden" onClick={() => handleChatSelection(null)}>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
                    </svg>
                </span>

             
                <ProfileSection selectedChat={selectedChat}>
                    <div className="w-12 h-12 relative min-w-12">
                        <img className="rounded-full object-contain" src={selectedChat.avatarUrl} />
                        {/* {selectedChat.isOnline && <span className="online-icon"></span>} */}
                    </div>
                    <h4 className="font-semibold text-md/snug text-primary/70">{selectedChat.chatName}</h4> 
                </ProfileSection>
                
                <span className='ml-auto'>
                    {/* <span className="text-zinc-800/70 inline-block p-2 mr-2 cursor-pointer rounded-full">
                        <MicrophoneIcon className="size-6 text-zinc-800/70" />
                    </span> */}
                    
                    <span className="text-zinc-800/70 inline-block p-2 mr-2 cursor-pointer rounded-full">
                        <VideoCameraIcon className="size-6 text-zinc-800/70" />
                    </span>
                    <Popover open={!!messageMenuOpenState} onOpenChange={() => {
                        setMessageMenuOpenState(!messageMenuOpenState);
                    }}>
                        <PopoverTrigger>
                            <span className={clsx("inline-block p-2 cursor-pointer rounded-full focus:bg-gray-300/40 active:bg-gray-300/40", messageMenuOpenState ? 'bg-gray-300/40' : '')}>
                                <EllipsisVerticalIcon className="size-6 text-zinc-800/70"  />
                            </span>
                        </PopoverTrigger>
                        <PopoverContent align='end' sideOffset={-3} className="w-40 sm:w-50 rounded-sm px-0">
                            <div className="flex flex-col text-sm sm:text-base text-zinc-800/90 font-light">
                                {
                                    !selectedChat.isGroupChat && (
                                        <ProfileSection selectedChat={selectedChat}>
                                            <span key={'Contact info'} className="p-2 px-4 hover:bg-zinc-300/20 cursor-pointer grow text-left">
                                                Contact info
                                            </span>
                                        </ProfileSection>
                                    )
                                }
                                {/* Select messages' , 'Mute notifications','Block', 'Close chat','Clear chat', 'Delete chat' */}
                                {
                                    !selectedChat.isGroupChat && (
                                        <span key={'Select messages'} className="p-2 px-4 hover:bg-zinc-300/20 cursor-pointer" onClick={() => setMessageSelectionEnabled(true)}>
                                            Select messages
                                        </span>
                                    )
                                }
                                
                                {
                                    !selectedChat.isGroupChat && (
                                        <MuteNotification>
                                            <span key={'Mute notifications'} className="p-2 px-4 hover:bg-zinc-300/20 cursor-pointer grow text-left">
                                                Mute notifications
                                            </span>
                                        </MuteNotification>
                                    )
                                }

                                {
                                    !selectedChat.isGroupChat && (
                                        <DeleteChat>
                                            <span key={'delete_chat'} className="p-2 px-4 hover:bg-zinc-300/20 cursor-pointer grow text-left">
                                                Delete chat
                                            </span>
                                        </DeleteChat>
                                    )
                                }

                                { 
                                    (selectedChat.isGroupChat ? messageMenuItemsForGroupChat : [] ).map((item) => (
                                        <span key={item} className="p-2 px-4 hover:bg-zinc-300/20 cursor-pointer">
                                            {item}
                                        </span>
                                    ))
                                }
                    
                            </div>
                        </PopoverContent>
                    </Popover>
                </span>             
            </div>
    );
}
