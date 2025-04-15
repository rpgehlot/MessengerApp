import { IProfileSectionProps } from "@/app/lib/descriptors";
import {
    Sheet,
    SheetDescription,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
  } from "@/components/ui/sheet";

export default function ProfileSection({
    selectedChat,
    children
}: IProfileSectionProps) {

    const sharedImages = (selectedChat.messages || []).filter((msg) => {
        return msg.media?.type === 'image';
    }).map(msg => msg.media?.url);

    return (
        <Sheet>
            <SheetTrigger className="flex items-center gap-6 cursor-pointer grow">
               {children}
            </SheetTrigger>
        
            <SheetContent style={{ 'maxWidth' : 'none' }} className="w-full sm:w-sm lg:w-md">
                <SheetHeader className="overflow-auto">
                    <SheetTitle className="text-lg sm:text-2xl text-primary/60 leading-loose text-center">
                        <span>
                            Contact Info
                        </span>
                        <div className="flex flex-col p-4 sm:p-0 mt-2 justify-center items-center overflow-auto gap-4">
                            <div className="w-7/12 h-7/12">
                                <img src={selectedChat.avatarUrl} className="w-full h-full aspect-auto rounded-full object-cover" />
                                <span className="text-base sm:text-xl leading-tight font-medium text-primary/80">
                                    {selectedChat.chatName}
                                    <span className="block text-sm text-primary/60"> username: john99doe</span>
                                </span>
                            </div>

                            <div className="w-full mb-2 p-4 text-center border-t-1">
                                
                                <span className="text-left ">
                                    <h2 className="text-base text-primary/90 mb-2">About</h2>
                                    <p className="text-sm">
                                        Never give up in life. Whatever life throws at you, make it into an opportunity and not a cause of misery. :)
                                    </p>
                                </span>
                            
                            </div>

                            {sharedImages.length > 0 && (<div className="w-full mb-2 p-4 text-center border-t-1">
                                
                                <span className="text-left ">
                                    <h2 className="text-base text-primary/90 mb-2">Media</h2>
                                    <div className="flex flex-wrap gap-2 justify-start items-center">
                                            {
                                            sharedImages?.map(item => {
                                                return (
                                                    <span key={item} className="w-25 h-25">
                                                        <img className="w-full h-full object-cover antialiased rounded-sm" src={item} />
                                                    </span>
                                                )})
                                            }
                                    </div>
                                </span>
                            </div>)}
                            
                            <div className="w-full mb-2 p-4 text-center border-t-1">
                                
                                <span className="text-left ">
                                    <h2 className="text-base text-primary/90 mb-2">1 group in common</h2>
                                    <div className="flex gap-2 justify-start items-center">
                                        <div className="w-12 h-12 relative min-w-12">
                                            <img className="rounded-full object-contain" src={'https://randomuser.me/api/portraits/men/21.jpg'} />
                                        </div>
                                        <div className="flex flex-col justify-start items-start">
                                            <span className="text-base text-secondary-foreground/80"> Jon Farewell party</span>
                                            <span className="text-xs text-secondary-foreground/40 "> Luke jon, Lucky, Alice</span>
                                        </div>
                                    </div>
                                </span>
                            </div>
{/* 
                            <div className="w-full mb-2 p-4 text-center border-t-1">
                                
                                <span className="text-left ">
                                    <div className="flex gap-2 justify-start items-center">
                                        <button className=""> Delete chat</button>
                                    </div>
                                </span>
                            </div> */}

                        </div>
                    </SheetTitle>
                </SheetHeader>
            </SheetContent>
        </Sheet>
    )  
}