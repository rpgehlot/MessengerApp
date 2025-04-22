import { createClient } from '@/utils/supabase/server'
import { type NextRequest } from 'next/server'

export async function GET(request: NextRequest) {

    const searchParams = request.nextUrl.searchParams;
    const channelId = Number(searchParams.get('channelId'));
    const isGroupChannel = Number(searchParams.get('isGroup'));
    const otherUserId = searchParams.get('otherUserId') ?? '';


    const supabase = await createClient();
    
    if ( isGroupChannel ) {
        const { data : messages, error } = await supabase.from('channels')
            .select(`
                name, 
                channel_description,
                avatar_url
            `)
            .eq('channel_id', channelId)
            .single();
    }
    else {
        const { data : messages, error } = await supabase.from('users_metadata')
            .select(`
                name, 
                channel_description,
                avatar_url
            `)
            .eq('user_id', otherUserId)
            .single();
    }

    
    // if (error) {
    //     console.log(error);
    //     throw new Error('Error fetching messages');
    // }
    
    // const data = messages.map((entry) => {
    //     return {
    //         messageId : entry.message_id,
    //         createdAt : entry.created_at,
    //         content : entry.content,
    //         sender : {
    //             name : `${entry.users.users_metadata?.first_name} ${entry.users.users_metadata?.last_name}`,
    //             id : entry.users.users_metadata?.user_id,
    //             email: entry.users.email,
    //             avatarUrl: entry.users.users_metadata?.avatar_url,
    //         },
    //         read: true
    //     }
    // });


    return Response.json({ data })
  }
  

 