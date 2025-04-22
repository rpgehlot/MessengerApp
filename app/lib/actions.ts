'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { z } from 'zod';

import { createClient } from '@/utils/supabase/server'

export type State = {
    message? : string | null;
    errors? : string[] | null;
};

const SignInSchema = z.object({
    email : z.string(),
    password : z.string()
});

const SignUpSchema = z.object({
    email : z.string(),
    password : z.string(),
    firstName : z.string(),
    lastName : z.string()
});

export async function signInAction(prevState : State,  formData: FormData) {
  
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
        lastName : formData.get('lastName')
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

  const { error } = await supabase.auth.signUp(data)

  if (error) {
    return {
        message : error.name,
        errors : [error.message]
    }
  }

  revalidatePath('/login', 'layout')
  redirect('/login')
}