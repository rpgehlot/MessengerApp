import { ChatProps, ICreateNewChatProps, IUsersSearch } from "@/app/lib/descriptors";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
  } from "@/components/ui/dialog";
import { Input } from "../input";
import { MagnifyingGlassIcon, ArrowUpRightIcon } from "@heroicons/react/16/solid";
import { Suspense, use, useContext, useState } from "react";
// import { randomNewChats } from "@/lib/placeholder-data";
import { useDebouncedCallback } from 'use-debounce';
import { Skeleton } from "../skeleton";
import { ChatAppContext } from "../layouts/chatWrapper";

export function SkeletonRow() {
    return (
      <div className="w-full flex items-center space-x-4 justify-start p-2 cursor-pointer rounded-sm  mb-0.5">
        <Skeleton className="h-12 w-12 rounded-full" />
        <div className="space-y-2">
          <Skeleton className="h-4 w-[250px]" />
          <Skeleton className="h-4 w-[200px]" />
        </div>
      </div>
    )
}
  
export default function CreateNewChat(props : ICreateNewChatProps){
    const [searchQuery, setSearchQuery] = useState<string>('');
    const [filteredUsers, setFilteredUsers] = useState<IUsersSearch[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [dialogOpen, setDialogOpen] = useState<boolean>(false);

    const chatContext = useContext(ChatAppContext)
    const debounced = useDebouncedCallback(async(value) => {
        try {
            const res = await fetch(`/api/search/users?query=${value}&limit=10`);
            const { data }  = await res.json();
            console.log(data);
            setFilteredUsers(data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    },500);

    const onStartChat = (user: IUsersSearch) => {
        const foundChat = chatContext.chats.filter((chat: ChatProps) => chat.members.find(m => m.userId === user.userId && !chat.isGroupChat));
        console.log(foundChat[0]);
        if (foundChat.length > 0 ) {
            chatContext.handleClick(foundChat[0]);
        }
        else {
            chatContext.setSelectedChat({
                avatarUrl : user.avatarUrl,
                chatName : user.name,
                description : '',
                isGroupChat : false,
                username : user.username,
                members : [
                    {
                        userId : user.userId,
                        name : user.name
                    }
                ],
                newChat  : {
                    userId : user.userId
                }
            });
        }

        setDialogOpen(false);
        props.setChatMenuOpenState(false);

    };

    const handleSearchQueryChange = async(e) => {
        setLoading(true);
        setSearchQuery(e.target.value);
        console.log(e.target.value);
        debounced(e.target.value);
    };

    

    return (
        <>
            <span key={'newUser'} className="p-2 px-4 hover:bg-zinc-300/20 cursor-pointer grow text-left" onClick={() => setDialogOpen(true)}>
                New chat
            </span>
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                <DialogTrigger className="flex">
                {props.children}
                </DialogTrigger>
                <DialogContent className="px-1">
                    <DialogHeader>
                    <DialogTitle className="p-0 sm:p-2">
                        <div className="text-left px-4">
                            <span className="inline-block align-middle mr-2 text-red-400">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12.76c0 1.6 1.123 2.994 2.707 3.227 1.068.157 2.148.279 3.238.364.466.037.893.281 1.153.671L12 21l2.652-3.978c.26-.39.687-.634 1.153-.67 1.09-.086 2.17-.208 3.238-.365 1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0 0 12 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018Z" />
                                </svg>
                            </span>

                            <span className="inline-block align-middle text-2xl">
                                <span className="text-red-400">N</span>ew Chat
                            </span>
                        </div>
                    

                        <div className="p-2 mt-4 mb-4">
                            <div className="relative">
                                <span className="absolute left-0 top-1/2 -translate-y-[50%] transform ml-2" >
                                    <MagnifyingGlassIcon className="size-6 text-red-300" />
                                </span>
                                <Input placeholder="Search by username" value={searchQuery} onChange={handleSearchQueryChange} />
                            </div>

                            <div className="flex flex-col items-center py-4 h-120 overflow-auto">
                                {loading && (
                                    Array.from({ length : 10 }).map((_,i) => <SkeletonRow key={i}/>)
                                )}

                                {!loading && (
                                    filteredUsers.map((user) => (
                                        <button onClick={() => onStartChat(user)} key={user.userId} className={"w-full flex items-center justify-start p-2 cursor-pointer rounded-sm hover:bg-secondary-foreground/10 relative mb-0.5"}>
                                    
                                            <div className="w-12 h-12 relative min-w-12">
                                                <img className="rounded-full object-contain" src={user.avatarUrl} />
                                                <span className="online-icon"></span>
                                            </div>
                                            <div className="ml-4 grow p-4">
                                                <div className="relative flex items-center justify-between">
                                                    <h4 className="font-semibold text-base/snug text-primary/70">{user.name}</h4>
                                                </div>
                                            </div>
                                            <span className="text-xs text-primary/60 cursor-pointer">
                                                message
                                            </span>
                                        </button>
                                    ))
                                )}
                                
                            </div>
                        
                    </div>
                    </DialogTitle>
                    {/* <DialogDescription className="p-2">
                        
                    </DialogDescription> */}
                    </DialogHeader>
                </DialogContent>
            </Dialog>
        </>
    )
}