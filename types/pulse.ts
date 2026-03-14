// ─── Pulse Types ────────────────────────────────────────

export type PulseType = "emergency" | "skill" | "item";

export type UrgencyLevel = "low" | "medium" | "high" | "critical";

export type PulseStatus = "active" | "resolved" | "expired" | "verified";

export interface Pulse {
  id: string;
  created_at: string;
  updated_at: string;
  author_id: string;
  title: string;
  description: string;
  type: PulseType;
  urgency: UrgencyLevel;
  status: PulseStatus;
  latitude: number;
  longitude: number;
  radius_meters: number;
  upvote_count: number;
  is_verified: boolean;
  expires_at: string | null;
}

export interface PulseWithAuthor extends Pulse {
  author: {
    display_name: string;
    slug: string;
    avatar_url: string | null;
    trust_score: number;
  };
}
