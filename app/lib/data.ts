import { Database, Tables, Enums } from "@/app/lib/database-types";
import { createClient } from "@/utils/supabase/server";
import { ChatProps } from "./descriptors";
import { SupabaseClient } from "@supabase/supabase-js";

const MESSAGES_PER_CALL = 50;

export async function fetchAllChats(supabase: SupabaseClient<Database>) {
    const { data, error } = await supabase.auth.getUser();
    if (error || !data?.user)
        throw new Error('AuthError: user not loggedIn');

    supabase.channel(data.user.id) // set your topic here

    console.log('userid : ',data?.user.id);
    const { data : userChannels, error : chatsError } = await supabase.from('channel_user_mapping')
                    .select(`channels(id, name, is_group, channel_description, avatar_url)`)
                    .eq('user_id', data.user.id);

    if (chatsError)
        throw new Error('Error fetching chats');


    const chats:Partial<ChatProps>[] = [];
    for (let i = 0 ; i < userChannels.length ; i++ ) {
        const channel = userChannels[i];

        const { data : latestMessage, error : messageFail } = await supabase.from('messages')
            .select(`channel_id, message_id, sender_id, content, created_at`)
            .eq('channel_id', channel.channels.id)
            .order('created_at', { ascending: false}).limit(1);
        if(messageFail)
            throw new Error(`Error fetching latest message for a chatId : ${channel.channels.id}`);

        const { data : channelUsers, error : channelUsersError } = await supabase.from('channel_user_mapping')
            .select(`users(
                        id, 
                        email, 
                        users_metadata(
                            first_name, 
                            last_name,
                            avatar_url, 
                            is_online, 
                            username,
                            bio
                        )
            )`)
            .eq('channel_id', channel.channels.id);

        if(channelUsersError) 
            throw new Error('Error fetching users for a chat');

        if ( !channel.channels.is_group ) {

            const otherUser = channelUsers.filter((user) => {
                return user.users.id !== data.user.id
            });

            const selfUser = channelUsers.filter((user) => {
                return user.users.id == data.user.id
            });

            if (otherUser.length === 1) {
                const chat : Partial<ChatProps> = {
                    chatId : channel.channels.id,
                    chatName : `${otherUser[0].users.users_metadata?.first_name} ${otherUser[0].users.users_metadata?.last_name}`,
                    isGroupChat : channel.channels.is_group,
                    isOnline : !!otherUser[0].users.users_metadata?.is_online,
                    latestMessage : latestMessage.length > 0 ? {
                        senderId:  latestMessage[0].sender_id,
                        createdAt : latestMessage[0].created_at,
                        read : false,
                        content : latestMessage[0].content,
                        messageId : latestMessage[0].message_id
                    } : undefined,
                    avatarUrl : otherUser[0].users.users_metadata?.avatar_url ?? undefined,
                    description : otherUser[0].users.users_metadata?.bio,
                    username : otherUser[0].users.users_metadata?.username,
                    unreadMessagesCount : 0,
                    members : [
                        {
                            userId : otherUser[0].users.id,
                            name : `${otherUser[0].users.users_metadata?.first_name} ${otherUser[0].users.users_metadata?.last_name}`,
                        },
                        {
                            userId : data?.user.id,
                            name : `${selfUser[0].users.users_metadata?.first_name} ${selfUser[0].users.users_metadata?.last_name}`
                        }
                    ]
                };

                chats.push(chat);
            }

        }
        else {


            const chat : Partial<ChatProps> = {
                chatId : channel.channels.id,
                chatName : channel.channels.name,
                isGroupChat : channel.channels.is_group,
                latestMessage :  latestMessage.length > 0 ? {
                    senderId:  latestMessage[0].sender_id,
                    createdAt : latestMessage[0].created_at,
                    read : false,
                    content : latestMessage[0].content,
                    messageId : latestMessage[0].message_id
                } : undefined,
                avatarUrl : channel.channels.avatar_url ?? undefined,
                description : channel.channels.channel_description ?? '',
                unreadMessagesCount : 0,
                members : channelUsers.map((user) => {
                    return  {
                        userId : user.users.id,
                        name : `${user.users.users_metadata?.first_name} ${user.users.users_metadata?.last_name}`,
                        avatarUrl : user.users.users_metadata?.avatar_url ?? undefined
                    }
                })
            };

            chats.push(chat);
        }


    }

    return chats;
}
