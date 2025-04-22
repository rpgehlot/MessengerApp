import { Tables } from '@/app/lib/database-types';
import { ChatProps } from '@/app/lib/descriptors';
import { createClient } from '@/utils/supabase/server';


export async function POST(request: Request) {

    const messageBody = await request.json();
    const supabase = await createClient();
   
    const { data : user, error  :userError  } = await supabase.auth.getUser();
    if ( userError )
        throw new Error('error fetching user');

    const {
        groupName,
        groupDescription,
        userIds
    } = messageBody;
    console.log(messageBody);
    console.log('loggedin user : ',user.user.id);

    let allUserIdsInGroup = userIds.concat(user.user.id);
    const { data : insertChannel, error } = await supabase.from('channels').insert({
        is_group: true,
        channel_description : groupDescription,
        name : groupName,
        avatar_url : `https://ui-avatars.com/api/?name=${groupName}&background=random`
    }).select().single();
    
    if ( error ) 
        throw new Error('error creating a new channel');

    const channelUserMappingList = allUserIdsInGroup.map((id : string) => {
        return {
            user_id : id,
            channel_id : insertChannel.id
        };
    });

    const { data:insertChannelUserMapping, error:insertChannelUserMappingError } = await supabase.from('channel_user_mapping').insert(channelUserMappingList).select();

    console.log('insertChannelUserMapping : ',insertChannelUserMapping);
    console.log('insertChannelUserMappingError : ',insertChannelUserMappingError);


    if(insertChannelUserMappingError) 
        throw new Error('error creating a new channel user mapping');

    const { data : users, error : usersError } = await supabase.from('users_metadata')
        .select(`
                first_name, 
                last_name,
                user_id
        `)
        .in('user_id', allUserIdsInGroup);

    if (usersError)
        throw new Error('Error fetching users metadata while creating group channel');

    const {data:insertChannelLastSequence, error:insertChannelLastSequenceError } = await supabase.from('last_sequence').insert({
        last_sequence : 0,
        channel_id : insertChannel.id
    }).select().single();

    if(insertChannelLastSequenceError) 
        throw new Error('error creating a new channel last sequence');
    
    console.log('insertChannelLastSequence : ',insertChannelLastSequence);
    console.log('insertChannelLastSequenceError : ',insertChannelLastSequenceError);

    const response = {
        chatId : insertChannel.id,
        chatName : insertChannel.name,
        isGroupChat : insertChannel.is_group,
        avatarUrl : insertChannel.avatar_url ?? undefined,
        description : insertChannel.channel_description,
        unreadMessagesCount : 0,
        members : users?.map((u) => {
            return {
                userId : u.user_id,
                name : `${u.first_name} ${u.last_name}`
            }
        })
    };

    users.forEach((u) => {
        const toUserChannel = supabase.channel(u.user_id);
        toUserChannel.subscribe((status) => {
            if (status !== 'SUBSCRIBED') {
                return null
            }
            toUserChannel.send({
                type: 'broadcast',
                event: 'shout',
                payload : response,
            })
        });
    
    });

    return Response.json({ response  })

}
