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
  <div className="min-h-screen bg-white px-4 py-10 text-black">
    <div className="mx-auto max-w-4xl space-y-8">

      {/* HEADER */}
      <div className="space-y-2">
        <h1 className="text-3xl font-semibold tracking-tight">
          Your messages
        </h1>

        <p className="text-sm text-gray-500">
          Manage your anonymous messages and sharing link.
        </p>
      </div>

      {/* LINK CARD */}
      <div className="rounded-lg border border-gray-200 bg-white p-5">
        <div className="mb-3">
          <h2 className="text-sm font-medium text-black">
            Your anonymous link
          </h2>

          <p className="mt-1 text-xs text-gray-500">
            Share this link to receive anonymous messages.
          </p>
        </div>

        <div className="flex flex-col gap-2 sm:flex-row">
          <input
            type="text"
            value={profileUrl}
            disabled
            className="h-11 w-full rounded-md border border-gray-300 bg-gray-50 px-3 text-sm text-gray-600 outline-none"
          />

          <Button
            type="button"
            onClick={copyToClipboard}
            className="h-11 rounded-md bg-black px-6 text-white hover:bg-gray-800"
          >
            Copy link
          </Button>
        </div>
      </div>

      {/* SETTINGS */}
      <div className="flex items-center justify-between rounded-lg border border-gray-200 bg-white p-5">
        <div>
          <h2 className="text-sm font-medium text-black">
            Accept messages
          </h2>

          <p className="mt-1 text-xs text-gray-500">
            Allow people to send you anonymous messages.
          </p>
        </div>

        <Switch
          {...register("acceptMessages")}
          checked={acceptMessages}
          onCheckedChange={handleSwitchChange}
          disabled={isSwitchLoading}
          className="
            data-[state=checked]:bg-black
            data-[state=unchecked]:bg-gray-300
          "
        />
      </div>

      {/* MESSAGES HEADER */}
      <div className="flex items-center justify-between border-b border-gray-200 pb-4">
        <div>
          <h2 className="text-lg font-semibold">
            Messages
          </h2>

          <p className="mt-1 text-xs text-gray-500">
            Anonymous messages you've received.
          </p>
        </div>

        <Button
          type="button"
          variant="outline"
          className="h-9 rounded-md border-gray-300 bg-white text-black hover:bg-gray-100"
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

      {/* MESSAGES */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {messages.length > 0 ? (
          messages.map((message) => (
            <MessageCard
              key={message._id}
              message={message}
              onMessageDelete={handleDeleteMessage}
            />
          ))
        ) : (
          <div className="col-span-full rounded-lg border border-dashed border-gray-300 py-16 text-center">
            <p className="text-sm font-medium text-gray-700">
              No messages yet
            </p>

            <p className="mt-1 text-sm text-gray-500">
              Share your anonymous link to start receiving messages.
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
