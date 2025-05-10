'use client';

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { forgotPasswordAction, LoginState, signInAction } from "@/app/lib/actions"
import { useActionState, useEffect } from 'react';
import { toast } from "sonner"
import { EnvelopeIcon, KeyIcon } from "@heroicons/react/24/outline";
import Link from "next/link";



export default function ForgotPassword({
  className,
  ...props
}: React.ComponentProps<"div">) {

  const initialState : LoginState = { message : null, errors : [] };
  const [state, formAction, isPending] = useActionState(forgotPasswordAction, initialState);

  useEffect(() => {
    if (state.errors && state.errors.length > 0) {
      toast.error(`${state.errors[0]}`);
    }
  },[state.errors]);

  useEffect(() => {
    console.log('state.message : ',state.message)
    if (state.message )
      toast.success(state.message);
  },[state.message]);



  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader>
          <CardTitle className="text-center mb-5 flex items-center justify-center">
              <span className="">
                <svg viewBox="0 0 20 24" aria-hidden="true" className="size-8">
                  <path className="fill-emerald-400" d="M16 8a5 5 0 0 0-5-5H5a5 5 0 0 0-5 5v13.927a1 1 0 0 0 1.623.782l3.684-2.93a4 4 0 0 1 2.49-.87H11a5 5 0 0 0 5-5V8Z"></path>
                </svg>
              </span>
              <h1>
                Reset your password
              </h1>
          </CardTitle>
          <CardDescription>
            Enter your email below to reset your password. <br/>You will receive an email to verify 
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form action={formAction}>
            <div className="flex flex-col gap-6">
              <div className="grid gap-3">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <span className="absolute top-[50%] left-5 transform -translate-[50%]">
                    <EnvelopeIcon className="size-6 text-zinc-400"/>
                  </span>
                  <Input
                    id="email"
                    type="email"
                    name="email"
                    placeholder="john.doe@gmail.com"
                    className="pl-11"
                    required
                  />
                </div>
              </div>
              <div className="flex flex-col gap-3">
                <Button type="submit" className="w-full">
                  Verify email
                </Button>
              </div>
            </div>
            
          </form>
          <div className="flex flex-col gap-1 mt-3">
            <div className="mt-1 text-center text-sm">
              <Link href="/login" className="underline underline-offset-4">
                Back to Login
              </Link>
            </div>
            <div className="text-center text-sm">
              Don&apos;t have an account?{" "}
              <Link href="/signup" className="underline underline-offset-4">
                Sign up
              </Link>
            </div>
          </div>
         
         
        </CardContent>
      </Card>
    </div>
  )
}
