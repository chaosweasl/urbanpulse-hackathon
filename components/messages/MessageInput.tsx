"use client";

import { useState, useRef, useEffect } from "react";
import { Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface MessageInputProps {
  onSend?: (message: string) => void;
  isSending?: boolean;
  className?: string;
}

/**
 * Messages: MessageInput — text input for sending messages.
 * Features an auto-growing textarea and handles 'Enter' to send (Shift+Enter for newline).
 * Cohesive with the HeroAlert and MessageBubble design language.
 */
export function MessageInput({
  onSend,
  isSending = false,
  className,
}: MessageInputProps) {
  const [message, setMessage] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSend = () => {
    const trimmed = message.trim();
    if (!trimmed || isSending) return;

    onSend?.(trimmed);
    setMessage("");
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  // Auto-grow textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 160)}px`;
    }
  }, [message]);

  return (
    <div
      className={cn(
        "flex items-end gap-3 p-4 border-t bg-white/80 backdrop-blur-md sticky bottom-0 z-10",
        className
      )}
    >
      <div className="flex-1 relative">
        <textarea
          ref={textareaRef}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type a message..."
          rows={1}
          className={cn(
            "w-full resize-none rounded-2xl border-2 border-blue-100/30 bg-blue-50/20 px-4 py-3 text-sm transition-all",
            "focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-400/50",
            "placeholder:text-blue-900/30 text-blue-950"
          )}
        />
      </div>

      <Button
        size="icon"
        onClick={handleSend}
        disabled={!message.trim() || isSending}
        className={cn(
          "h-11 w-11 rounded-2xl shadow-lg transition-all active:scale-95",
          "bg-blue-600 hover:bg-blue-700 text-white disabled:opacity-40 disabled:scale-100"
        )}
        aria-label="Send message"
      >
        <Send size={18} className={cn(isSending && "animate-pulse")} />
      </Button>
    </div>
  );
}
