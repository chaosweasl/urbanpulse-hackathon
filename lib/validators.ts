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

export {};
