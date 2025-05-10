'use client';

import moment from "moment";
import { ChatProps, TypingUserPayload } from "@/app/lib/descriptors";
import clsx from "clsx";
import { useContext, useEffect, useState } from "react";
import { Checkbox } from "@/components/ui/checkbox"
import { formatDate } from '@/lib/utils'
import { ChatAppContext } from "../layouts/chatWrapper";

export function AvatarRow(
    { chatId, chatName, latestMessage, avatarUrl, isOnline, isGroupChat, user, chatSelectionEnabled, members,  unreadMessagesCount: x, onClick} : ChatProps
) {
    const sentByMe = latestMessage?.sender?.id === user.id;
    const [unReadMessagesState, setUnReadMessagesState]= useState<boolean>(latestMessage?.status !== 'read');
    const [unreadMessagesCount, setUnreadMessagesCount]= useState<number>(x);
    const chatContext = useContext(ChatAppContext);

    useEffect(() => {
        setUnreadMessagesCount(x);
        setUnReadMessagesState(latestMessage?.status !=='read')
    },[x, latestMessage]);

    const membersSet = new Set([...members.map(m => m.userId)]);
    const isSomeUserTyping = chatContext.typingUsers?.find((entry : TypingUserPayload) => {
        return entry.channelId === chatId && membersSet.has(entry.userId) && chatContext.selectedChat?.chatId != chatId
    });

    return (
        <div 
            className={clsx("flex items-center justify-start p-2 pb-0 pt-0 cursor-pointer rounded-sm hover:bg-secondary-foreground/10 relative mb-0.5 min-h-18", (!sentByMe && unReadMessagesState) ? 'bg-[#ffc0cb45]' : '')}
            onClick={() => {
                setUnReadMessagesState(false);
                setUnreadMessagesCount(0);
                onClick?.();
             }}
            key={chatId}
        >
            {chatSelectionEnabled && ( <Checkbox className="w-5 h-5 mr-2 border-2 cursor-pointer data-[state=checked]:bg-[#5c8d4f] data-[state=checked]:border-none border-zinc-400" />)}
            <div className="w-12 h-12 relative min-w-12">
                <img className="rounded-full object-contain" src={avatarUrl ?? `https://ui-avatars.com/api/?name=${chatName}&background=random`} />
                {!isGroupChat && isOnline && <span className="online-icon"></span>}
            </div>
            <div className="ml-4 grow p-4">
                <div className="relative flex items-center justify-between">
                    <h4 className="font-semibold text-md/snug text-primary/70">{chatName}</h4>

                    <span className="text-xs">
                        {latestMessage?.createdAt ? formatDate(latestMessage.createdAt) : null}
                    </span>
                </div>
                <div className="font-light text-sm text-secondary-foreground line-clamp-1">
                    {isSomeUserTyping && <span className="text-xs">{isSomeUserTyping.topic} is typing...</span>}
                    {!isSomeUserTyping && latestMessage?.content}
                </div>
            </div>

            {unreadMessagesCount > 0 && <span className="absolute right-1.5 bottom-1.5 text-sm/5 bg-red-400/70 rounded-full w-5 h-5 align-middle text-center text-secondary">
                {unreadMessagesCount}
            </span>}
        </div>
    );
}