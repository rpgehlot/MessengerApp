import { NextResponse } from 'next/server'
// The client you created from the Server-Side Auth instructions
import { createClient } from '@/utils/supabase/server'

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
//   console.log('searchParams : ',searchParams.values())
  const code = searchParams.get('code')
  // if "next" is in param, use it as the redirect URL
  const next = searchParams.get('next') ?? '/chat'
  console.log(code, next);

  if (code) {
    const supabase = await createClient()
    const { data, error } = await supabase.auth.exchangeCodeForSession(code);

    if (error) {
        console.log('Error exchanging code : ',error);
        return NextResponse.redirect(`${origin}/auth/auth-code-error`)
    }

    const { user, session } = data;
    const avatarUrl = user?.user_metadata?.avatar_url || user?.user_metadata?.picture;

    if (user && avatarUrl) {

        const { error : usersUpsertError } = await supabase.from('users').upsert({
            id : user.id,
            email : user.user_metadata.email,
            username : user.user_metadata.email
        });

        const { error : userMetaDataUpsertError } = await supabase.from('users_metadata').upsert({
            user_id : user.id,
            username : user.user_metadata.email,
            first_name : user.user_metadata.full_name?.split(' ')[0],
            last_name : user.user_metadata.full_name?.split(' ')[1],
            avatar_url : avatarUrl
        });
    }

    const forwardedHost = request.headers.get('x-forwarded-host') // original origin before load balancer
    const isLocalEnv = process.env.NEXT_PUBLIC_ENV === 'development'
    if (isLocalEnv) {
        // we can be sure that there is no load balancer in between, so no need to watch for X-Forwarded-Host
        return NextResponse.redirect(`${origin}${next}`)
    } else if (forwardedHost) {
        return NextResponse.redirect(`https://${forwardedHost}${next}`)
    } else {
        return NextResponse.redirect(`${origin}${next}`)
    }
  }

  // return the user to an error page with instructions
  return NextResponse.redirect(`${origin}/auth/auth-code-error`)
}