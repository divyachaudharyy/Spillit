"use client";

import { MessageCard } from "@/components/MessageCard";
import { Button } from "@/components/ui/button";

import { Switch } from "@/components/ui/switch";

import { Message } from "@/model/User";
import { ApiResponse } from "@/types/ApiResponse";
import { zodResolver } from "@hookform/resolvers/zod";
import axios, { AxiosError } from "axios";
import { Loader2, RefreshCcw } from "lucide-react";
import { User } from "next-auth";
import { useSession } from "next-auth/react";
import React, { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { AcceptMessageSchema } from "@/schemas/acceptingMessageSchema";
import { toast } from "sonner";

function UserDashboard() {
  //to store and display the msgs on the dasboard in the form of cards
  const [messages, setMessages] = useState<Message[]>([]);
  //for when the various msgs are loading or refresing
  const [isLoading, setIsLoading] = useState(false);
  //the toggle switch is loading or not
  const [isSwitchLoading, setIsSwitchLoading] = useState(false);

  const handleDeleteMessage = (messageId: string) => {
    setMessages(messages.filter((message) => message._id !== messageId));
  };

  //when we made sign-in route using nextauth we injected the user in session as well as jwt callback from there only we are getting this
  const { data: session } = useSession();

  const form = useForm({
    resolver: zodResolver(AcceptMessageSchema),
  });

  const { register, watch, setValue } = form;
  const acceptMessages = watch("acceptMessages");

  //mtlb whether or not user is accepting msgs as of now it helps us get to know that
  const fetchAcceptMessages = useCallback(async () => {
    setIsSwitchLoading(true);
    try {
      const response = await axios.get<ApiResponse>("/api/accept-messages");
      setValue("acceptMessages", response.data.isAcceptingMessages ?? false);
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;

      toast.error(
        axiosError.response?.data.message ?? "Failed to fetch message settings",
      );
    } finally {
      setIsSwitchLoading(false);
    }
  }, [setValue]);

  //fetch the actual msgs
  const fetchMessages = useCallback(
    async (refresh: boolean = false) => {
      setIsLoading(true);
      setIsSwitchLoading(false);
      try {
        const response = await axios.get<ApiResponse>("/api/get-messages");
        setMessages(response.data.messages || []);
        if (refresh) {
          toast("Refreshed Messages", {
            description: "Showing latest messages",
          });
        }
      } catch (error) {
        const axiosError = error as AxiosError<ApiResponse>;
        toast.error(
          axiosError.response?.data.message ?? "Failed to fetch messages",
        );
      } finally {
        setIsLoading(false);
        setIsSwitchLoading(false);
      }
    },
    [setIsLoading, setMessages],
  );

  // Fetch initial state from the server
  useEffect(() => {
    if (!session || !session.user) return;

    fetchMessages();

    fetchAcceptMessages();
  }, [session, setValue, fetchAcceptMessages, fetchMessages]);

  // Handle switch change
  const handleSwitchChange = async () => {
    try {
      const response = await axios.post<ApiResponse>("/api/accept-messages", {
        acceptMessages: !acceptMessages,
      });
      setValue("acceptMessages", !acceptMessages);
      toast.success(response.data.message);
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast.error(
        axiosError.response?.data.message ??
          "Failed to update message settings",
      );
    }
  };

  if (!session || !session.user) {
    return <div></div>;
  }

  const { username } = session.user as User;

  const baseUrl = `${window.location.protocol}//${window.location.host}`;
  const profileUrl = `${baseUrl}/u/${username}`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(profileUrl);
    toast.success("URL Copied!", {
      description: "Profile URL has been copied to clipboard.",
    });
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-zinc-900 via-zinc-950 to-zinc-800 text-white px-4 py-8">
      {/* MAIN CONTAINER */}
      <div className="max-w-4xl mx-auto space-y-6">
        {/*  HEADER */}
        <div className="space-y-2 text-center md:text-left">
          <h1 className="text-2xl md:text-3xl font-semibold bg-linear-to-r from-pink-400 via-purple-400 to-blue-400 bg-clip-text text-transparent">
            Your Space
          </h1>
          <p className="text-gray-400 text-sm">
            See what people are saying about you
          </p>
        </div>

        {/*  LINK CARD */}
        <div className="bg-white/5 border border-white/10 rounded-xl p-4 space-y-3">
          <h2 className="text-xs text-gray-400">Your link</h2>

          <div className="flex flex-col sm:flex-row gap-2">
            <input
              type="text"
              value={profileUrl}
              disabled
              className="w-full p-2 rounded-lg bg-zinc-900 border border-white/10 text-sm text-gray-300"
            />

            <Button
              onClick={copyToClipboard}
              className="bg-linear-to-r from-pink-500 via-purple-500 to-blue-500 text-white"
            >
              Copy
            </Button>
          </div>
        </div>

        {/*  SETTINGS ROW */}
        <div className="flex items-center justify-between bg-white/5 border border-white/10 rounded-xl p-4">
          <span className="text-sm text-gray-300">Accept Messages</span>

          <Switch
            {...register("acceptMessages")}
            checked={acceptMessages}
            onCheckedChange={handleSwitchChange}
            disabled={isSwitchLoading}
            className="
    data-[state=checked]:bg-linear-to-r 
    data-[state=checked]:from-pink-500 
    data-[state=checked]:to-purple-500

    data-[state=unchecked]:bg-zinc-700

    relative transition-all duration-300
  "
          />
        </div>

        {/*  REFRESH */}
        <div className="flex justify-end">
          <Button
            className="bg-white/5 border border-white/10 hover:bg-white/10"
            onClick={(e) => {
              e.preventDefault();
              fetchMessages(true);
            }}
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <div className="flex items-center gap-2">
                <RefreshCcw className="h-4 w-4" />
                Refresh
              </div>
            )}
          </Button>
        </div>

        {/*  MESSAGES */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {messages.length > 0 ? (
            messages.map((message) => (
              <MessageCard
                key={message._id}
                message={message}
                onMessageDelete={handleDeleteMessage}
              />
            ))
          ) : (
            <div className="col-span-full text-center text-gray-400 py-10">
              <p>No messages yet 👀</p>
              <p className="text-sm mt-1">
                Share your link and start receiving messages
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default UserDashboard;
//if any doubt ask gpt
