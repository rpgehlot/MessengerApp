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
import { LoginState, resetPasswordAction } from "@/app/lib/actions"
import { useActionState, useEffect, useState } from 'react';
import { toast } from "sonner"
import { EnvelopeIcon, KeyIcon } from "@heroicons/react/24/outline";
import Link from "next/link";
import { useDebouncedCallback } from "use-debounce";
import clsx from "clsx";
import { useSearchParams } from "next/navigation";
import { createClient } from "@/utils/supabase/client";


export default function ResetPassword({
  className,
  ...props
}: React.ComponentProps<"div">) {

  const initialState : LoginState = { message : null, errors : [] };
  const [state, formAction, isPending] = useActionState(resetPasswordAction, initialState);
  const [passwordError, setPasswordError] = useState<string>();
  const [confirmPasswordError, setconfirmPasswordError] = useState<string>();

  const [password, setPassword] = useState<string>();
  const [confirmpassword, setConfirmPassword] = useState<string>();

  const searchParams = useSearchParams();

  useEffect(() => {
    if (state.errors && state.errors.length > 0) {
      toast.error(`${state.errors[0]}`);
    }
  },[state.errors]);

  useEffect(() => {
    if (state.message )
      toast.success(state.message);
  },[state.message]);

  const initialise = async () => {
    const code = searchParams.get('code');
    if (code) {
      const supabase = createClient()
      await supabase.auth.exchangeCodeForSession(code)
    }
  };

  useEffect(() => {
    initialise();
  },[searchParams]);
  

  const onPasswordChange = async (password : string) => {

    setPassword(password);

    if (/\s/.test(password)) {
      setPasswordError('password cannot contain spaces');
      return;
    }

    if (password.length < 6) {
        setPasswordError('password should be atleast 6 character long');
      return;
    }

    // debounced(username);
    setPasswordError(undefined);
};


  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader>
          <CardTitle className="text-center flex items-center justify-center">
              <span className="">
                <svg viewBox="0 0 20 24" aria-hidden="true" className="size-8">
                  <path className="fill-emerald-400" d="M16 8a5 5 0 0 0-5-5H5a5 5 0 0 0-5 5v13.927a1 1 0 0 0 1.623.782l3.684-2.93a4 4 0 0 1 2.49-.87H11a5 5 0 0 0 5-5V8Z"></path>
                </svg>
              </span>
              <h1>
                Reset your password
              </h1>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form action={formAction}>
            <div className="flex flex-col gap-6">
              <div className="grid gap-3">
              <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <span className="absolute top-[50%] left-5 transform -translate-[50%]">
                    <KeyIcon className="size-6 text-zinc-400"/>
                  </span>
                  <Input
                    id="password" 
                    type="password" 
                    name="password" 
                    value={password}
                    onChange={(e) => onPasswordChange(e.target.value)}
                    required
                    className={clsx(
                        "pl-11", 
                        passwordError ? 'border-red-300 focus-visible:border-red-300 focus-visible:ring-red-300 focus-visible:ring-1' : 
                        ' focus-visible:border-green-600 focus-visible:ring-green-600 focus-visible:ring-1'
                    )}
                  />
                </div>
                {passwordError && <span className="-mt-3 text-red-400" > {passwordError} </span>}
              </div>

              <div className="grid gap-3">
                <Label htmlFor="confirmpassword">Confirm Password</Label>
                <div className="relative">
                  <span className="absolute top-[50%] left-5 transform -translate-[50%]">
                    <KeyIcon className="size-6 text-zinc-400"/>
                  </span>
                  <Input 
                    id="confirmpassword" 
                    type="password" 
                    name="confirmpassword" 
                    value={confirmpassword}
                    onChange={(e) => {
                        const passwd = e.target.value;
                        if (passwd !== password) {
                            setconfirmPasswordError('password doesnt match');
                        }
                        else {
                            setconfirmPasswordError(undefined);
                        }
                    }}
                    required
                    className={clsx(
                        "pl-11", 
                        confirmPasswordError ? 'border-red-300 focus-visible:border-red-300 focus-visible:ring-red-300 focus-visible:ring-1' : 
                        ' focus-visible:border-green-600 focus-visible:ring-green-600 focus-visible:ring-1'
                    )}
                  />
                </div>
                {confirmPasswordError && <span className="-mt-3 text-red-400" > {confirmPasswordError} </span>}

              </div>

              <div className="flex flex-col gap-3">
                <Button type="submit" className="w-full" disabled={!!confirmPasswordError} >
                  Reset password
                </Button>
              </div>
            </div>
            
          </form>
         
        </CardContent>
      </Card>
    </div>
  )
}
