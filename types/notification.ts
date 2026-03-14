// ─── Notification Types ─────────────────────────────────

export type NotificationType =
  | "hero_alert"        // Smart matching found you as a potential helper
  | "pulse_response"    // Someone responded to your pulse
  | "message"           // New private message
  | "weather_alert"     // Severe weather warning
  | "system"            // System-wide announcement
  | "verification";     // Your post was verified by the community

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
