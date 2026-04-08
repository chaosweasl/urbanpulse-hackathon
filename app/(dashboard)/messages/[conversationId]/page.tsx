"use client";

import { use, useState, useEffect, useRef } from "react";
import { useAuth } from "@/hooks/use-auth";
import { ConversationHeader } from "@/components/messages/ConversationHeader";
import { MessageBubble } from "@/components/messages/MessageBubble";
import { MessageInput } from "@/components/messages/MessageInput";
import { TypingIndicator } from "@/components/messages/TypingIndicator";
import { useRealtime } from "@/hooks/use-realtime";
import type { Message } from "@/types";

interface PageProps {
  params: Promise<{ conversationId: string }>;
}

export default function ConversationPage({ params }: PageProps) {
  const { conversationId } = use(params);
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [isTyping] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Mock neighbor for UI demo
  const participant = {
    username: "Alex",
    avatar_url: null,
    is_online: true,
  };


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
    <div className="flex flex-col h-[calc(100vh-theme(spacing.32))] bg-blue-50/10 rounded-3xl border-2 border-blue-100/40 overflow-hidden shadow-sm">
      <ConversationHeader participant={participant} />

      <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full text-center space-y-2 opacity-40">
            <p className="text-blue-900 font-medium italic">No messages yet.</p>
            <p className="text-xs text-blue-900/60 max-w-[200px]">
              Start a conversation to coordinate help with your neighbor.
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
