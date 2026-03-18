// ─── Server-side Validation Schemas ─────────────────────
//
// TODO: Install zod (`pnpm add zod`) and define schemas here.
//
// Example:
//
// import { z } from "zod";
//
// export const createPulseSchema = z.object({
//   title: z.string().min(3).max(200),
//   description: z.string().min(10).max(2000),
//   type: z.enum(["emergency", "skill", "item"]),
//   urgency: z.enum(["low", "medium", "high", "critical"]),
//   latitude: z.number().min(-90).max(90),
//   longitude: z.number().min(-180).max(180),
// });
//
// export const registerSchema = z.object({
//   email: z.string().email(),
//   password: z.string().min(8),
//   display_name: z.string().min(2).max(50),
// });

<<<<<<< Updated upstream
export {};
=======
/** Sanitize an optional string — returns undefined if absent, stripped HTML otherwise */
const optionalStripHtml = (v: string | undefined) => (v ? stripHtml(v) : v);
// User Auth & Profiles
export const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  username: z.string().min(3).max(30).transform(stripHtml),
  full_name: z.string().min(2).max(100).optional().transform(optionalStripHtml),
});

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

export const updateProfileSchema = z
  .object({
    full_name: z.string().optional().transform(optionalStripHtml),
    bio: z.string().optional().transform(optionalStripHtml),
    avatar_url: z.string().url().optional(),
    lat: z.number().min(-90).max(90).optional(),
    lng: z.number().min(-180).max(180).optional(),
    neighborhood_radius_km: z.number().min(0.1).max(500).optional(),
    is_available: z.boolean().optional(),
    quiet_hours_start: z.string().optional(), // Expected format "HH:MM:SS"
    quiet_hours_end: z.string().optional(), // Expected format "HH:MM:SS"
    skill_tags: z.array(z.string()).optional(),
  })
  .partial();

// Pulses
export const createPulseSchema = z.object({
  title: z.string().min(3).max(100).transform(stripHtml),
  description: z.string().min(10).max(1000).transform(stripHtml),
  category: z.enum(["emergency", "skill", "item"]),
  urgency: z.enum(["low", "medium", "high", "critical"]),
  lat: z.number().min(-90).max(90),
  lng: z.number().min(-180).max(180),
  photo_url: z.string().url().optional().or(z.literal("")),
});

export const updatePulseSchema = createPulseSchema.partial().extend({
  status: z.enum(["active", "resolved", "expired"]).optional(),
});

// Resources
export const createResourceSchema = z.object({
  name: z.string().min(3).max(100).transform(stripHtml),
  type: z.enum(["item", "skill"]),
  description: z.string().max(1000).optional().transform(optionalStripHtml),
  tags: z.array(z.string()).optional(),
  lat: z.number().min(-90).max(90).optional(),
  lng: z.number().min(-180).max(180).optional(),
});

export const updateResourceSchema = createResourceSchema.partial().extend({
  // DB resource_status enum: 'available' | 'lent_out' | 'unavailable'
  status: z.enum(["available", "lent_out", "unavailable"]).optional(),
});

// Interactions
export const requestInteractionSchema = z.object({
  message: z.string().optional().transform(optionalStripHtml),
});

export const updateInteractionSchema = z.object({
  status: z
    .enum(["pending", "accepted", "declined", "completed", "cancelled"])
    .optional(),
  feedback: z.enum(["positive", "neutral", "negative"]).optional(),
  feedback_note: z.string().optional().transform(optionalStripHtml),
});

// Messaging
export const sendMessageSchema = z.object({
  content: z.string().min(1).transform(stripHtml),
  recipient_id: z.string().uuid().optional(), // Used for new conversations
});

// Pets
export const createPetReportSchema = z.object({
  type: z.enum(["lost", "found"]),
  species: z.enum(["dog", "cat", "bird", "other"]),
  breed: z.string().optional().transform(optionalStripHtml),
  // color is NOT NULL in DB — required field
  color: z.string().min(1).max(100).transform(stripHtml),
  name: z.string().optional().transform(optionalStripHtml),
  description: z.string().min(10).max(1000).transform(stripHtml),
  lat: z.number().min(-90).max(90),
  lng: z.number().min(-180).max(180),
  photo_url: z.string().url().optional(),
});

// Moderation
export const createReportSchema = z.object({
  // DB check constraint: target_type IN ('pulse', 'user', 'message')
  target_type: z.enum(["pulse", "user", "message"]),
  target_id: z.string().uuid(),
  reason: z.enum([
    "spam",
    "harassment",
    "misinformation",
    "inappropriate",
    "other",
  ]),
  description: z
    .string()
    .min(10)
    .max(1000)
    .optional()
    .transform(optionalStripHtml),
});

export const resolveReportSchema = z.object({
  resolution_note: z.string().min(5).transform(stripHtml),
  status: z.enum(["reviewed", "dismissed"]), // Usually changed to reviewed or dismissed
});
>>>>>>> Stashed changes
