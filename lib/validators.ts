import { z } from "zod";

// User Auth & Profiles
export const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  username: z.string().min(3).max(30),
  full_name: z.string().min(2).max(100).optional(),
});

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

export const updateProfileSchema = z.object({
  full_name: z.string().optional(),
  bio: z.string().optional(),
  avatar_url: z.string().url().optional(),
  lat: z.number().min(-90).max(90).optional(),
  lng: z.number().min(-180).max(180).optional(),
  max_distance_km: z.number().min(1).max(500).optional(),
  is_available: z.boolean().optional(),
  quiet_hours_start: z.string().optional(), // Expected format "HH:MM:SS"
  quiet_hours_end: z.string().optional(), // Expected format "HH:MM:SS"
  skill_tags: z.array(z.string()).optional(),
}).partial();

// Pulses
export const createPulseSchema = z.object({
  title: z.string().min(3).max(100),
  description: z.string().min(10).max(1000),
  category: z.enum(["emergency", "skill", "item"]),
  urgency: z.enum(["low", "medium", "high", "critical"]),
  lat: z.number().min(-90).max(90),
  lng: z.number().min(-180).max(180),
});

export const updatePulseSchema = createPulseSchema.partial().extend({
  status: z.enum(["active", "resolved", "expired"]).optional(),
});

// Resources
export const createResourceSchema = z.object({
  name: z.string().min(3).max(100),
  type: z.enum(["item", "skill"]),
  description: z.string().max(1000).optional(),
  tags: z.array(z.string()).optional(),
  lat: z.number().min(-90).max(90).optional(),
  lng: z.number().min(-180).max(180).optional(),
});

// Interactions
export const requestInteractionSchema = z.object({
  message: z.string().optional(),
});

export const updateInteractionSchema = z.object({
  status: z.enum(["pending", "accepted", "declined", "completed", "cancelled"]).optional(),
  feedback: z.enum(["positive", "neutral", "negative"]).optional(),
  feedback_note: z.string().optional(),
});

// Messaging
export const sendMessageSchema = z.object({
  content: z.string().min(1),
  recipient_id: z.string().uuid().optional(), // Used for new conversations
});

// Pets
export const createPetReportSchema = z.object({
  type: z.enum(["lost", "found"]),
  species: z.enum(["dog", "cat", "bird", "other"]),
  breed: z.string().optional(),
  color: z.string().optional(),
  name: z.string().optional(),
  description: z.string().min(10).max(1000),
  lat: z.number().min(-90).max(90),
  lng: z.number().min(-180).max(180),
  photo_url: z.string().url().optional(),
});

// Moderation
export const createReportSchema = z.object({
  target_type: z.enum(["user", "pulse", "resource", "interaction", "pet_report", "message"]),
  target_id: z.string().uuid(),
  reason: z.enum(["spam", "harassment", "misinformation", "inappropriate", "other"]),
  description: z.string().min(10).max(1000).optional(),
});

export const resolveReportSchema = z.object({
  resolution_note: z.string().min(5),
  status: z.enum(["reviewed", "dismissed"]), // Usually changed to reviewed or dismissed
});
