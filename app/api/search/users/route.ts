import { IUsersSearch } from '@/app/lib/descriptors';
import { createClient } from '@/utils/supabase/server'
import { NextResponse, type NextRequest } from 'next/server'

export async function GET(request: NextRequest)  {

    const searchParams = request.nextUrl.searchParams;
    const query = searchParams.get('query') ?? '';
    const limit = Number(searchParams.get('limit')) ?? 10;
    console.log('limit  : ',limit);
    const supabase = await createClient();

    let usersQuery = supabase.from('users_metadata')
            .select(`
                first_name,
                last_name,
                avatar_url,
                user_id,
                username
            `)
            .limit(limit)
            // .limit(limit)
    if (query === '') {
        usersQuery = usersQuery.order('username');
    }
    else {
        usersQuery = usersQuery.ilike('username',`%${query}%`);
    }
    
    const { data : users, error } = await usersQuery;
    if (error) {
        console.log(error);
        throw new Error('Error fetching matching users');
    }
    
    const data = users.map((entry) => {
        return {
            name : `${entry.first_name} ${entry.last_name}`,
            avatarUrl : entry.avatar_url,
            userId : entry.user_id,
            username : entry.username
        }
    });


    return Response.json({ data })
  }
  

 