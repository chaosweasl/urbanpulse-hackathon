"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { Check, CheckCheck } from "lucide-react";

interface MessageBubbleProps {
  message: string;
  timestamp: string | Date;
  isCurrentUser: boolean;
  isRead?: boolean;
}

export function MessageBubble({
  message,
  timestamp,
  isCurrentUser,
  isRead = false,
}: MessageBubbleProps) {
  const time = new Date(timestamp).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <div
      className={cn(
        "group mb-4 flex w-full animate-in fade-in slide-in-from-bottom-2 duration-300",
        isCurrentUser ? "justify-end pl-12" : "justify-start pr-12"
      )}
    >
      <div
        className={cn(
          "relative max-w-sm rounded-xl p-4 transition-colors",
          isCurrentUser
            ? "rounded-br-sm bg-primary text-primary-foreground"
            : "rounded-bl-sm bg-zinc-800 text-foreground"
        )}
      >
        <p className="text-sm font-medium leading-relaxed tracking-tight">
          {message}
        </p>

        <div
          className={cn(
            "mt-1.5 flex items-center justify-end gap-1 text-[10px] font-medium uppercase tracking-wider opacity-70",
            isCurrentUser ? "text-primary-foreground/80" : "text-muted-foreground"
          )}
        >
          <span>{time}</span>
          {isCurrentUser && (
            <div className="ml-1">
              {isRead ? (
                <CheckCheck size={12} className="text-primary-foreground" />
              ) : (
                <Check size={12} />
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
