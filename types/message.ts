// ─── Messaging Types ────────────────────────────────────

export interface Conversation {
  id: string;
  created_at: string;
  updated_at: string;
  participants: ConversationParticipant[];
  last_message: Message | null;
  unread_count: number;
}

export interface ConversationParticipant {
  user_id: string;
  display_name: string;
  slug: string;
  avatar_url: string | null;
}

export interface Message {
  id: string;
  conversation_id: string;
  sender_id: string;
  content: string;
  created_at: string;
  is_read: boolean;
}
