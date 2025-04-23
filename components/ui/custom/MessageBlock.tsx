import { MessageBlock } from '@/app/lib/descriptors';
import clsx from 'clsx';
import moment from 'moment';
import { useState } from 'react';
import { Skeleton } from '../skeleton';
import { Checkbox } from '../checkbox';
import { Label } from "@/components/ui/label"

export function Message(props : MessageBlock ) {

    const [imageLoaded, setImageLoaded] = useState<boolean>(false);

    const sentByMe = props.sender.id === props.loggedInUserId;
    return (
        <Label style={{'overflowAnchor' : 'none'}} className={clsx('my-1 relative block', props.messageSelectionEnabled ? 'group' : '')}>
             {props.messageSelectionEnabled && ( 
                <Checkbox className="peer absolute left-2 top-[25%] transform -translate-y-[50%] w-5 h-5 mr-2 border-2 cursor-pointer data-[state=checked]:bg-[#5c8d4f] data-[state=checked]:border-none border-zinc-400" onCheckedChange={(checked) => {
                    props.onMessageSelectionChange({...props}, Boolean(checked));
                }} />
            )}
            <div 
                style={{
                    'overflowAnchor' : 'none'
                }}
                className={clsx('flex items-start justify-start anchor p-1 pl-8 rounded-sm peer-data-[state=checked]:bg-zinc-300/40 group-hover:bg-zinc-300/40 group-hover:cursor-pointer', sentByMe ? 'flex-row-reverse'  : 'flex-row', )}>
                    
                <img 
                    className="w-8 h-8 rounded-full cursor-pointer"
                    src={props.sender.avatarUrl} 
                />
                <div className='flex items-start justify-center'>
                    <span className={clsx(
                        sentByMe ? 'rotate-y-180 order-2 -ml-0.5' : 'rotate-x-0 -mr-0.5'
                    )}>
                        <svg 
                            viewBox="0 0 8 13" 
                            height="18" 
                            width="13" 
                            preserveAspectRatio="xMidYMid meet" 
                            className="" 
                            version="1.1" 
                            x="0px" 
                            y="0px" 
                            enableBackground="new 0 0 8 13">
                            <title>tail-in</title>
                            <path 
                                opacity="0.13" 
                                fill={sentByMe ? '#e1efdd' : '#e4e4e7b3'} 
                                d="M1.533,3.568L8,12.193V1H2.812 C1.042,1,0.474,2.156,1.533,3.568z">
                            </path>
                            <path 
                                fill={sentByMe ? '#e1efdd' : '#e4e4e7b3'} 
                                d="M1.533,2.568L8,11.193V0L2.812,0C1.042,0,0.474,1.156,1.533,2.568z">
                            </path>
                        </svg>
                    </span>
                    <div 
                            key={props.messageId}
                            className={clsx(
                                'rounded-lg max-w-md opacity-80 mb-4 text-primary shadow-md flex gap-3 items-end',  
                                sentByMe ? 'bg-[#e1efdd] ml-auto rounded-r-none' : 'bg-zinc-200/70 mr-auto rounded-l-none',
                                props.media?.type ? 'flex-col p-0.5 pb-3' : 'flex-row p-3'
                            )}
                        >
                        
                        <div className='text-xs sm:text-base font-normal antialiased'>
                        

                            {!sentByMe && props.displayName && (
                                <span className='block text-xs -mt-0.5'>
                                    {props.sender.name}
                                </span>
                            )}

                            {props.content && (<span>
                                {props.content}
                            </span>)}
                            
                            {props.media?.type ==='image' && (
                                <div className='relative w-xs h-50 sm:w-sm min-h-40 sm:min-h-60 aspect-auto'>
                                    {!imageLoaded && <Skeleton className="m-0.5 ml-1.5 absolute inset-0" /> }
                                    <img 
                                        src={props.media.url} 
                                        className='w-full h-full object-contain cursor-pointer [image-rendering:auto]' 
                                        alt="test image" 
                                        onLoad={() => setImageLoaded(true)}
                                    />
                                </div>
                            )}

                        </div>
                        <div className='text-[10px] font-light text-secondary-foreground -mb-2 min-w-16 text-right'>
                            <span className='inline-block'>
                                {moment.utc(props.createdAt).local().format('LT')}
                            </span>
                            {sentByMe && (<span className='inline-block align-middle mx-1'>
                                <svg viewBox="0 0 16 11" height="11" width="16" preserveAspectRatio="xMidYMid meet" className="" fill={props.read ? '#53bdeb' : '#8696a0'}><title>msg-dblcheck</title><path d="M11.0714 0.652832C10.991 0.585124 10.8894 0.55127 10.7667 0.55127C10.6186 0.55127 10.4916 0.610514 10.3858 0.729004L4.19688 8.36523L1.79112 6.09277C1.7488 6.04622 1.69802 6.01025 1.63877 5.98486C1.57953 5.95947 1.51817 5.94678 1.45469 5.94678C1.32351 5.94678 1.20925 5.99544 1.11192 6.09277L0.800883 6.40381C0.707784 6.49268 0.661235 6.60482 0.661235 6.74023C0.661235 6.87565 0.707784 6.98991 0.800883 7.08301L3.79698 10.0791C3.94509 10.2145 4.11224 10.2822 4.29844 10.2822C4.40424 10.2822 4.5058 10.259 4.60313 10.2124C4.70046 10.1659 4.78086 10.1003 4.84434 10.0156L11.4903 1.59863C11.5623 1.5013 11.5982 1.40186 11.5982 1.30029C11.5982 1.14372 11.5348 1.01888 11.4078 0.925781L11.0714 0.652832ZM8.6212 8.32715C8.43077 8.20866 8.2488 8.09017 8.0753 7.97168C7.99489 7.89128 7.8891 7.85107 7.75791 7.85107C7.6098 7.85107 7.4892 7.90397 7.3961 8.00977L7.10411 8.33984C7.01947 8.43717 6.97715 8.54508 6.97715 8.66357C6.97715 8.79476 7.0237 8.90902 7.1168 9.00635L8.1959 10.0791C8.33132 10.2145 8.49636 10.2822 8.69102 10.2822C8.79681 10.2822 8.89838 10.259 8.99571 10.2124C9.09304 10.1659 9.17556 10.1003 9.24327 10.0156L15.8639 1.62402C15.9358 1.53939 15.9718 1.43994 15.9718 1.32568C15.9718 1.1818 15.9125 1.05697 15.794 0.951172L15.4386 0.678223C15.3582 0.610514 15.2587 0.57666 15.1402 0.57666C14.9964 0.57666 14.8715 0.635905 14.7657 0.754395L8.6212 8.32715Z" fill={props.read ? '#53bdeb' : '#8696a0'}></path></svg>
                            </span>)}
                        </div>
                    </div>
            </div>
            </div>
        </Label>
    );
}