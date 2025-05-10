'use client';
import React from 'react'
import { Popover, PopoverContent, PopoverTrigger } from '../popover';
import { UserCircleIcon } from '@heroicons/react/24/solid';
import clsx from 'clsx';
import { createClient } from '@/utils/supabase/client';
import { useRouter } from 'next/navigation';

type Props = {}

const MenuBar = (props: Props) => {

    const router = useRouter();
    const logOutUser = async () => {
        const supabase = createClient();
        const { error } = await supabase.auth.signOut();
        if (!error)
            router.push('/login');
    };

    return (
        <Popover modal={true}>
            <PopoverTrigger>
                <span className={clsx("inline-block align-middle pr-0 sm:p-2 cursor-pointer rounded-full focus:bg-gray-300/40 active:bg-gray-300/40")}>
                    <UserCircleIcon className='size-8 text-zinc-600/90' />
                </span>
            </PopoverTrigger>
            <PopoverContent align='end' sideOffset={-3} className="w-40 sm:w-50 rounded-sm px-0">
                <div className="flex flex-col text-sm sm:text-base text-zinc-800/90 font-light">
                    {/* <span key={'Select chats'} className="p-2 px-4 hover:bg-zinc-300/20 cursor-pointer">
                        Settings
                    </span>
                    <span key={'refer&earn'} className="p-2 px-4 hover:bg-zinc-300/20 cursor-pointer">
                        Refer & earn 
                    </span> */}
                    <span key={'logout'} onClick={logOutUser} className="p-2 px-4 hover:bg-zinc-300/20 cursor-pointer" >
                        Log out
                    </span>

                    
                </div>
            </PopoverContent>
        </Popover>
    );
}

export default MenuBar;