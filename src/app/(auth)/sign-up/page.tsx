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

  return  (
  <div className="min-h-screen bg-white text-black flex items-center justify-center px-4">
    <div className="w-full max-w-md">
      
      <div className="mb-8">
        <h1 className="text-3xl font-semibold tracking-tight">
          Create your account
        </h1>
        <p className="mt-2 text-sm text-gray-500">
          Sign up to start receiving anonymous messages.
        </p>
      </div>

      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">

        <Controller
          name="username"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field>
              <Label className="text-sm font-medium text-black">
                Username
              </Label>

              <Input
                {...field}
                onChange={(e) => {
                  field.onChange(e);
                  debounced(e.target.value);
                }}
                className="mt-2 h-11 rounded-md border-gray-400 bg-white text-black placeholder:text-gray-500 focus-visible:ring-1 focus-visible:ring-black"
                placeholder="Choose a username"
              />

              {isCheckingUsername && (
                <Loader2 className="mt-2 h-4 w-4 animate-spin text-gray-500" />
              )}

              {!isCheckingUsername && usernameMessage && (
                <p
                  className={`mt-1 text-sm ${
                    usernameMessage === "Username is unique"
                      ? "text-green-600"
                      : "text-red-600"
                  }`}
                >
                  {usernameMessage}
                </p>
              )}

              {fieldState.error && (
                <FieldError errors={[fieldState.error]} />
              )}
            </Field>
          )}
        />

        <Controller
          control={form.control}
          name="email"
          render={({ field, fieldState }) => (
            <Field>
              <Label className="text-sm font-medium text-black">
                Email
              </Label>

              <Input
                {...field}
                className="mt-2 h-11 rounded-md border-gray-400 bg-white text-black placeholder:text-gray-500 focus-visible:ring-1 focus-visible:ring-black"
                placeholder="Enter your email"
              />

              <p className="mt-1 text-xs text-gray-500">
                We’ll send you a verification code.
              </p>

              {fieldState.error && (
                <FieldError errors={[fieldState.error]} />
              )}
            </Field>
          )}
        />

        <Controller
          control={form.control}
          name="password"
          render={({ field, fieldState }) => (
            <Field>
              <Label className="text-sm font-medium text-black">
                Password
              </Label>

              <Input
                type="password"
                {...field}
                className="mt-2 h-11 rounded-md border-gray-400 bg-white text-black placeholder:text-gray-500 focus-visible:ring-1 focus-visible:ring-black"
                placeholder="Create a password"
              />

              {fieldState.error && (
                <FieldError errors={[fieldState.error]} />
              )}
            </Field>
          )}
        />

        <Button
          type="submit"
          className="w-full h-11 rounded-md bg-black text-white hover:bg-gray-800"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Creating account...
            </>
          ) : (
            "Create account"
          )}
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-gray-600">
        Already have an account?{" "}
        <Link
          href="/sign-in"
          className="font-medium text-black hover:underline"
        >
          Sign in
        </Link>
      </p>
    </div>
  </div>
);
}
