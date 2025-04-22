import { createClient } from '@/utils/supabase/server'

export async function POST(request: Request) {

    const messageBody = await request.json();

    const t0 = new Date().getTime();

    const supabase = await createClient();
    const {data:user, error :e} = await supabase.auth.getUser();
    if(e)
        throw new Error('error fetching user');

    console.log('messageBody : ',messageBody)
    let channelId = messageBody.channelId;

    const { data, error} = await supabase.from('last_sequence').select(`last_sequence`).eq('channel_id',channelId);
    if (error)
        throw new Error('error fetching last_Sequence');

    console.log('data : ',data, messageBody)
    const { data: insertedMessage, error:insertError }  = await supabase.from('messages')
            .insert({
                content : messageBody.content,
                message_id : data[0].last_sequence,
                channel_id : channelId,
                sender_id : user.user?.id
            }).select();

    console.log('updated : ',insertedMessage);
    console.log('insertError : ',insertError);
            
    if (insertError)
        throw new Error('error inserting message');

    const { data: updateMessage, error:updateError } = await supabase.from('last_sequence').update({ 'last_sequence' :  data[0].last_sequence + 1 }).eq('channel_id',channelId).select();
    if(updateError)
        throw new Error('error updating message');

    const t1 = new Date().getTime();
    console.log('time elapsed in db calls : ',(t1 - t0), 'ms');

    return Response.json({ insertedMessage })
  }
  

 