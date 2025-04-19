import clsx from "clsx";
import { Popover, PopoverContent, PopoverTrigger } from "../popover";
import { EllipsisVerticalIcon, MagnifyingGlassIcon } from "@heroicons/react/16/solid";
import { Input } from "../input";
import { ChatCategory, ChatProps, ISidebarProps } from "@/app/lib/descriptors";
import { AvatarRow } from "../custom/AvatarRow";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import CreateNewChat from "../custom/createNewChat";
import CreateNewGroupChat from "../custom/createNewGroupChat";

  

const supabase = createClient()

export default function  Sidebar( { chats, selectedChat, user, handleChatSelection} : ISidebarProps) {

    const [chatMenuOpenState, setChatMenuOpenState] = useState<boolean>(false);
    const [searchQuery, setSearchQuery] = useState<string>('');
    const [filteredChats, setFilteredChats] = useState<ChatProps[]>(chats);
    const [chatCategory, setChatCategory] = useState<string>('ALL');
    const [chatSelectionEnabled, setChatSelectionEnabled] = useState<boolean>(false);

    const { replace } = useRouter();

    const logOutUser = async () => {
        const { error } = await supabase.auth.signOut();
        if (!error)
            replace('/login');
    };

    const openNewChat = () => {
    };

    const onSelectChats = () => {
        setChatSelectionEnabled(true);
        setChatMenuOpenState(false);
    };

    const handleSearchQueryChange = (e : any) => {
        
        const searchQuery = e.target.value.toString();
        const filteredChats = chats.filter((chat) => {
            const lowerCasedName = chat.chatName.toLowerCase();
            return (
                lowerCasedName.includes(searchQuery) ||
                chat.latestMessage.content.toLowerCase().includes(searchQuery)
            )
        });

        setFilteredChats(filteredChats);
        setSearchQuery(e.target.value);
    };

    return (
        <div className={clsx('flex flex-col sm:min-w-sm min-w-full sm:max-w-sm sm:bg-zinc-50 p-3 sm:p-0', selectedChat ? 'md:flex hidden' : '')}>
            <div className='flex items-center justify-between pl-0 sm:pl-4 mt-4'>
                <h1 className='font-bold text-2xl/10 text-zinc-800/70 items-start'>
                    Chats
                </h1>
                <span className='sm:mr-0.5'>
                    <Popover modal={true} open={!!chatMenuOpenState} onOpenChange={() => {
                        setChatMenuOpenState(!chatMenuOpenState);
                    }}>
                        <PopoverTrigger>
                            <span className={clsx("inline-block p-2 cursor-pointer rounded-full focus:bg-gray-300/40 active:bg-gray-300/40", chatMenuOpenState ? 'bg-gray-300/40' : '')}>
                                <EllipsisVerticalIcon className="size-6 text-zinc-800/70"  />
                            </span>
                        </PopoverTrigger>
                        <PopoverContent align='end' sideOffset={-3} className="w-40 sm:w-50 rounded-sm px-0">
                            <div className="flex flex-col text-sm sm:text-base text-zinc-800/90 font-light">

                                <CreateNewChat>
                                    <span key={'newUser'} className="p-2 px-4 hover:bg-zinc-300/20 cursor-pointer grow text-left" onClick={openNewChat}>
                                        New chat
                                    </span>
                                </CreateNewChat>

                                <CreateNewGroupChat>
                                    <span key={'groupChat'} className="p-2 px-4 hover:bg-zinc-300/20 cursor-pointer grow text-left">
                                       Group Chat
                                    </span>
                                </CreateNewGroupChat>   

                                <span key={'Select chats'} className="p-2 px-4 hover:bg-zinc-300/20 cursor-pointer" onClick={onSelectChats}>
                                    Select chats
                                </span>

                                <span key={'logout'} className="p-2 px-4 hover:bg-zinc-300/20 cursor-pointer" onClick={logOutUser}>
                                    Log out
                                </span>
                            </div>
                        </PopoverContent>
                    </Popover>
                </span>
            </div>

            <div className='sm:px-4 mt-4 grow flex flex-col'>
                {!chatSelectionEnabled && (
                    <>
                        <div className="relative mb-4">
                            <span className="absolute left-0 top-1/2 -translate-y-[50%] transform ml-2" >
                                <MagnifyingGlassIcon className="size-6 text-zinc-800/70" />
                            </span>
                            <Input placeholder="Search" value={searchQuery} onChange={handleSearchQueryChange}/>
                        </div>
                        <div className="flex items-center justify-start mb-1 gap-2">
                            <div className={clsx("chattype", chatCategory === ChatCategory.ALL ? 'bg-lime-200' : '')} onClick={() => setChatCategory(ChatCategory.ALL)}>
                                All
                            </div>
                            <div className={clsx("chattype", chatCategory === ChatCategory.GROUP ? 'bg-lime-200' : '')} onClick={() => setChatCategory(ChatCategory.GROUP)}>
                                Groups
                            </div>
                            <div className={clsx("chattype", chatCategory === ChatCategory["1:1"] ? 'bg-lime-200' : '')} onClick={() => setChatCategory(ChatCategory["1:1"])}>
                                1:1
                            </div>
                        </div>
                    </>
                )}

                {chatSelectionEnabled && (
                    <span className="" onClick={() => setChatSelectionEnabled(false)}>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                        </svg>
                    </span>
                )}

                <div className='grow h-px overflow-auto'>
                    {filteredChats.filter((chat) => {
                        if (chatCategory === ChatCategory.ALL)
                            return true;
                        else if (chatCategory === ChatCategory.GROUP)
                            return chat.isGroupChat;
                        
                        return !chat.isGroupChat
                    }).map((chat : ChatProps) => (
                        <AvatarRow 
                            key={chat.chatId}
                            isGroupChat={chat.isGroupChat}
                            chatId={chat.chatId}
                            chatName={chat.chatName} 
                            latestMessage={chat.latestMessage} 
                            avatarUrl={chat.avatarUrl}
                            isOnline={chat.isOnline}
                            onClick={() => { 
                                if (chatSelectionEnabled)
                                    return;
                                handleChatSelection(chat) 
                            }}
                            messages={chat.messages}
                            unreadMessagesCount={chat.unreadMessagesCount}
                            chatSelectionEnabled={chatSelectionEnabled}
                            user={user}
                        />
                    ))}
                </div>
            </div>

        </div>
    );
}