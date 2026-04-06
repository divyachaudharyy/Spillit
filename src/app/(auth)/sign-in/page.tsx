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
    <div className="relative flex items-center justify-center min-h-screen bg-black text-white overflow-hidden">
      {/* Background Glow */}
      <div className="absolute w-125 h-125 bg-purple-600 rounded-full blur-[150px] opacity-30 -top-25 -left-25" />
      <div className="absolute w-100 h-100 bg-blue-600 rounded-full blur-[120px] opacity-30 -bottom-25 -right-25" />

      {/* Floating Messages */}
      <div className="absolute top-20 left-10 bg-white/10 backdrop-blur-md px-4 py-2 rounded-xl text-sm">
        &quot;Missed you here &quot;
      </div>
      <div className="absolute bottom-24 right-10 bg-white/10 backdrop-blur-md px-4 py-2 rounded-xl text-sm">
        &#34;Login... someone’s waiting 💬&#34;
      </div>

      {/*  Glass Card */}
      <div className="w-full max-w-md p-8 space-y-6 bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl shadow-xl">
        {/*  Heading */}
        <div className="text-center">
          <h1 className="text-3xl md:text-4xl font-bold bg-linear-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
            Welcome Back
          </h1>
          <p className="mt-2 text-gray-300 text-sm">
            Someone might have left you a message...
          </p>
        </div>

        {/*  Form */}
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
          <Controller
            name="identifier"
            control={form.control}
            render={({ field }) => (
              <Field>
                <Label className="text-gray-300">Email / Username</Label>
                <Input
                  {...field}
                  className="bg-white/10 border-white/20 text-white placeholder:text-gray-400 focus:ring-2 focus:ring-purple-500"
                  placeholder="Enter your username or email"
                />
              </Field>
            )}
          />

          <Controller
            name="password"
            control={form.control}
            render={({ field }) => (
              <Field>
                <Label className="text-gray-300">Password</Label>
                <Input
                  type="password"
                  {...field}
                  className="bg-white/10 border-white/20 text-white placeholder:text-gray-400 focus:ring-2 focus:ring-purple-500"
                  placeholder="Enter your password"
                />
              </Field>
            )}
          />

          {/*  CTA Button */}
          <Button
            className="w-full bg-linear-to-r from-purple-500 to-blue-500 text-white hover:scale-105 transition duration-200"
            type="submit"
          >
            Enter 👀
          </Button>
        </form>

        {/* Footer */}
        <div className="text-center text-sm text-gray-400">
          Not a member yet?{" "}
          <Link href="/sign-up" className="text-purple-400 hover:underline">
            Join the fun
          </Link>
        </div>
      </div>
    </div>
  );
}
export default SignInForm;
