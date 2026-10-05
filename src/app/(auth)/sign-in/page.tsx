"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { signIn } from "next-auth/react";

import { Controller } from "react-hook-form";
import { Field } from "@/components/ui/field";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { signInSchema } from "@/schemas/signInSchema";

function SignInForm() {
  const router = useRouter();

  const form = useForm<z.infer<typeof signInSchema>>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      identifier: "",
      password: "",
    },
  });
  const onSubmit = async (data: z.infer<typeof signInSchema>) => {
    const result = await signIn("credentials", {
      redirect: false,
      identifier: data.identifier,
      password: data.password,
    });

    if (result?.error) {
      if (result.error === "CredentialsSignin") {
        toast.warning("Login failed", {
          description: "Incorrect username or password",
          descriptionClassName: "!text-secondary-foreground",
        });
      } else {
        toast.error("Error", {
          description: result.error,
        });
      }
    }

    if (result?.url) {
      router.replace("/dashboard");
    }
  };

 return (
  <div className="min-h-screen bg-white text-black flex items-center justify-center px-4">
    <div className="w-full max-w-md">

      <div className="mb-8">
        <h1 className="text-3xl font-semibold tracking-tight">
          Sign in
        </h1>

        <p className="mt-2 text-sm text-gray-500">
          Sign in to manage your anonymous messages.
        </p>
      </div>

      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-5"
      >

        <Controller
          name="identifier"
          control={form.control}
          render={({ field }) => (
            <Field>
              <Label className="text-sm font-medium text-black">
                Email or username
              </Label>

              <Input
                {...field}
                className="mt-2 h-11 rounded-md border-gray-300 bg-white text-black placeholder:text-gray-400 focus-visible:ring-1 focus-visible:ring-black"
                placeholder="Enter your email or username"
              />
            </Field>
          )}
        />

        <Controller
          name="password"
          control={form.control}
          render={({ field }) => (
            <Field>
              <Label className="text-sm font-medium text-black">
                Password
              </Label>

              <Input
                type="password"
                {...field}
                className="mt-2 h-11 rounded-md border-gray-300 bg-white text-black placeholder:text-gray-400 focus-visible:ring-1 focus-visible:ring-black"
                placeholder="Enter your password"
              />
            </Field>
          )}
        />

        <Button
          className="w-full h-11 rounded-md bg-black text-white hover:bg-gray-800"
          type="submit"
        >
          Sign in
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-gray-500">
        Don&apos;t have an account?{" "}
        <Link
          href="/sign-up"
          className="font-medium text-black hover:underline"
        >
          Create an account
        </Link>
      </p>
    </div>
  </div>
);
}
export default SignInForm;
