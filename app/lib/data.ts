import { Database, Tables, Enums } from "@/app/lib/database-types";
import { createClient } from "@/utils/supabase/server";
import { ChatProps } from "./descriptors";
import { SupabaseClient } from "@supabase/supabase-js";


export async function fetchAllChats(supabase: SupabaseClient<Database>) {
    const { data, error } = await supabase.auth.getUser();
    if (error || !data?.user)
        throw new Error('AuthError: user not loggedIn');

    console.log('userid : ',data?.user.id);
    const { data : userChannels, error : chatsError } = await supabase.from('channel_user_mapping')
                    .select(`channels(id, name, is_group)`)
                    .eq('user_id', data.user.id);

    if (chatsError)
        throw new Error('Error fetching chats');

    console.log(userChannels);

    const chats:Partial<ChatProps>[] = [];
    for (let i = 0 ; i < userChannels.length ; i++ ) {
        const channel = userChannels[i];
        if ( !channel.channels.is_group ) {
            const { data : channelUsers, error : channelUsersError } = await supabase.from('channel_user_mapping')
                .select(`users(
                            id, 
                            email, 
                            users_metadata(
                                first_name, 
                                last_name,
                                avatar_url, 
                                is_online, 
                                username
                            )
                )`)
                .eq('channel_id', channel.channels.id);
            
            if(channelUsersError) 
                throw new Error('Error fetching users for a chat');

            const { data : latestMessage, error : messageFail } = await supabase.from('messages')
                .select(`channel_id, message_id, sender_id, content, created_at`)
                .eq('channel_id', channel.channels.id)
                .order('created_at', { ascending: false}).limit(1);
            console.log('latestMessage : ',latestMessage);

            if(messageFail)
                throw new Error(`Error fetching latest message for a chatId : ${channel.channels.id}`);

            const otherUser = channelUsers.filter((user) => {
                return user.users.id !== data.user.id
            });

            console.log(otherUser)
            if (otherUser.length === 1) {
                const chat : Partial<ChatProps> = {
                    chatId : channel.channels.id,
                    chatName : `${otherUser[0].users.users_metadata?.first_name} ${otherUser[0].users.users_metadata?.last_name}`,
                    isGroupChat : channel.channels.is_group,
                    isOnline : !!otherUser[0].users.users_metadata?.is_online,
                    latestMessage : {
                        senderId:  latestMessage[0].sender_id,
                        createdAt : latestMessage[0].created_at,
                        read : false,
                        content : latestMessage[0].content
                    },
                    avatarUrl : otherUser[0].users.users_metadata?.avatar_url ?? undefined,
                    unreadMessagesCount : 0,
                };

                chats.push(chat);
            }

        }
        else {

        }
    }

    return chats;
}