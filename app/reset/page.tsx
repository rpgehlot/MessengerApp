import ResetPassword from "@/components/reset-password-form"
import { createClient } from "@/utils/supabase/server";

export default async function Page(props: {
  searchParams?: Promise<{
    code?: string;
  }>;
}) {

    const searchParams = await props.searchParams;
    const code = searchParams?.code || '';

    // console.log('code is ',code);
    // if (code) {

    //   const supabase = await createClient()
    //   const { data, error } = await supabase.auth.exchangeCodeForSession(code);

    //   if (error) {
    //       console.log('Error exchanging code : ',error);
    //       // return NextResponse.redirect(`${origin}/auth/auth-code-error`)
    //   }

    //   const { user, session } = data;
    // }
  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10 bg-gray-100">
      <div className="w-full max-w-sm">
        <ResetPassword />
      </div>
    </div>
  )
}