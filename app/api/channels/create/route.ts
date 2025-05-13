import { Tables } from '@/app/lib/database-types';
import { Chat, ChatProps } from '@/app/lib/descriptors';
import { createClient } from '@/utils/supabase/server'

function generateResponse(channelId: number, otherUser : Omit<Tables<'users_metadata'>,"id">, selfUser : Omit<Tables<'users_metadata'>, 'id'>, insertChannel : Tables<'channels'>):Chat {
    return {
        chatId : channelId,
        chatName : `${otherUser.first_name} ${otherUser.last_name}`,
        isGroupChat : insertChannel.is_group,
        avatarUrl : otherUser.avatar_url ?? undefined,
        description : otherUser.bio,
        unreadMessagesCount : 0,
        members : [
            {
                userId : otherUser.user_id,
                name : `${otherUser.first_name} ${otherUser.last_name}`
            },
            {
                userId : selfUser.user_id,
                name : `${selfUser.first_name} ${selfUser.last_name}`
            }
        ],
        messages : []
    };
}


export async function POST(request: Request) {

    const messageBody = await request.json();
    const supabase = await createClient();
   
    const { data : user, error  } = await supabase.auth.getUser();
    if ( error )
        throw new Error('error fetching user');

    console.log(messageBody);
    console.log('loggedin user : ',user.user.id);

    const commonChannelExists = await supabase.rpc('checkifcommonchannelexists', {
        user_id1: user.user.id,
        user_id2: messageBody.toUser,
        isgroup : false
    });

    if (!commonChannelExists.data)
        throw new Error('Unknown error occured');

    let channelId;
    let response:Chat;
    console.log('commonChannelExists : ',commonChannelExists);
    if ( commonChannelExists.data.length === 0) {

        const { data : insertChannel, error } = await supabase.from('channels').insert({
            is_group: false,
            name : `${messageBody.toUser}`,
        }).select().single();
        
        console.log('insertChannel : ',insertChannel);
        console.log('insertChannelerror : ',error);

        if ( error ) 
            throw new Error('error creating a new channel');

        const { data:insertChannelUserMapping, error:insertChannelUserMappingError } = await supabase.from('channel_user_mapping').insert([
            {
                user_id : user.user.id,
                channel_id : insertChannel.id,
            },
            {
                user_id : messageBody.toUser,
                channel_id : insertChannel.id,
            }
        ]).select();

        console.log('insertChannelUserMapping : ',insertChannelUserMapping);
        console.log('insertChannelUserMappingError : ',insertChannelUserMappingError);


        if(insertChannelUserMappingError) 
            throw new Error('error creating a new channel user mapping');


        const { data : users, error : usersError } = await supabase.from('users_metadata')
            .select(`
                    first_name, 
                    last_name,
                    avatar_url, 
                    username,
                    bio,
                    user_id
            `)
            .in('user_id', [user.user.id, messageBody.toUser]);

        if(usersError) 
            throw new Error('Error fetching users for a chat');

        const otherUser = users.filter((u) => {
            return u.user_id !== user.user.id
        });

        const selfUser = users.filter((u) => {
            return u.user_id == user.user.id
        });


        const {data:insertChannelLastSequence, error:insertChannelLastSequenceError } = await supabase.from('last_sequence').insert({
            last_sequence : 0,
            channel_id : insertChannel.id
        }).select().single();

        if(insertChannelLastSequenceError) 
            throw new Error('error creating a new channel last sequence');
        
        console.log('insertChannelLastSequence : ',insertChannelLastSequence);
        console.log('insertChannelLastSequenceError : ',insertChannelLastSequenceError);

        channelId = insertChannel.id;

        response = generateResponse(channelId, otherUser[0], selfUser[0], insertChannel);
        const otherUserResponse = generateResponse(channelId, selfUser[0], otherUser[0], insertChannel);

        await supabase.channel(messageBody.toUser).send({
            type: 'broadcast',
            event: 'shout',
            payload: {event : 'newChat', data : otherUserResponse},
        });

        await supabase.channel(selfUser[0].user_id).send({
            type: 'broadcast',
            event: 'shout',
            payload: {event : 'newChat', data : response},
        });
    }
    else if (commonChannelExists.data.length > 0){
        channelId = commonChannelExists.data[0].channel_id;
        const { data : channel, error: channelError } = await supabase.from('channels')
            .select(`
                name,
                is_group
            `)
            .eq('id',channelId)
            .single();
        
        if ( channelError )
           throw new Error('Error fetching channel details');

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
            .eq('channel_id', channelId);

        if(channelUsersError) 
            throw new Error('Error fetching users for a chat');


        const otherUser = channelUsers.filter((u) => {
            return u.users.id !== user.user.id
        });

        const selfUser = channelUsers.filter((u) => {
            return u.users.id == user.user.id
        });

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
            .eq('channel_id', channelId)
            .order('created_at', { ascending: false}).single();
        
        if(messageFail)
            throw new Error(`Error fetching latest message for a chatId : ${channelId}`);


        console.log(otherUser)
        if (otherUser.length === 1) {
            response = {
                chatId : channelId,
                chatName : `${otherUser[0].users.users_metadata?.first_name} ${otherUser[0].users.users_metadata?.last_name}`,
                isGroupChat : channel.is_group,
                latestMessage :  {
                        messageId : latestMessage.message_id,
                        createdAt : latestMessage.created_at,
                        content : latestMessage.content,
                        sender : {
                            name : `${latestMessage.users.users_metadata?.first_name} ${latestMessage.users.users_metadata?.last_name}`,
                            id : latestMessage.users.users_metadata?.user_id!!,
                            email: latestMessage.users.email,
                            avatarUrl: latestMessage.users.users_metadata?.avatar_url!!,
                        },
                        status : latestMessage.status
                },
                avatarUrl : otherUser[0].users.users_metadata?.avatar_url ?? undefined,
                description : otherUser[0].users.users_metadata?.bio,
                unreadMessagesCount : 0,
                members : [
                    {
                        userId : otherUser[0].users.id,
                        name : `${otherUser[0].users.users_metadata?.first_name} ${otherUser[0].users.users_metadata?.last_name}`
                    },
                    {
                        userId : user?.user.id,
                        name : `${selfUser[0].users.users_metadata?.first_name} ${selfUser[0].users.users_metadata?.last_name}`
                    }
                ],
                messages : []
            };

        }

    }
    
    console.log('returning channelId : ',channelId);
      

    return Response.json({ response  })

  }
