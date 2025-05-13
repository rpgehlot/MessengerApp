import { Database } from "@/app/lib/database-types";
import { Chat } from "./descriptors";
import { SupabaseClient } from "@supabase/supabase-js";


export async function fetchAllChats(supabase: SupabaseClient<Database>) {
    const { data, error } = await supabase.auth.getUser();
    if (error || !data?.user)
        throw new Error('AuthError: user not loggedIn');

    supabase.channel(data.user.id) // set your topic here

    const { data : userChannels, error : chatsError } = await supabase.from('channel_user_mapping')
                    .select(`channels(id, name, is_group, channel_description, avatar_url)`)
                    .eq('user_id', data.user.id);

    if (chatsError)
        throw new Error('Error fetching chats');


    const chats:Partial<Chat>[] = [];
    for (let i = 0 ; i < userChannels.length ; i++ ) {
        const channel = userChannels[i];

        const { data : latestMessage, error : messageFail } = await supabase.from('messages')
            .select(`
                message_id, 
                users(
                    email,
                    users_metadata(
                        first_name,
                        last_name,
                        avatar_url,
                        user_id
                    )
                ),
                created_at,
                content,
                status    
            `)
            .eq('channel_id', channel.channels.id)
            .order('created_at', { ascending: false}).limit(1);
            
        if(messageFail)
            throw new Error(`Error fetching latest message for a chatId : ${channel.channels.id}`);

        const { error, count } = await supabase.from('messages')
            .select('*',{ count : 'exact'})
            .eq('channel_id', channel.channels.id)
            .neq('sender_id',data.user.id)
            .in('status',['queued','delievered'])

        if(error)
            throw new Error(`Error fetching latest message for a chatId : ${channel.channels.id}`);

        const { data : channelUsers, error : channelUsersError } = await supabase.from('channel_user_mapping')
            .select(`users(
                        id, 
                        email, 
                        users_metadata(
                            first_name, 
                            last_name,
                            avatar_url, 
                            username,
                            bio
                        )
            )`)
            .eq('channel_id', channel.channels.id);

        if(channelUsersError) {
            console.log(channelUsersError);
            throw new Error('Error fetching users for a chat');
        }

        if ( !channel.channels.is_group ) {

            const otherUser = channelUsers.filter((user) => {
                return user.users.id !== data.user.id
            });

            const selfUser = channelUsers.filter((user) => {
                return user.users.id == data.user.id
            });

            if (otherUser.length === 1) {
                const chat : Chat = {
                    chatId : channel.channels.id,
                    chatName : `${otherUser[0].users.users_metadata?.first_name} ${otherUser[0].users.users_metadata?.last_name}`,
                    isGroupChat : channel.channels.is_group,
                    latestMessage : latestMessage.map((entry) => {
                        return {
                            messageId : entry.message_id,
                            createdAt : entry.created_at,
                            content : entry.content,
                            sender : {
                                name : `${entry.users.users_metadata?.first_name} ${entry.users.users_metadata?.last_name}`,
                                id : entry.users.users_metadata?.user_id!!,
                                email: entry.users.email,
                                avatarUrl: entry.users.users_metadata?.avatar_url!!,
                            },
                            status : entry.status
                        }
                    })[0],
                    avatarUrl : otherUser[0].users.users_metadata?.avatar_url ?? undefined,
                    description : otherUser[0].users.users_metadata?.bio,
                    // username : otherUser[0].users.users_metadata?.username,
                    unreadMessagesCount : count!!,
                    members : [
                        {
                            userId : otherUser[0].users.id,
                            name : `${otherUser[0].users.users_metadata?.first_name} ${otherUser[0].users.users_metadata?.last_name}`,
                        },
                        {
                            userId : data?.user.id,
                            name : `${selfUser[0].users.users_metadata?.first_name} ${selfUser[0].users.users_metadata?.last_name}`
                        }
                    ],
                    messages : []
                };

                chats.push(chat);
            }

        }
        else {


            const chat : Chat = {
                chatId : channel.channels.id,
                chatName : channel.channels.name,
                isGroupChat : channel.channels.is_group,
                latestMessage :  latestMessage.map((entry) => {
                    return {
                        messageId : entry.message_id,
                        createdAt : entry.created_at,
                        content : entry.content,
                        sender : {
                            name : `${entry.users.users_metadata?.first_name} ${entry.users.users_metadata?.last_name}`,
                            id : entry.users.users_metadata?.user_id!!,
                            email: entry.users.email,
                            avatarUrl: entry.users.users_metadata?.avatar_url!!,
                        },
                        status : entry.status
                    }
                })[0],
                avatarUrl : channel.channels.avatar_url ?? undefined,
                description : channel.channels.channel_description ?? '',
                unreadMessagesCount : count!!,
                members : channelUsers.map((user) => {
                    return  {
                        userId : user.users.id,
                        name : `${user.users.users_metadata?.first_name} ${user.users.users_metadata?.last_name}`,
                        avatarUrl : user.users.users_metadata?.avatar_url ?? undefined
                    }
                }),
                messages: []
            };

            chats.push(chat);
        }


    }

    return chats.sort((a,b)=>{
        if (a.latestMessage && b.latestMessage)
            return new Date(b.latestMessage.createdAt).getTime() - new Date(a.latestMessage.createdAt).getTime();
        return Infinity;
    });

}
