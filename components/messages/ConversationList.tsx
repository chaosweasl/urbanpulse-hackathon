"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface Conversation {
  id: string;
  name: string;
  avatarUrl?: string | null;
  lastMessage: string;
  unreadCount?: number;
  updatedAt?: string;
  isOnline?: boolean;
}

interface ConversationListProps {
  conversations: Conversation[];
  selectedId?: string;
  onSelect?: (id: string) => void;
  className?: string;
}

/**
 * Messages: ConversationList — list of conversations in inbox.
 * Displays participant avatars, last message preview, and unread badges.
 * Styled with soft backgrounds and clean borders to match the HeroAlert design.
 */
export function ConversationList({
  conversations,
  selectedId,
  onSelect,
  className,
}: ConversationListProps) {
  if (!conversations.length) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-center bg-blue-50/20 rounded-2xl border-2 border-dashed border-blue-100/50 m-4">
        <p className="text-sm font-medium text-blue-900/60 italic">
          No conversations yet. Start a pulse to connect with neighbors!
        </p>
      </div>
    );
  }

  return (
    <div className={cn("flex flex-col gap-1 p-2", className)}>
      {conversations.map((conv) => (
        <button
          key={conv.id}
          onClick={() => onSelect?.(conv.id)}
          className={cn(
            "group relative flex items-center gap-4 p-4 rounded-xl transition-all duration-200 text-left border border-transparent",
            "hover:bg-blue-50/40 hover:border-blue-100/50 hover:shadow-sm",
            selectedId === conv.id
              ? "bg-blue-50 border-blue-100 shadow-sm"
              : "bg-transparent",
            conv.unreadCount && conv.unreadCount > 0 && "font-medium"
          )}
        >
          {/* Avatar Section */}
          <div className="relative shrink-0">
            <Avatar className="h-12 w-12 border-2 border-white shadow-sm group-hover:scale-105 transition-transform">
              <AvatarImage
                src={conv.avatarUrl || ""}
                alt={conv.name}
              />
              <AvatarFallback className="bg-blue-100 text-blue-700 font-bold">
                {conv.name.slice(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            {conv.isOnline && (
              <span className="absolute bottom-0 right-0 h-3.5 w-3.5 rounded-full bg-green-500 border-2 border-white shadow-sm ring-2 ring-green-500/20" />
            )}
          </div>

          {/* Content Section */}
          <div className="flex-1 min-w-0 flex flex-col gap-0.5">
            <div className="flex justify-between items-center gap-2">
              <span className="font-bold text-blue-950 truncate">
                {conv.name}
              </span>
              {conv.unreadCount ? (
                <Badge
                  variant="default"
                  className="bg-blue-600 hover:bg-blue-600 text-white px-2 py-0 min-w-5 justify-center rounded-full text-[10px] h-5 border-none shadow-sm"
                >
                  {conv.unreadCount}
                </Badge>
              ) : null}
            </div>

            <p className={cn(
              "text-xs truncate leading-relaxed",
              conv.unreadCount && conv.unreadCount > 0
                ? "text-blue-900 font-medium"
                : "text-blue-900/60"
            )}>
              {conv.lastMessage}
            </p>
          </div>

          {/* Selection Indicator */}
          {selectedId === conv.id && (
            <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-blue-600 rounded-r-full" />
          )}
        </button>
      ))}
    </div>
  );
}
