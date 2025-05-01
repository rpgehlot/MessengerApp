import { createClient } from '@/utils/supabase/server'

export async function POST(request: Request) {

    const messageBody = await request.json();
    const { channelId, senderId} = messageBody;

    if (!senderId || !channelId)
        return Response.error();

    const supabase = await createClient();
    
    const { error, data: messages} = await supabase.from('messages')
        .select('entry_id')
        .eq('channel_id', channelId)
        .neq('sender_id',senderId)
        .in('status',['delievered'])

    if (error)
        throw new Error('Error fetching messages');
    
    console.log('messages : ',messages);
    await supabase.from('messages').update({
      status : "read"
    }).in('entry_id',messages.map(m => m.entry_id));


    return Response.json({ message : `${messages.length} messages marked as read` });
  }
  

 