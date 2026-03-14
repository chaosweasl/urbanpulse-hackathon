// ─── Database Row Types ─────────────────────────────────
//
// These mirror the Supabase table schemas exactly.
// When the database schema changes, update these types.
// Use Supabase CLI `supabase gen types` to auto-generate if preferred.
//
// For now, re-export the application types as database rows.
// As the schema evolves, this file may diverge from the app types
// (e.g., database uses snake_case, app types may use camelCase).

export type { Pulse } from "./pulse";
export type { User, Profile, Resource } from "./user";
export type { Conversation, Message } from "./message";
export type { PetReport, PetMatch } from "./pet";
export type { Notification } from "./notification";
export type { FlaggedContent } from "./moderation";
