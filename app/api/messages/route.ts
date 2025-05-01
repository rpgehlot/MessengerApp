import { createClient } from '@/utils/supabase/server'
import { type NextRequest } from 'next/server'

export async function GET(request: NextRequest) {

    const searchParams = request.nextUrl.searchParams;
    const channelId = Number(searchParams.get('channelId'));
    const lastMessageId = Number(searchParams.get('lastMessageId'));

    const supabase = await createClient();
    
    const { data : messages, error } = await supabase.from('messages')
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
            .lt('message_id', lastMessageId)
            .order('created_at',{ ascending : false})
            .limit(50)

    
    if (error) {
        console.log(error);
        throw new Error('Error fetching messages');
    }
    
    const data = messages.reverse().map((entry) => {
        return {
            messageId : entry.message_id,
            createdAt : entry.created_at,
            content : entry.content,
            sender : {
                name : `${entry.users.users_metadata?.first_name} ${entry.users.users_metadata?.last_name}`,
                id : entry.users.users_metadata?.user_id,
                email: entry.users.email,
                avatarUrl: entry.users.users_metadata?.avatar_url,
            },
            status : entry.status
        }
    });


    return Response.json({ data })
  }
  

 