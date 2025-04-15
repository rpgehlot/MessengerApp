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
import { useActionState, useEffect } from 'react';
import { toast } from "sonner"

export function SignUpForm({
  className,
  ...props
}: React.ComponentProps<"div">) {

  const initialState : State = { message : null, errors : null };
  const [state, formAction, isPending] = useActionState(signUpAction, initialState);

  useEffect(() => {
    if (state.errors && state.errors.length > 0) {
      toast.error(`${state.errors[0]}`);
    }
  },[state.errors]);

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
                    <Label htmlFor="email">First name</Label>
                    <Input
                        id="firstName"
                        type="string"
                        name="firstName"
                        placeholder="John"
                        required
                    />
                </div>
                <div className="grid gap-3">
                    <Label htmlFor="email">Last name</Label>
                    <Input
                        id="lastName"
                        type="string"
                        name="lastName"
                        placeholder="Doe"
                        required
                    />
              </div>
              <div className="grid gap-3">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  name="email"
                  placeholder="m@example.com"
                  required
                />
              </div>
              <div className="grid gap-3">
                <Label htmlFor="password">Password</Label>
                <Input id="password" type="password" name="password" required />
              </div>
              <div className="flex flex-col gap-3">
                <Button type="submit" className="w-full">
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
