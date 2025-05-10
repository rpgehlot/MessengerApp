import {  ICreateNewGroupChatProps, IUsersSearch } from "@/app/lib/descriptors";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
  } from "@/components/ui/dialog";
import { Input } from "../input";
import { Textarea } from "@/components/ui/textarea"

import { MagnifyingGlassIcon, XCircleIcon } from "@heroicons/react/16/solid";
import { useEffect, useState } from "react";
import { randomNewChats } from "@/lib/placeholder-data";
import { Button } from "../button";
import { useDebouncedCallback } from "use-debounce";
import { SkeletonRow } from "./createNewChat";

export default function CreateNewGroupChat(props : ICreateNewGroupChatProps){
    const [groupName, setGroupName] = useState<string>('');
    const [groupDescription, setGroupDescription] = useState<string>('');
    const [users, setUsers] = useState<IUsersSearch[]>([]);
    const [dialogOpen, setDialogOpen] = useState<boolean>(false);
    const [searchQuery, setSearchQuery] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(false);
    const [filteredUsers, setFilteredUsers] = useState<IUsersSearch[]>([]);



    const debounced = useDebouncedCallback(async(value) => {
        try {
            const res = await fetch(`/api/search/users?query=${value}&limit=5`);
            const { data }  = await res.json();
            setFilteredUsers(data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    },500);

    const createGroup = async () => {
        try {
            const res = await fetch(`/api/channels/group/create`,{ 
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    groupName,
                    groupDescription,
                    userIds : users.map(u => u.userId)
                }),
            });

            const { data }  = await res.json();
            console.log(data);
        } catch (error) {
            console.error(error);
        } finally {
            setDialogOpen(false);
            props.setChatMenuOpenState(false);
        }
    };

    const handleSearchQueryChange = async(e) => {
        setLoading(true);
        setSearchQuery(e.target.value);
        console.log(e.target.value);
        debounced(e.target.value);
    };

    const addUser = (user : IUsersSearch) => {
        const exists = users.find(u => u.userId === user.userId);
        if (!exists)
            setUsers([...users, user]);
    };

    const deleteUser = (user:IUsersSearch) => {
        const idx = users.findIndex(u => u.userId === user.userId);
        if (idx >= 0) {
            const newUsers = [...users];
            newUsers.splice(idx,1);
            setUsers(newUsers);
        }
    };

    useEffect(() => {
        debounced('');
    },[]);
    
    return (
    <>
         <span key={'groupChat'} className="p-2 px-4 hover:bg-zinc-300/20 cursor-pointer grow text-left" onClick={() => setDialogOpen(true)}>
            Group Chat
        </span>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger className="flex">
              {props.children}
            </DialogTrigger>
            <DialogContent className="pb-0">
                <DialogHeader>
                <DialogTitle>
                    <span className="inline-block align-middle mr-2 text-red-400">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12.76c0 1.6 1.123 2.994 2.707 3.227 1.068.157 2.148.279 3.238.364.466.037.893.281 1.153.671L12 21l2.652-3.978c.26-.39.687-.634 1.153-.67 1.09-.086 2.17-.208 3.238-.365 1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0 0 12 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018Z" />
                        </svg>
                    </span>

                    <span className="inline-block align-middle text-2xl">
                        <span className="text-red-400">G</span>roup Chat
                    </span>

                    <div className="p-2 mt-4">
                        <div className="flex flex-col items-center justify-between gap-2">
                            <div className="relative w-full">
                                <span className="absolute left-0 top-1/2 -translate-y-[50%] transform ml-2" >
                                    <MagnifyingGlassIcon className="size-6 text-red-300" />
                                </span>
                                <Input placeholder="Enter Group name" value={groupName} onChange={(e) => setGroupName(e.target.value)} />
                            </div>

                            <div className="relative w-full">
                                    <Textarea placeholder="Enter group description" value={groupDescription} onChange={(e) => setGroupDescription(e.target.value)}/>
                            </div>
                        </div>
                      

                        <div className="flex flex-col items-center justify-around py-4">
                            <div className="w-full relative">
                                <span className="absolute left-0 top-1/2 -translate-y-[50%] transform ml-2" >
                                    <MagnifyingGlassIcon className="size-6 text-red-300" />
                                </span>
                                <Input placeholder="Search by username" value={searchQuery} onChange={handleSearchQueryChange}/>
                            </div>

                            <div className="w-full mt-2 flex flex-wrap items-center justify-start space-x-2 mb-2">
                                {
                                    users.map((user) => {
                                        return (
                                            <div className="flex items-center justify-center p-2 rounded-xl text-xs bg-red-300/60 cursor-pointer hover:bg-red-300/40 mb-1">
                                                <span key={user.userId} className="text-xs mr-1">
                                                    {user.name}
                                                </span>
                                                <span>
                                                    <XCircleIcon className="size-4" onClick={() => deleteUser(user)} />
                                                </span>
                                            </div>
                                        )
                                    })
                                }
                            </div>
                            <h3 className="text-base text-primary/80 mr-auto py-2 pl-2">Add people to group</h3>
                            <div className="flex flex-col items-center py-4 h-100 overflow-auto w-full">
                                {loading && (
                                        Array.from({ length : 5 }).map((_,i) => <SkeletonRow key={i}/>)
                                )}

                                {
                                    filteredUsers.filter(u => u.userId !== props.user.id).map((user) => (
                                        <div 
                                            key={user.name} 
                                            className={"w-full flex items-center justify-between p-2 cursor-pointer rounded-sm hover:bg-secondary-foreground/10 relative mb-0.5"}
                                            onClick={() => addUser(user)}
                                        >
                                    
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
                                                Add
                                            </span>
                                        </div>
                                    ))
                                }
                            </div>
                            
                            <div className=" flex items-center justify-end w-full gap-2">
                                <Button variant={'outline'} size={'lg'} onClick={() => setDialogOpen(false)} className="cursor-pointer">
                                    cancel
                                </Button>
                                <Button variant={'default'} size={'lg'} onClick={createGroup} className="cursor-pointer">
                                    Create
                                </Button>
                            </div>
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