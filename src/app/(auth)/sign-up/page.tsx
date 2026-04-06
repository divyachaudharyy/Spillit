"use client";

import { signUpSchema } from "@/schemas/signUpSchema";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { Field, FieldError } from "@/components/ui/field";
import { Label } from "@/components/ui/label";
import * as z from "zod";
import Link from "next/link";
import { zodResolver } from "@hookform/resolvers/zod";
import { useDebounceCallback } from "usehooks-ts";
import { toast } from "sonner";
import axios, { AxiosError } from "axios";
import { ApiResponse } from "@/types/ApiResponse";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

export default function SignUpForm() {
  const [username, setUsername] = useState("");
  const [usernameMessage, setUsernameMessage] = useState("");
  const [isCheckingUsername, setIsCheckingUsername] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const debounced = useDebounceCallback(setUsername, 500);

  const router = useRouter();

  //zod implementation
  const form = useForm<z.infer<typeof signUpSchema>>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
    },
  });

  useEffect(() => {
    const checkUsernameUnique = async () => {
      if (username) {
        setIsCheckingUsername(true);
        setUsernameMessage("");

        try {
          const response = await axios.get(
            `/api/check-username-unique?username=${username}`,
          );
          setUsernameMessage(response.data.message);
        } catch (error) {
          const axiosError = error as AxiosError<ApiResponse>;
          setUsernameMessage(
            axiosError.response?.data.message ?? "Error in checking username",
          );
        } finally {
          setIsCheckingUsername(false);
        }
      }
    };
    checkUsernameUnique();
  }, [username]);

  const onSubmit = async (data: z.infer<typeof signUpSchema>) => {
    setIsSubmitting(true);

    try {
      const response = await axios.post<ApiResponse>("api/sign-up", data);

      toast.success("Success", {
        description: response.data.message,
        position: "bottom-right",
      });

      router.replace(`/verify/${username}`);
      setIsSubmitting(false);
    } catch (error) {
      console.error("Error during sign-up", error);

      const axiosError = error as AxiosError<ApiResponse>;
      const errorMessage = axiosError.response?.data.message;

      toast.warning("Sign up failed", {
        description: errorMessage,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="relative flex items-center justify-center min-h-screen bg-black text-white overflow-hidden">
      {/* Background Glow */}
      <div className="absolute w-125 h-125 bg-purple-600 rounded-full blur-[150px] opacity-30 -top-25 -left-25" />
      <div className="absolute w-100 h-100 bg-blue-600 rounded-full blur-[120px] opacity-30 -bottom-25 -right-25" />

      {/*  Gradient Shapes  */}
      <div className="absolute top-20 right-20 w-20 h-20 bg-linear-to-r from-purple-500 to-blue-500 rounded-2xl rotate-12 opacity-30 blur-sm" />
      <div className="absolute bottom-20 left-20 w-16 h-16 bg-linear-to-r from-pink-500 to-purple-500 rounded-full opacity-30 blur-sm" />
      <div className="absolute top-1/2 left-10 w-10 h-10 bg-blue-400 rounded-full opacity-20 blur-sm" />

      {/* Glass Card */}
      <div className="w-full max-w-md p-8 space-y-6 bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl shadow-xl">
        {/* Heading */}
        <div className="text-center">
          <h1 className="text-3xl md:text-4xl font-bold bg-linear-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
            Join the fun
          </h1>
          <p className="mt-2 text-gray-300 text-sm">
            Start your anonymous message journey
          </p>
        </div>

        {/*  Form */}
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
          {/* USERNAME */}
          <Controller
            name="username"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field>
                <Label className="text-gray-300">Username</Label>

                <Input
                  {...field}
                  onChange={(e) => {
                    field.onChange(e);
                    debounced(e.target.value);
                  }}
                  className="bg-white/10 border-white/20 text-white placeholder:text-gray-400 focus:ring-2 focus:ring-purple-500"
                  placeholder="Pick something cool 😏"
                />

                {isCheckingUsername && (
                  <Loader2 className="animate-spin mt-2 h-4 w-4" />
                )}

                {!isCheckingUsername && usernameMessage && (
                  <p
                    className={`text-sm mt-1 ${
                      usernameMessage === "Username is unique"
                        ? "text-green-400"
                        : "text-red-400"
                    }`}
                  >
                    {usernameMessage}
                  </p>
                )}

                {fieldState.error && <FieldError errors={[fieldState.error]} />}
              </Field>
            )}
          />

          {/* EMAIL */}
          <Controller
            control={form.control}
            name="email"
            render={({ field, fieldState }) => (
              <Field>
                <Label className="text-gray-300">Email</Label>

                <Input
                  {...field}
                  className="bg-white/10 border-white/20 text-white placeholder:text-gray-400 focus:ring-2 focus:ring-purple-500"
                  placeholder="Enter your email ✉️"
                />

                <p className="text-gray-400 text-sm">
                  We’ll send you a verification code
                </p>

                {fieldState.error && <FieldError errors={[fieldState.error]} />}
              </Field>
            )}
          />

          {/* PASSWORD */}
          <Controller
            control={form.control}
            name="password"
            render={({ field, fieldState }) => (
              <Field>
                <Label className="text-gray-300">Password</Label>

                <Input
                  type="password"
                  {...field}
                  className="bg-white/10 border-white/20 text-white placeholder:text-gray-400 focus:ring-2 focus:ring-purple-500"
                  placeholder="Create a strong password 🔒"
                />

                {fieldState.error && <FieldError errors={[fieldState.error]} />}
              </Field>
            )}
          />

          {/* CTA BUTTON */}
          <Button
            type="submit"
            className="w-full bg-linear-to-r from-purple-500 to-blue-500 text-white hover:scale-105 transition duration-200"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Creating your space...
              </>
            ) : (
              "Get Started "
            )}
          </Button>
        </form>

        {/*  Footer */}
        <div className="text-center text-sm text-gray-400">
          Already part of it?{" "}
          <Link href="/sign-in" className="text-purple-400 hover:underline">
            Come back
          </Link>
        </div>
      </div>
    </div>
  );
}
