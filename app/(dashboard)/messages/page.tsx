"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { MessageCircle, Search, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { ConversationList } from "@/components/messages/ConversationList";
import { useAuth } from "@/hooks/use-auth";

/**
 * MessagesPage — Main inbox view.
 * Displays all active conversations for the current neighbor.
 */
import type { ConversationWithDetails } from "@/types";

interface MappedConversation {
  id: string;
  name: string;
  avatarUrl: string | null;
  lastMessage: string;
  unreadCount: number;
  updatedAt: string;
  isOnline: boolean;
}

/**
 * MessagesPage — Main inbox view.
 * Displays all active conversations for the current neighbor.
 */
export default function MessagesPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [conversations, setConversations] = useState<MappedConversation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    async function fetchConversations() {
      if (!user) return;
      try {
        const response = await fetch("/api/conversations");
        const data = await response.json();

        if (data.success) {
          // Map API data to the format expected by ConversationList
          interface RawMember {
            user_id: string;
            profiles: {
              username: string;
              full_name: string | null;
              avatar_url: string | null;
            };
          }

          const mapped = data.data.map((conv: ConversationWithDetails & { latest_message?: { content: string }, conversation_members: RawMember[] }) => {
            // Find the other participant in the conversation
            const otherMember = conv.conversation_members?.find(
              (m: RawMember) => m.user_id !== user.id
            );

            return {
              id: conv.id,
              name: otherMember?.profiles?.full_name || otherMember?.profiles?.username || "Neighbor",
              avatarUrl: otherMember?.profiles?.avatar_url || null,
              lastMessage: conv.latest_message?.content || "Start a conversation",
              unreadCount: 0, // Unread logic can be added later
              updatedAt: conv.updated_at,
              isOnline: false, // Online status logic can be added later
            };
          });
          setConversations(mapped);
        }
      } catch (err) {
        console.error("Failed to fetch conversations:", err);
      } finally {
        setIsLoading(false);
      }
    }

    if (!authLoading) {
      fetchConversations();
    }
  }, [user, authLoading]);

  const filteredConversations = conversations.filter((conv) =>
    conv.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSelect = (id: string) => {
    router.push(`/messages/${id}`);
  };

  if (authLoading || isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
        <Loader2 className="h-10 w-10 text-blue-600 animate-spin" />
        <p className="text-blue-900/40 font-bold uppercase tracking-widest text-xs">
          Loading your inbox...
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-blue-50/30 p-6 rounded-3xl border border-blue-100/50">
        <div className="flex items-center gap-4">
          <div className="bg-blue-600 p-3 rounded-2xl shadow-lg shadow-blue-600/20">
            <MessageCircle className="text-white h-6 w-6" />
          </div>
          <div>
            <h1 className="text-3xl font-black text-blue-950 tracking-tight leading-none">
              Your Inbox
            </h1>
            <p className="text-blue-600/60 font-medium text-sm mt-1">
              {conversations.length} active connections with neighbors
            </p>
          </div>
        </div>

        <div className="relative md:w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-blue-900/30" />
          <Input
            placeholder="Search conversations..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-white/50 border-blue-100/50 rounded-xl focus:ring-blue-600 focus:border-blue-600 text-sm font-medium"
          />
        </div>
      </div>

      {/* List Container */}
      <div className="bg-white rounded-3xl border-2 border-blue-50 shadow-xl shadow-blue-900/5 overflow-hidden">
        <ConversationList
          conversations={filteredConversations}
          onSelect={handleSelect}
        />
      </div>
    </div>
  );
}
