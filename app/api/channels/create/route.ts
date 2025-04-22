import { Tables } from '@/app/lib/database-types';
import { ChatProps } from '@/app/lib/descriptors';
import { createClient } from '@/utils/supabase/server'

function generateResponse(channelId: number, otherUser : Omit<Tables<'users_metadata'>,"id">, selfUser : Omit<Tables<'users_metadata'>, 'id'>, insertChannel : Tables<'channels'>) {
    return {
        chatId : channelId,
        chatName : `${otherUser.first_name} ${otherUser.last_name}`,
        isGroupChat : insertChannel.is_group,
        isOnline : !!otherUser.is_online,
        latestMessage : {},
        avatarUrl : otherUser.avatar_url ?? undefined,
        description : otherUser.bio,
        username : otherUser.username,
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
        ]
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
    let response = {};
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
                    is_online, 
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

        const toUserChannel = supabase.channel(messageBody.toUser)
        toUserChannel.subscribe((status) => {
            if (status !== 'SUBSCRIBED') {
              return null
            }
            toUserChannel.send({
              type: 'broadcast',
              event: 'shout',
              payload: otherUserResponse,
            })
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
                            is_online, 
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
            .select(`channel_id, message_id, sender_id, content, created_at`)
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
                isOnline : !!otherUser[0].users.users_metadata?.is_online,
                latestMessage : {
                    senderId:  latestMessage.sender_id,
                    createdAt : latestMessage.created_at,
                    read : false,
                    content : latestMessage.content,
                    messageId : latestMessage.message_id
                },
                avatarUrl : otherUser[0].users.users_metadata?.avatar_url ?? undefined,
                description : otherUser[0].users.users_metadata?.bio,
                username : otherUser[0].users.users_metadata?.username,
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
                ]
            };

        }

    }
    
    console.log('returning channelId : ',channelId);
      

    return Response.json({ response  })

  }
