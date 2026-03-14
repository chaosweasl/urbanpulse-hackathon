// ─── App Constants ──────────────────────────────────────

/** Default radius (in meters) for proximity-based queries */
export const DEFAULT_RADIUS_METERS = 500;

/** Maximum radius users can set for pulse filtering */
export const MAX_RADIUS_METERS = 5000;

/** Number of confirmations needed to auto-verify a post */
export const VERIFICATION_THRESHOLD = 3;

/** Number of successful interactions to earn "Verified Neighbor" badge */
export const VERIFIED_NEIGHBOR_THRESHOLD = 3;

/** Pulse types with display labels and colors */
export const PULSE_TYPES = {
  emergency: { label: "Emergency", color: "red" },
  skill: { label: "Skill Request", color: "blue" },
  item: { label: "Item Request", color: "green" },
} as const;

/** Urgency levels with display labels */
export const URGENCY_LEVELS = {
  low: { label: "Low", priority: 0 },
  medium: { label: "Medium", priority: 1 },
  high: { label: "High", priority: 2 },
  critical: { label: "Critical", priority: 3 },
} as const;

/** Default pagination settings */
export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_PER_PAGE: 20,
  MAX_PER_PAGE: 100,
} as const;
