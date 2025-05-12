'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { z } from 'zod';

import { createClient } from '@/utils/supabase/server'
import { count } from 'console';
import { supabaseUrl } from '@/utils/config';


export type LoginState = {
  message : string | null;
  errors : string[];
};

export type State = {
    message : string | null;
    formErrors : string[];
    fieldErrors : {
      email? : string[];
      password?: string[];
      username? : string[];
      firstName? : string[];
      lastName? : string[];
    }
};

const SignInSchema = z.object({
    email : z.string().email('Invalid email'),
    password : z.string()
});

const SignUpSchema = z.object({
    email : z.string().email('Invalid email'),
    password : z.string(),
    username : z.string().min(6,'username should be atleast 6 characters long'),
    firstName : z.string(),
    lastName : z.string()
});

const ForgotPasswdSchema = z.object({
  email : z.string().email('Invalid email'),
});

export async function signInAction(prevState : LoginState,  formData: FormData) {
  
  const validatedFields = SignInSchema.safeParse({
    email : formData.get('email'),
    password : formData.get('password')
  });

  if (!validatedFields.success){
    return {
        message : 'Missing fields. Unable to login!',
        errors : validatedFields.error.flatten().formErrors
    }
  }

  const supabase = await createClient()

  // type-casting here for convenience
  // in practice, you should validate your inputs
  const data = {
    ...validatedFields.data
  }

  const { error } = await supabase.auth.signInWithPassword(data)
  console.log('error : ',error);
  if (error) {
    return {
        message : error.name,
        errors : [error.message]
    }
  }


  revalidatePath('/chat', 'layout');
  redirect('/chat');
}


export async function signUpAction(prevState : State, formData: FormData) {

   const validatedFields = SignUpSchema.safeParse({
        email : formData.get('email'),
        password : formData.get('password'),
        firstName : formData.get('firstName'),
        lastName : formData.get('lastName'),
        username : formData.get('username')
   });

  //  console.log(validatedFields.error);
   if (!validatedFields.success){
    return {
        message : 'Missing fields. Unable to signup!',
        fieldErrors : validatedFields.error.flatten().fieldErrors,
        formErrors : validatedFields.error.flatten().formErrors
    }
  }
    
  const supabase = await createClient()

  // type-casting here for convenience
  // in practice, you should validate your inputs
  const data = {
    ...validatedFields.data
  }

  const { data:authUserSignUpData, error } = await supabase.auth.signUp(data)
  console.log('authUserSignUpData : ',authUserSignUpData)
  if (error) {
    return {
        message : error.name,
        formErrors : [error.message],
        fieldErrors : {}
    }
  }

  if (authUserSignUpData.user?.email) {
    await supabase.from('users').insert({
      id : authUserSignUpData.user.id,
      email : authUserSignUpData.user.email,
      username : data.username
    });

    await supabase.from('users_metadata').insert({
      user_id : authUserSignUpData.user.id,
      username : data.username,
      first_name : data.firstName,
      last_name : data.lastName,
      avatar_url : `https://ui-avatars.com/api/?name=${data.firstName} ${data.lastName}&background=random`
    });
  
  }

  revalidatePath('/login', 'layout')
  redirect('/login')
}


// export async function googleSignInAction() {

//   console.log('dw')
//   const supabase = await createClient()

//   const {data, error} = await supabase.auth.signInWithOAuth({
//     provider: 'google',
//     options: {
//       queryParams: {
//         access_type: 'offline',
//         prompt: 'consent',
//       },
//       redirectTo: 'http://localhost:3000/api/auth/callback',
//     },
//   });

//   console.log('error : ',error, data);
// }


export async function forgotPasswordAction(prevState: LoginState, formData : FormData) {
    
  const validatedFields = ForgotPasswdSchema.safeParse({
    email : formData.get('email'),
  });

  if (!validatedFields.success){
    return {
        message : 'Invalid email',
        errors : validatedFields.error.flatten().formErrors
    }
  }

  const supabase = await createClient()

  // type-casting here for convenience
  // in practice, you should validate your inputs
  const data = {
    ...validatedFields.data
  }

  console.log(data.email);
  const { error, data: passwordResetData } = await supabase.auth.resetPasswordForEmail(data.email,{
    redirectTo  : `${supabaseUrl}/reset`
  });
  if (error) {
    return {
        message : error.name,
        errors : [error.message]
    }
  }

  return {
    message : 'Password recovery link sent successfully',
    errors : []
  }
}

export async function resetPasswordAction(prevState: LoginState, formData : FormData) {
  
  const password = formData.get('password');

  const supabase = await createClient()

  // type-casting here for convenience
  // in practice, you should validate your inputs
  
  const { error, data } = await supabase.auth.updateUser({
    password : password as string
  });

  if (error) {
    return {
        message : error.name,
        errors : [error.message]
    }
  }

  revalidatePath('/chat', 'layout')
  redirect('/chat')
}