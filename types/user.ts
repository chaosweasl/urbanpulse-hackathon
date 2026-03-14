// ─── User & Profile Types ───────────────────────────────

export type UserRole = "user" | "verified" | "admin";

export interface User {
  id: string;
  created_at: string;
  email: string;
  role: UserRole;
}

export interface Profile {
  id: string;
  user_id: string;
  created_at: string;
  updated_at: string;
  display_name: string;
  slug: string;
  bio: string | null;
  avatar_url: string | null;
  latitude: number | null;
  longitude: number | null;
  neighborhood: string | null;
  skill_tags: string[];
  resources: Resource[];
  trust_score: number;
  successful_interactions: number;
  quiet_hours_start: string | null; // HH:mm format
  quiet_hours_end: string | null;
  max_distance_km: number;
  is_available: boolean;
}

export interface Resource {
  id: string;
  name: string;
  description: string | null;
  category: string;
  is_available: boolean;
}

export interface TrustScoreBreakdown {
  base_score: number;
  successful_lends: number;
  successful_helps: number;
  positive_feedback_count: number;
  negative_feedback_count: number;
  verified_badge: boolean;
  computed_score: number;
}
