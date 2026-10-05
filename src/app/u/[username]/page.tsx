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
    <div className="min-h-screen bg-white px-4 py-12 text-black">
      <div className="mx-auto w-full max-w-2xl space-y-8">
        {/* HEADER */}
        <div className="space-y-2">
          <p className="text-sm font-medium text-gray-500">Anonymous message</p>

          <h1 className="text-3xl font-semibold tracking-tight">
            Send a message to @{username}
          </h1>

          <p className="text-sm text-gray-500">
            Your message will be sent anonymously.
          </p>
        </div>

        {/* MESSAGE INPUT */}
        <div className="rounded-lg border border-gray-200 bg-white p-5">
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
            <Controller
              name="content"
              control={form.control}
              render={({ field }) => (
                <Field>
                  <Label className="text-sm font-medium text-black">
                    Message
                  </Label>

                  <Textarea
                    {...field}
                    placeholder="Write your message..."
                    className="mt-2 min-h-36 resize-none rounded-md border-gray-300 bg-white text-black placeholder:text-gray-400 focus-visible:ring-1 focus-visible:ring-black"
                  />
                </Field>
              )}
            />

            <Button
              type="submit"
              disabled={isLoading || !messageContent}
              className="h-11 w-full rounded-md bg-black text-white hover:bg-gray-800 disabled:opacity-50"
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                "Send anonymously"
              )}
            </Button>
          </form>
        </div>

        {/* SUGGESTIONS */}
        <div className="rounded-lg border border-gray-200 bg-white p-5">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h2 className="text-sm font-medium text-black">
                Need inspiration?
              </h2>

              <p className="mt-1 text-xs text-gray-500">
                Get a few ideas for what to write.
              </p>
            </div>

            <Button
              type="button"
              onClick={fetchSuggestedMessages}
              disabled={isSuggestLoading}
              variant="outline"
              className="h-9 rounded-md border-gray-300 bg-white text-black hover:bg-gray-100"
            >
              {isSuggestLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                "Get suggestions"
              )}
            </Button>
          </div>

          {error && <p className="mt-4 text-sm text-red-600">{error}</p>}

          {suggestions.length > 0 && (
            <div className="mt-5 space-y-2">
              {suggestions.map((message, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => handleMessageClick(message)}
                  className="w-full rounded-md border border-gray-200 bg-gray-50 px-4 py-3 text-left text-sm text-gray-700 transition hover:border-gray-300 hover:bg-gray-100"
                >
                  {message}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* CTA */}
        <div className="border-t border-gray-200 pt-6 text-center">
          <p className="text-sm text-gray-500">
            Want to receive anonymous messages?
          </p>

          <Link
            href="/sign-up"
            className="mt-2 inline-block text-sm font-medium text-black hover:underline"
          >
            Create your own page
          </Link>
        </div>
      </div>
    </div>
  );
}
