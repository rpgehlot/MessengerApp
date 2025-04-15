import { IMuteNotificationProps } from "@/app/lib/descriptors";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
  } from "@/components/ui/dialog";
import { Button } from "../button";
import { SpeakerXMarkIcon } from '@heroicons/react/24/outline';

export default function MuteNotification(props : IMuteNotificationProps) {
    return (
        <Dialog>
            <DialogTrigger className="flex">
            {props.children}
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle className="flex flex-col items-start">
                        <div>
                            <span className="inline-block align-middle mr-2 text-red-400">
                                <SpeakerXMarkIcon className="size-8"/>
                            </span>

                            <span className="inline-block align-middle text-lg text-zinc-600/90">
                                    Mute Notifications
                            </span>
                        </div>
                      

                        <div className="pt-0 w-full">
                            <div className="text-left py-4 text-zinc-600/70 text-base">
                                Are you sure to mute the notifications for this chat?
                            </div>

                            <div className=" flex items-center justify-end w-full gap-2">
                                <Button variant={'outline'} size={'lg'}>
                                    cancel
                                </Button>
                                <Button className="bg-primary/80 cursor-pointer" variant={'default'} size={'lg'}>
                                    Mute
                                </Button>
                            </div>
                        </div>
                    </DialogTitle>
                </DialogHeader>
            </DialogContent>
        </Dialog>
    )
}
