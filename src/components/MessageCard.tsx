"use client";

import { toast } from "sonner";
import axios, { AxiosError } from "axios";
import dayjs from "dayjs";
import { X } from "lucide-react";
import { Message } from "@/model/User";
import { Card } from "@/components/ui/card";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "./ui/button";

import { ApiResponse } from "@/types/ApiResponse";

type MessageCardProps = {
  message: Message;
  onMessageDelete: (messageId: string) => void;
};

export function MessageCard({ message, onMessageDelete }: MessageCardProps) {
  const handleDeleteConfirm = async () => {
    try {
      const response = await axios.delete<ApiResponse>(
        `/api/delete-message/${message._id}`,
      );
      toast(response.data.message);
      onMessageDelete(message._id);
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast.error("Error", {
        description:
          axiosError.response?.data.message ?? "Failed to delete message",
      });
    }
  };

  return (
    <Card className="bg-white/5 border border-white/10 rounded-xl p-4 hover:bg-white/10 transition">
      <div className="flex justify-between items-start gap-3">
        <p className="text-sm text-gray-200 leading-relaxed">
          {message.content}
        </p>

        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="ghost" className="hover:bg-white">
              <X className="w-4 h-4 text-red-500" />
            </Button>
          </AlertDialogTrigger>

          <AlertDialogContent className="bg-zinc-900 text-white border border-white/10">
            <AlertDialogHeader>
              <AlertDialogTitle>Delete message?</AlertDialogTitle>
              <AlertDialogDescription>
                This cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>

            <AlertDialogFooter>
              <AlertDialogCancel className="text-black">
                Cancel
              </AlertDialogCancel>
              <AlertDialogAction onClick={handleDeleteConfirm}>
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>

      <p className="text-xs text-gray-500 mt-3">
        {dayjs(message.createdAt).format("MMM D, YYYY h:mm A")}
      </p>
    </Card>
  );
}
