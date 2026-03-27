"use client";

import { ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

interface ConversationHeaderProps {
  participant: {
    username: string;
    avatar_url: string | null;
    is_online?: boolean;
    last_seen?: string | null;
  };
  onBack?: () => void;
  className?: string;
}

/**
 * Messages: ConversationHeader — header bar for a conversation thread.
 * Displays neighbor avatar, name, online status, and a back button.
 */
export function ConversationHeader({
  participant,
  onBack,
  className,
}: ConversationHeaderProps) {
  const router = useRouter();

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      router.back();
    }
  };

  return (
    <header
      className={cn(
        "flex items-center justify-between px-4 py-3 border-b bg-background/80 backdrop-blur-md sticky top-0 z-10",
        className
      )}
    >
      <div className="flex items-center gap-3">
        <Button
          variant="ghost"
          size="icon"
          onClick={handleBack}
          className="md:hidden -ml-2 h-9 w-9"
        >
          <ChevronLeft className="h-6 w-6" />
        </Button>

        <div className="relative">
          <Avatar className="h-10 w-10 border border-border shadow-sm">
            <AvatarImage
              src={participant.avatar_url || ""}
              alt={participant.username}
            />
            <AvatarFallback className="bg-blue-100 text-blue-700 font-bold">
              {participant.username.slice(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          {participant.is_online && (
            <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-green-500 border-2 border-background" />
          )}
        </div>

        <div className="flex flex-col">
          <h2 className="font-bold text-base leading-tight">
            {participant.username}
          </h2>
          <p className="text-xs text-muted-foreground">
            {participant.is_online ? (
              <span className="text-green-600 font-medium">Online now</span>
            ) : (
              participant.last_seen || "Offline"
            )}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2">
        {/* Placeholder for future actions like call, info, etc. */}
      </div>
    </header>
  );
}
