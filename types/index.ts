// ─── UrbanPulse — Consolidated Type Definitions ─────────
//
// Single source of truth for all TypeScript types.
// Organized by feature domain. Keep in sync with schema.sql.

// ─── API Response ───────────────────────────────────────

/** Standard API response wrapper — all endpoints use this */
export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
}

/** Paginated response for list endpoints */
export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination: {
    page: number;
    per_page: number;
    total: number;
    total_pages: number;
  };
}

// ─── Auth & Profile ─────────────────────────────────────

export interface Profile {
  id: string; // Same as auth.users.id
  created_at: string;
  updated_at: string;
  username: string;
  full_name: string | null;
  bio: string | null;
  avatar_url: string | null;
  location: { lat: number; lng: number } | null; // PostGIS geography on DB side
  neighborhood: string | null;
  neighborhood_radius_km: number; // ⚠️ PostGIS ST_DWithin expects meters — multiply by 1000
  skill_tags: string[];
  trust_score: number;
  successful_interactions: number;
  is_verified_neighbor: boolean;
  is_admin: boolean;
  quiet_hours_start: string | null; // HH:mm format
  quiet_hours_end: string | null;
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

// ─── Pulse ──────────────────────────────────────────────

export type PulseCategory = "emergency" | "skill" | "item";

export type PulseUrgency = "low" | "medium" | "high" | "critical";

export type PulseStatus = "active" | "resolved" | "expired";

export interface Pulse {
  id: string;
  created_at: string;
  updated_at: string;
  author_id: string;
  title: string;
  description: string;
  category: PulseCategory;
  urgency: PulseUrgency;
  status: PulseStatus;
  location: { lat: number; lng: number }; // PostGIS geography on DB side
  radius_meters: number;
  confirm_count: number;
  is_verified: boolean;
  is_pinned: boolean;
  photo_url: string | null;
  expires_at: string | null;
}

export interface PulseWithAuthor extends Pulse {
  author: {
    username: string;
    full_name: string | null;
    avatar_url: string | null;
    trust_score: number;
    is_verified_neighbor: boolean;
  };
}

export interface PulseConfirmation {
  id: string;
  created_at: string;
  pulse_id: string;
  user_id: string;
}

// ─── Resource & Interaction ─────────────────────────────

export type ResourceType = "item" | "skill";

export type ResourceStatus = "available" | "lent_out" | "unavailable";

export interface Resource {
  id: string;
  created_at: string;
  updated_at: string;
  owner_id: string;
  type: ResourceType;
  name: string;
  description: string | null;
  tags: string[];
  status: ResourceStatus;
  location: { lat: number; lng: number } | null; // PostGIS geography on DB side
}

export type InteractionStatus =
  | "pending"
  | "accepted"
  | "declined"
  | "completed"
  | "cancelled";

export type InteractionFeedback = "positive" | "neutral" | "negative";

export interface Interaction {
  id: string;
  created_at: string;
  updated_at: string;
  resource_id: string;
  requester_id: string;
  provider_id: string;
  status: InteractionStatus;
  feedback: InteractionFeedback | null;
  feedback_note: string | null;
  completed_at: string | null;
}

// ─── Messaging ──────────────────────────────────────────

export interface Conversation {
  id: string;
  created_at: string;
  updated_at: string;
  pulse_id: string | null; // Optionally linked to a pulse
  resource_id: string | null; // Optionally linked to a resource
}

export interface ConversationMember {
  id: string;
  conversation_id: string;
  user_id: string;
  joined_at: string;
  last_read_at: string | null;
}

/** Client-side enriched conversation (not a direct DB row) */
export interface ConversationWithDetails extends Conversation {
  members: {
    user_id: string;
    username: string;
    avatar_url: string | null;
  }[];
  last_message: Message | null;
  unread_count: number;
}

export interface Message {
  id: string;
  created_at: string;
  conversation_id: string;
  sender_id: string;
  content: string;
}

// ─── Notification ───────────────────────────────────────

export type NotificationType =
  | "hero_alert" // Smart matching found you as a potential helper
  | "pulse_confirmed" // A pulse you posted was verified
  | "message" // New private message
  | "interaction_request" // Someone wants to borrow your resource
  | "weather_alert" // Severe weather warning
  | "system"; // System-wide announcement

export interface Notification {
  id: string;
  created_at: string;
  user_id: string;
  type: NotificationType;
  title: string;
  body: string;
  is_read: boolean;
  read_at: string | null;
  action_url: string | null;
  metadata: Record<string, unknown> | null;
}

// ─── Moderation ─────────────────────────────────────────

export type ReportReason =
  | "spam"
  | "harassment"
  | "misinformation"
  | "inappropriate"
  | "other";

export type ReportStatus = "pending" | "reviewed" | "dismissed";

export interface Report {
  id: string;
  created_at: string;
  reporter_id: string;
  target_type: "pulse" | "user" | "message";
  target_id: string;
  reason: ReportReason;
  description: string | null;
  status: ReportStatus;
  resolved_by: string | null;
  resolved_at: string | null;
  resolution_note: string | null;
}

// ─── AI Pet Guardian ────────────────────────────────────

export type PetReportType = "lost" | "found";
export type PetSpecies = "dog" | "cat" | "bird" | "other";
export type PetReportStatus = "active" | "resolved";

export interface PetReport {
  id: string;
  created_at: string;
  updated_at: string;
  reporter_id: string;
  type: PetReportType;
  species: PetSpecies;
  breed: string | null;
  color: string;
  name: string | null;
  description: string;
  photo_url: string | null;
  ai_tags: string[]; // AI-generated tags: markings, distinctive features
  location: { lat: number; lng: number }; // PostGIS geography on DB side
  status: PetReportStatus;
  resolved_at: string | null;
}

export interface PetMatch {
  id: string;
  created_at: string;
  lost_report_id: string;
  found_report_id: string;
  confidence_score: number; // 0–100
  matched_traits: string[];
}

// ─── Weather (OpenWeatherMap) ───────────────────────────

export interface WeatherAlert {
  event: string;
  description: string;
  start: number; // Unix timestamp
  end: number; // Unix timestamp
}

export interface WeatherData {
  temperature: number;
  description: string;
  icon: string;
  alerts: WeatherAlert[];
  hasSevereAlert: boolean;
}
