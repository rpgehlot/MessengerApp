import { createClient } from '@/utils/supabase/server'
import { redis } from '@/utils/redis';
import { Tables } from '@/app/lib/database-types';
import { REDIS_QUEUED_MESSAGE_PREFIX } from '@/lib/utils';


export async function POST(request: Request) {

    const messageBody = await request.json();
    const supabase = await createClient();
    console.log('messageBody : ',messageBody)
    // console.log('onlinepresence : ',onlinepresence)


    const t0 = new Date().getTime();
    const  { content, senderId,  channelId } = messageBody;

    const { data, error } = await supabase.rpc('insert_message_and_update_sequence', {
        p_channel_id: Number(channelId),
        p_content: content,
        p_sender_id: senderId,
    });

    if (error) {
        console.error('Error:', error);
        throw new Error('Error inserting message and updating sequence');
    }

    console.log('Inserted message with message_id:', data);
    const t2 = new Date().getTime();

    console.log('time elapsed in db call : ',(t2 - t0), 'ms');
    const onlineUsersList:Array<string> = await redis.get('online-users') || [];

    console.log('onlineUsers: ', onlineUsersList);

    const onlineUsers = new Set([...onlineUsersList]);
    const { data: channelUsers, error : channelUsersError} = await supabase.from('channel_user_mapping').select(`user_id`).eq('channel_id',channelId).neq('user_id',senderId);
    if (channelUsersError) 
        throw new Error(`Error fetching users for a channel - ${channelId}`);

    for(const entry of channelUsers) {
        if(!onlineUsers.has(entry.user_id)) {

            console.log(`user ${entry.user_id} is offline, so queueing its messages`);
            
            const key = `${REDIS_QUEUED_MESSAGE_PREFIX}${entry.user_id}`;
            let queue:Array<Tables<`messages`>> | null  = await redis.get(key);
            queue = queue || [];
            queue.push(data)
            await redis.set(key, queue);
        }
        else {
            await supabase.from('messages').update({
                status : 'delievered'
            }).eq('entry_id',data.entry_id);
        }
    }


    return Response.json({ data })
  }
  

 