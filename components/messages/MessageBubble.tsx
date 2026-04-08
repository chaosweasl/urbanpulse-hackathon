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
          "relative max-w-sm rounded-2xl p-4 shadow-xl transition-all hover:scale-[1.01]",
          isCurrentUser
            ? "bg-primary text-primary-foreground rounded-tr-none"
            : "bg-muted/80 backdrop-blur-md text-foreground rounded-tl-none border border-border/50"
        )}
      >
        {/* Message Text */}
        <p className="text-sm font-medium leading-relaxed tracking-tight">
          {message}
        </p>

        {/* Bubble Tail (WhatsApp-style) */}
        <div
          className={cn(
            "absolute top-0 size-4",
            isCurrentUser
              ? "-right-1.5 bg-primary clip-path-tail-right"
              : "-left-1.5 bg-muted/80 clip-path-tail-left border-l border-t border-border/50"
          )}
        />

        {/* Metadata Footer */}
        <div
          className={cn(
            "mt-1.5 flex items-center justify-end gap-1 text-[10px] font-bold uppercase tracking-widest opacity-70",
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
