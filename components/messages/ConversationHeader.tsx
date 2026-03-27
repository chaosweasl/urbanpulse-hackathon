"use client";

import { ChevronLeft, Info, Phone, Video } from "lucide-react";
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
 * Cohesive with the HeroAlert design language (soft backgrounds, clean shadows).
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
        "flex items-center justify-between px-4 py-3 border-b bg-white/80 backdrop-blur-md sticky top-0 z-20 shadow-sm",
        className
      )}
    >
      <div className="flex items-center gap-3">
        <Button
          variant="ghost"
          size="icon"
          onClick={handleBack}
          className="md:hidden -ml-2 h-10 w-10 text-blue-900/70 hover:text-blue-900 hover:bg-blue-50/50 rounded-full"
        >
          <ChevronLeft className="h-6 w-6" />
        </Button>

        <div className="relative group cursor-pointer">
          <Avatar className="h-10 w-10 border-2 border-white shadow-md group-hover:scale-105 transition-transform">
            <AvatarImage
              src={participant.avatar_url || ""}
              alt={participant.username}
            />
            <AvatarFallback className="bg-blue-100 text-blue-700 font-bold">
              {participant.username.slice(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          {participant.is_online && (
            <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-green-500 border-2 border-white shadow-sm ring-2 ring-green-500/20" />
          )}
        </div>

        <div className="flex flex-col">
          <h2 className="font-bold text-blue-950 text-base leading-tight">
            {participant.username}
          </h2>
          <p className="text-[11px] font-medium uppercase tracking-wider">
            {participant.is_online ? (
              <span className="text-green-600">Online now</span>
            ) : (
              <span className="text-blue-900/40">{participant.last_seen || "Offline"}</span>
            )}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-1">
        <Button
          variant="ghost"
          size="icon"
          className="h-9 w-9 text-blue-900/40 hover:text-blue-600 hover:bg-blue-50/50 rounded-full transition-colors"
          aria-label="Audio Call"
        >
          <Phone className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="h-9 w-9 text-blue-900/40 hover:text-blue-600 hover:bg-blue-50/50 rounded-full transition-colors"
          aria-label="Video Call"
        >
          <Video className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="h-9 w-9 text-blue-900/40 hover:text-blue-600 hover:bg-blue-50/50 rounded-full transition-colors"
          aria-label="Conversation Info"
        >
          <Info className="h-4 w-4" />
        </Button>
      </div>
    </header>
  );
}
