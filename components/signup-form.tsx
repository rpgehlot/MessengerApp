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
import { signUpAction, State } from "@/app/lib/actions"
import { useActionState, useEffect, useState } from 'react';
import { toast } from "sonner"
import { EnvelopeIcon, KeyIcon, UserCircleIcon, UserIcon } from "@heroicons/react/24/outline";
import { useDebouncedCallback } from "use-debounce";
import { IUsersSearch } from "@/app/lib/descriptors";
import clsx from "clsx";
import { CheckCircle } from "lucide-react";
import SpinnerIcon from "./ui/custom/SpinnerIcon";

export function SignUpForm({
  className,
  ...props
}: React.ComponentProps<"div">) {

  const initialState : State = { message : null, formErrors : [], fieldErrors : {} };
  const [state, formAction, isPending] = useActionState(signUpAction, initialState);
  const [loading, setLoading] = useState<boolean>(false);
  const [username, setUsername] = useState<string>();
  const [usernameError, setUsernameError] = useState<string>();


  useEffect(() => {
    console.log('state.errors : ',state.formErrors)
    if (state.formErrors && state.formErrors.length > 0) {
      toast.error(`${state.formErrors[0]}`);
    }
},[state.formErrors]);


  const debounced = useDebouncedCallback(async(username) => {
    
    try {
        const res = await fetch(`/api/search/users?query=${username}&limit=1&exactMatch=true`);
        const { data }  = await res.json();
        console.log(data);
        if (data.length === 1)
          setUsernameError('username exists');
    } catch (error) {
        console.error(error);
    } finally {
        setLoading(false);
    }
  },500);

  const onUserNameChange = async (username : string) => {

      setLoading(true);
      setUsername(username);
      if (!username) {
        setUsernameError('username is required');
        return;
      }

      if (/\s/.test(username)) {
        setUsernameError('username cannot contain spaces');
        return;
      }

      if (username.length < 6) {
        setUsernameError('username should be atleast 6 character long');
        return;
      }

      debounced(username);
      setUsernameError(undefined);
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader>
          <CardTitle className="text-center mb-5">SignUp</CardTitle>
          <CardDescription>
            Enter your details below to signup
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form action={formAction}>
            <div className="flex flex-col gap-6">
                <div className="grid gap-3">
                  <Label htmlFor="firstName">First name</Label>
                  <div className="relative">
                    <span className="absolute top-[50%] left-5 transform -translate-[50%]">
                      <UserIcon className="size-6 text-zinc-400"/>
                    </span>
                    <Input
                      id="firstName"
                      type="string"
                      name="firstName"
                      placeholder="John"
                      className="pl-11"
                      required
                    />
                  </div>
                  {state.fieldErrors['firstName']?.map(error => <span className="-mt-3 text-red-400" > {error} </span>)}
                </div>
                <div className="grid gap-3">
                    <Label htmlFor="lastName">Last name</Label>
                    <div className="relative">
                      <span className="absolute top-[50%] left-5 transform -translate-[50%]">
                        <UserIcon className="size-6 text-zinc-400"/>
                      </span>
                      <Input
                        id="lastName"
                        type="string"
                        name="lastName"
                        placeholder="Doe"
                        className="pl-11"
                        required
                      />
                    </div>
                  {state.fieldErrors['lastName']?.map(error => <span className="-mt-3 text-red-400" > {error} </span>)}
                </div>

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
                        placeholder="m@example.com"
                        className="pl-11"
                        required
                        // onChange={(e) => onEmailChange(e.target.value)}
                      />
                    </div>
                  {state.fieldErrors['email']?.map(error => <span className="-mt-3 text-red-400" > {error} </span>)}
                </div>

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
                        placeholder="Enter your password"
                        className="pl-11"
                        required
                      />
                    </div>
                  {state.fieldErrors['password']?.map(error => <span className="-mt-3 text-red-400" > {error} </span>)}
                </div>

                <div className="grid gap-3">
                    <Label htmlFor="username">Username</Label>
                    <div className="relative">
                      <span className="absolute top-[50%] left-5 transform -translate-[50%]">
                        <UserCircleIcon className="size-6 text-zinc-400"/>
                      </span>

                      {!usernameError && username && !loading && <span className="absolute top-[50%] right-0.5 transform -translate-[50%]">
                        <CheckCircle className="size-5 text-green-600"/>
                      </span>}

                      {!usernameError && loading && <SpinnerIcon size={5} className="top-[50%] right-0.5 transform -translate-[50%] absolute mr-3 size-5  text-gray-600 fill-white" /> }
                    

                      <Input
                        id="username"
                        type="string"
                        value={username}
                        name="username"
                        onChange={(e) => {
                            onUserNameChange(e.target.value);
                        }}
                        placeholder="select a username"
                        className={clsx(
                            "pl-11", 
                            usernameError ? 'border-red-300 focus-visible:border-red-300 focus-visible:ring-red-300 focus-visible:ring-1' : 
                            ' focus-visible:border-green-600 focus-visible:ring-green-600 focus-visible:ring-1'
                        )}
                        required
                      />
                    </div>
                    {usernameError && <span className="-mt-3 text-red-400" > {usernameError} </span>}
                    {state.fieldErrors['username']?.map(error => <span className="-mt-3 text-red-400" > {error} </span>)}

                    {/* {usernameError && username && <span className="-mt-3 text">username exists</span> } */}
                </div>

                <div className="flex flex-col gap-3">
                  <Button type="submit" disabled={!!usernameError} className="w-full">
                    SignUp
                  </Button>
                </div>
            </div>
            <div className="mt-4 text-center text-sm">
              Already have an account?{" "}
              <a href="/login" className="underline underline-offset-4">
                Login
              </a>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
