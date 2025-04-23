import { createClient } from '@/utils/supabase/server'
import { redis } from '@/utils/redis';

export async function POST(request: Request) {

    const messageBody = await request.json();
    const supabase = await createClient();
    console.log('messageBody : ',messageBody)

    const t0 = new Date().getTime();
    const  { content, senderId,  channelId} = messageBody;

    const { data, error } = await supabase.rpc('insert_message_and_update_sequence', {
        p_channel_id: Number(channelId),
        p_content: content,
        p_sender_id: senderId
    });

    if (error) {
        console.error('Error:', error);
        throw new Error('Error inserting message and updating sequence');
    }

    console.log('Inserted message with message_id:', data[0].message_id);
    const t2 = new Date().getTime();

    console.log('time elapsed in db call : ',(t2 - t0), 'ms');

    return Response.json({ data })
  }
  

 