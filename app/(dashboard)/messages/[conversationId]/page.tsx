"use client";

import { use, useState, useEffect, useRef } from "react";
import { useAuth } from "@/hooks/use-auth";
import { ConversationHeader } from "@/components/messages/ConversationHeader";
import { MessageBubble } from "@/components/messages/MessageBubble";
import { MessageInput } from "@/components/messages/MessageInput";
import { TypingIndicator } from "@/components/messages/TypingIndicator";
import { useRealtime } from "@/hooks/use-realtime";
import type { Message } from "@/types";
import { useTranslations } from "next-intl";

interface PageProps {
  params: Promise<{ conversationId: string }>;
}

export default function ConversationPage({ params }: PageProps) {
  const t = useTranslations("MessagesPage");
  const { conversationId } = use(params);
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [isTyping] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [participant, setParticipant] = useState<{ username: string; avatar_url: string | null; is_online: boolean }>({
    username: t("neighbor"),
    avatar_url: null,
    is_online: false,
  });
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    async function fetchMessages() {
      const response = await fetch(`/api/messages/${conversationId}?per_page=50`);
      const data = await response.json();
      if (data.success && data.data) {
        setMessages([...(data.data)].reverse()); // API returns newest-first, reverse for chat
      }
    }
    fetchMessages();
  }, [conversationId]);

  useEffect(() => {
    async function fetchConversation() {
      const response = await fetch(`/api/conversations`);
      const data = await response.json();
      if (data.success && data.data) {
        const conv = data.data.find((c: { id: string }) => c.id === conversationId);
        if (conv && conv.conversation_members) {
          const other = conv.conversation_members.find(
            (m: { user_id: string }) => m.user_id !== user?.id
          );
          if (other?.profiles) {
            setParticipant({
              username: other.profiles.full_name || other.profiles.username || t("neighbor"),
              avatar_url: other.profiles.avatar_url || null,
              is_online: false,
            });
          }
        }
      }
    }
    if (user) fetchConversation();
  }, [conversationId, user, t]);

  // Scroll to bottom when messages change
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const handleSend = async (content: string) => {
    setIsSending(true);
    try {
      const response = await fetch(`/api/messages/${conversationId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content }),
      });
      const data = await response.json();
      if (data.success) {
        setMessages((prev) => [...prev, data.data]);
      }
    } catch (err) {
      console.error("Send error:", err);
    } finally {
      setIsSending(false);
    }
  };

  // Listen for real-time messages
  useRealtime("messages", "INSERT", (payload) => {
    const newMessage = payload as unknown as Message;
    if (newMessage.conversation_id === conversationId) {
      setMessages((prev) => [...prev, newMessage]);
    }
  });

  return (
    <div className="flex h-[calc(100vh-theme(spacing.32))] flex-col overflow-hidden rounded-lg border border-white/8 bg-zinc-900">
      <ConversationHeader participant={participant} />

      <div ref={scrollRef} className="flex-1 space-y-4 overflow-y-auto bg-zinc-900 p-4">
        {messages.length === 0 && (
          <div className="flex h-full flex-col items-center justify-center space-y-2 text-center">
            <p className="font-medium italic text-muted-foreground">{t("noMessagesTitle")}</p>
            <p className="max-w-[220px] text-xs text-muted-foreground">
              {t("noMessagesDescription")}
            </p>
          </div>
        )}

        {messages.map((msg) => (
          <MessageBubble
            key={msg.id}
            message={msg.content}
            timestamp={msg.created_at}
            isCurrentUser={msg.sender_id === user?.id}
            isRead={true}
          />
        ))}

        {isTyping && <TypingIndicator username={participant.username} />}
      </div>

      <MessageInput onSend={handleSend} isSending={isSending} />
    </div>
  );
}
