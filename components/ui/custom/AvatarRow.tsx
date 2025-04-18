'use client';

import moment from "moment";
import { ChatProps } from "@/app/lib/descriptors";
import clsx from "clsx";
import { useState } from "react";
import { Checkbox } from "@/components/ui/checkbox"


export function AvatarRow(
    { chatId, chatName, latestMessage, avatarUrl, isOnline, isGroupChat, messages = [], chatSelectionEnabled, unreadMessagesCount: x, onClick} : ChatProps
) {
    const len = messages?.length;
    const sentByMe = messages[len-1].sender.id === messages[len-1].loggedInUserId;
    const [unReadMessagesState, setUnReadMessagesState]= useState<boolean>(messages[len - 1].read);
    const [unreadMessagesCount, setUnreadMessagesCount]= useState<number>(x);
    // const [checked, setChecked] = useState<boolean>(false);
    return (
        <div 
            className={clsx("flex items-center justify-start p-2 pb-0 pt-0 cursor-pointer rounded-sm hover:bg-secondary-foreground/10 relative mb-0.5", (!sentByMe && !unReadMessagesState) ? 'bg-[#ffc0cb45]' : '')}
            onClick={() => {
                setUnReadMessagesState(true);
                setUnreadMessagesCount(0);
                onClick?.();
             }}
            key={chatId}
        >
            {chatSelectionEnabled && ( <Checkbox className="w-5 h-5 mr-2 border-2 cursor-pointer data-[state=checked]:bg-[#5c8d4f] data-[state=checked]:border-none border-zinc-400" />)}
            <div className="w-12 h-12 relative min-w-12">
                <img className="rounded-full object-contain" src={avatarUrl} />
                {!isGroupChat && isOnline && <span className="online-icon"></span>}
            </div>
            <div className="ml-4 border-b-1 grow p-4">
                <div className="relative flex items-center justify-between">
                    <h4 className="font-semibold text-md/snug text-primary/70">{chatName}</h4>

                    <span className="text-xs">
                        {moment(latestMessage.createdAt).format('LT')}
                    </span>
                </div>
                <div className="font-light text-sm text-secondary-foreground line-clamp-1">
                    {latestMessage.content}
                </div>
            </div>

            {unreadMessagesCount > 0 && <span className="absolute right-1.5 bottom-1.5 text-sm/5 bg-red-400/70 rounded-full w-5 h-5 align-middle text-center text-secondary">
                {unreadMessagesCount}
            </span>}
        </div>
    );
}