"use client";

import React, { useState } from "react";
import axios, { AxiosError } from "axios";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

import { Controller } from "react-hook-form";
import { Field } from "@/components/ui/field";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import * as z from "zod";
import { ApiResponse } from "@/types/ApiResponse";
import Link from "next/link";
import { useParams } from "next/navigation";
import { messageSchema } from "@/schemas/messageSchema";

export default function SendMessage() {
  const params = useParams<{ username: string }>();
  const username = params.username;

  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [isSuggestLoading, setIsSuggestLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const form = useForm<z.infer<typeof messageSchema>>({
    resolver: zodResolver(messageSchema),
  });

  const messageContent = form.watch("content");

  const handleMessageClick = (message: string) => {
    form.setValue("content", message);
  };

  const [isLoading, setIsLoading] = useState(false);

  const onSubmit = async (data: z.infer<typeof messageSchema>) => {
    setIsLoading(true);
    try {
      const response = await axios.post<ApiResponse>("/api/send-message", {
        ...data,
        username,
      });

      toast(response.data.message);
      form.reset({ ...form.getValues(), content: "" });
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast.error("Error", {
        description:
          axiosError.response?.data.message ?? "Failed to sent message",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const fetchSuggestedMessages = async () => {
    try {
      setIsSuggestLoading(true);
      setError(null);

      const response = await axios.post("/api/suggest-messages", {
        username,
      });

      setSuggestions(response.data.suggestions || []);
    } catch (err) {
      console.error(err);
      setError("Failed to fetch suggestions");
    } finally {
      setIsSuggestLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-zinc-900 via-zinc-950 to-zinc-800 px-4 py-10">
      {/* SIDE GLOW BLOBS */}
      <div className="hidden md:block">
        <div className="absolute -left-30 top-[20%] w-72 h-72 bg-pink-500 opacity-20 blur-3xl animate-pulse rounded-full" />
        <div className="absolute -right-30 top-[50%] w-72 h-72 bg-purple-500 opacity-20 blur-3xl animate-pulse rounded-full" />
      </div>
      <div className="max-w-2xl mx-auto space-y-6">
        {/* HEADER */}
        <div className="text-center space-y-2">
          <h1 className="text-2xl md:text-3xl font-semibold bg-linear-to-r from-pink-500 via-purple-500 to-blue-500 bg-clip-text text-transparent">
            Spill Something
          </h1>
          <p className="text-gray-100 text-sm">
            Send anonymous thoughts to @{username}
          </p>
        </div>

        {/*  MESSAGE INPUT CARD */}
        <div className="bg-white shadow-sm border border-gray-200 rounded-2xl p-4 space-y-4">
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <Controller
              name="content"
              control={form.control}
              render={({ field }) => (
                <Field>
                  <Label className="text-sm text-gray-600">Your message</Label>

                  <Textarea
                    placeholder="Type something nice... or honest 😏"
                    className="resize-none rounded-xl bg-zinc-50 border border-gray-200 focus:ring-2 focus:ring-purple-300"
                    {...field}
                  />
                </Field>
              )}
            />

            <Button
              type="submit"
              disabled={isLoading || !messageContent}
              className="w-full bg-linear-to-r from-pink-500 via-purple-500 to-blue-500 text-white"
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                "Send anonymously 🚀"
              )}
            </Button>
          </form>
        </div>

        {/* SUGGESTIONS */}
        <div className="bg-white shadow-sm border border-gray-200 rounded-2xl p-4 space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-600">Need ideas?</p>

            <Button
              onClick={fetchSuggestedMessages}
              disabled={isSuggestLoading}
              className="text-sm bg-zinc-100 hover:bg-zinc-200 text-black"
            >
              {isSuggestLoading ? "..." : "Suggest"}
            </Button>
          </div>

          <div className="flex flex-col gap-2">
            {error ? (
              <p className="text-red-500 text-sm">{error}</p>
            ) : (
              suggestions.map((message, index) => (
                <button
                  key={index}
                  onClick={() => handleMessageClick(message)}
                  className="text-left text-sm px-3 py-2 rounded-lg bg-zinc-100 hover:bg-purple-100 transition"
                >
                  {message}
                </button>
              ))
            )}
          </div>
        </div>

        {/*  CTA */}
        <div className="text-center pt-2">
          <p className="text-sm text-gray-100 mb-2">Want your own page?</p>
          <Link href={"/sign-up"}>
            <Button className="bg-black text-white hover:bg-zinc-800">
              Create your board
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
