"use client";

import { cn } from "@/lib/utils";
import { useTranslations } from "next-intl";

interface TypingIndicatorProps {
  username?: string;
  className?: string;
}

/**
 * Messages: TypingIndicator — a simple bubble showing "User is typing...".
 * Matches the incoming MessageBubble design (bg-muted/50, text-foreground).
 */
export function TypingIndicator({ username, className }: TypingIndicatorProps) {
  const t = useTranslations("MessagesPage");

  return (
    <div
      className={cn(
        "flex w-full mb-4 animate-in fade-in slide-in-from-bottom-1 duration-300",
        "justify-start",
        className
      )}
    >
      <div
        className={cn(
          "bg-muted/50 text-foreground rounded-2xl rounded-bl-none px-4 py-2.5 shadow-sm border border-border/30",
          "flex items-center gap-2"
        )}
      >
        <div className="flex gap-1">
          <span className="w-1.5 h-1.5 bg-primary/60 rounded-full animate-bounce [animation-delay:-0.3s]" />
          <span className="w-1.5 h-1.5 bg-primary/60 rounded-full animate-bounce [animation-delay:-0.15s]" />
          <span className="w-1.5 h-1.5 bg-primary/60 rounded-full animate-bounce" />
        </div>
        <span className="text-xs font-medium text-muted-foreground lowercase italic">
          {username ? t("typingWithName", { name: username }) : t("typing")}
        </span>
      </div>
    </div>
  );
}
