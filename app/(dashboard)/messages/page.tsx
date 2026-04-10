"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Search, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { ConversationList } from "@/components/messages/ConversationList";
import { useAuth } from "@/hooks/use-auth";
import type { ConversationWithDetails } from "@/types";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";

interface MappedConversation {
  id: string;
  name: string;
  avatarUrl: string | null;
  lastMessage: string;
  updatedAt: string;
}

export default function MessagesPage() {
  const t = useTranslations("MessagesPage");
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [conversations, setConversations] = useState<MappedConversation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login");
      setIsLoading(false);
    }
  }, [authLoading, user, router]);

  useEffect(() => {
    async function fetchConversations() {
      if (!user) return;

      try {
        setError(null);
        const response = await fetch("/api/conversations");
        const data = await response.json();

        if (data.success && data.data) {
          // Map API data to the format expected by ConversationList
          interface RawMember {
            user_id: string;
            profiles: {
              username: string;
              full_name: string | null;
              avatar_url: string | null;
            } | null;
          }

          const mapped = data.data.map((conv: ConversationWithDetails & { latest_message?: { content: string }, conversation_members: RawMember[] }) => {
            // Find the other participant in the conversation
            const otherMember = conv.conversation_members?.find(
              (m: RawMember) => m.user_id !== user.id
            );

            return {
              id: conv.id,
              name: otherMember?.profiles?.full_name || otherMember?.profiles?.username || t("neighbor"),
              avatarUrl: otherMember?.profiles?.avatar_url || null,
              lastMessage: conv.latest_message?.content || t("startConversation"),
              updatedAt: conv.updated_at,
            };
          });
          setConversations(mapped);
        } else {
          setError(data.error || t("failedToLoadConversations"));
        }
      } catch (err) {
        console.error("Failed to fetch conversations:", err);
        setError(t("failedToLoadConversations"));
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
        <Loader2 className="h-10 w-10 text-primary animate-spin" />
        <p className="text-muted-foreground font-bold uppercase tracking-widest text-xs">
          {t("loadingInbox")}
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mx-auto flex min-h-[60vh] max-w-2xl flex-col items-center justify-center gap-4 text-center">
        <p className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground">{t("errorBadge")}</p>
        <h1 className="text-3xl font-black tracking-tight">{t("errorTitle")}</h1>
        <p className="max-w-lg text-sm text-muted-foreground">{error}</p>
        <Button onClick={() => window.location.reload()} className="rounded-full px-6 font-bold">
          {t("retry")}
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header Section */}
      <div className="mb-8">
        <p className="text-[10px] font-black uppercase tracking-[0.3em] text-primary mb-3">{t("badge")}</p>
        <h1 className="text-5xl font-black tracking-tighter">{t("title")}</h1>
      </div>

      <div className="relative w-full">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder={t("searchPlaceholder")}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10 bg-card border-border/50 rounded-xl focus:ring-primary focus:border-primary text-sm font-medium"
        />
      </div>

      {/* List Container */}
      <div className="bg-card rounded-2xl border border-border/50 shadow-xl shadow-black/5 overflow-hidden">
        <ConversationList
          conversations={filteredConversations}
          onSelect={handleSelect}
        />
      </div>
    </div>
  );
}
