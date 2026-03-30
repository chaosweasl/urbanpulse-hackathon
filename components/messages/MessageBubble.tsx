"use client";

import { Check, CheckCheck } from "lucide-react";
import { cn } from "@/lib/utils";

interface MessageBubbleProps {
  content: string;
  timestamp: string; // Expected already formatted (e.g. "14:32")
  isOwn: boolean;
  isRead?: boolean;
}

/**
 * Messages: MessageBubble — single message in a conversation.
 * Displays content in a sender-aligned bubble with timestamp and read status.
 * Own messages use a soft blue background and the user's specific branding.
 */
export function MessageBubble({
  content,
  timestamp,
  isOwn,
  isRead = false,
}: MessageBubbleProps) {
  return (
    <div
      className={cn(
        "flex w-full mb-2 animate-in fade-in slide-in-from-bottom-2 duration-300",
        isOwn ? "justify-end" : "justify-start"
      )}
    >
      <div
        className={cn(
          "max-w-[75%] md:max-w-[60%] rounded-2xl px-4 py-2.5 text-sm shadow-sm transition-all",
          isOwn
            ? "bg-blue-600 text-white rounded-br-none shadow-blue-900/10"
            : "bg-muted/50 text-blue-950 rounded-bl-none border border-blue-100/30"
        )}
      >
        {/* Message content */}
        <p className="break-words leading-relaxed whitespace-pre-wrap">{content}</p>

        {/* Footer (time + read status) */}
        <div
          className={cn(
            "flex items-center justify-end gap-1.5 mt-1.5 text-[10px] font-medium uppercase tracking-tighter",
            isOwn ? "text-white/70" : "text-blue-900/40"
          )}
        >
          <span>{timestamp}</span>

          {/* Read status (only for own messages) */}
          {isOwn && (
            <span className="flex items-center">
              {isRead ? (
                <CheckCheck size={12} className="text-white" />
              ) : (
                <Check size={12} className="text-white/60" />
              )}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
