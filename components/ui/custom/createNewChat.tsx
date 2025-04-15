import { ICreateNewChatProps } from "@/app/lib/descriptors";
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
import { useState } from "react";
import { randomNewChats } from "@/lib/placeholder-data";

export default function CreateNewChat(props : ICreateNewChatProps){
    const [searchQuery, setSearchQuery] = useState<string>('');

    const handleSearchQueryChange = (e : any) => {
        const searchQuery = e.target.value.toString();
        setSearchQuery(e.target.value);
    };

    return (
        <Dialog>
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
                            <Input placeholder="Search by username" defaultValue={searchQuery} />
                        </div>

                        <div className="flex flex-col items-center justify-around py-4">
                            {
                                randomNewChats.map((user) => (
                                    <div key={user.name} className={"w-full flex items-center justify-start p-2 cursor-pointer rounded-sm hover:bg-secondary-foreground/10 relative mb-0.5"}>
                                
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
                                    </div>
                                ))
                            }
                            
                        </div>
                   </div>
                </DialogTitle>
                {/* <DialogDescription className="p-2">
                    
                </DialogDescription> */}
                </DialogHeader>
            </DialogContent>
        </Dialog>
    )
}