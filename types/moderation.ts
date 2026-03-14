// ─── Moderation Types ───────────────────────────────────

export type ReportReason =
  | "spam"
  | "harassment"
  | "misinformation"
  | "inappropriate"
  | "duplicate"
  | "other";

export type ReportStatus = "pending" | "resolved" | "dismissed";

export interface FlaggedContent {
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
