import { z } from "zod";
import { createClient } from "@/utils/supabase/server";
import { requireAuth, errorResponse, successResponse } from "@/lib/api-helpers";
import { stripHtml } from "@/lib/sanitize";

const safetyCheckinSchema = z.object({
  lat: z.number().min(-90).max(90),
  lng: z.number().min(-180).max(180),
  event: z.string().trim().min(1).max(120),
  description: z.string().trim().max(600).optional().default(""),
});

// POST /api/pulses/safety-checkin
export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const user = await requireAuth(supabase);

    const body = await request.json();
    const validated = safetyCheckinSchema.parse(body);

    const eventLabel = stripHtml(validated.event).slice(0, 120);
    const weatherDetails = stripHtml(validated.description || "").slice(0, 500);

    const title = `Safety Check-in: ${eventLabel}`;
    const description = [
      `Severe weather alert in your area: ${eventLabel}.`,
      weatherDetails ? `Details: ${weatherDetails}` : null,
      "Use this thread to quickly confirm your status and help nearby neighbors.",
    ]
      .filter(Boolean)
      .join(" ");

    const sixHoursAgo = new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString();

    const { data: nearbyPulses, error: nearbyPulsesError } = await supabase.rpc("nearby_pulses", {
      p_lat: validated.lat,
      p_lng: validated.lng,
      p_radius_meters: 2000,
    });

    if (!nearbyPulsesError && nearbyPulses) {
      const existingNearby = (nearbyPulses as Array<Record<string, unknown>>).find((pulse) => {
        const titleCandidate = typeof pulse.title === "string" ? pulse.title : "";
        const createdAtCandidate = typeof pulse.created_at === "string" ? pulse.created_at : "";
        const isRecent = createdAtCandidate ? new Date(createdAtCandidate) >= new Date(sixHoursAgo) : false;

        return (
          pulse.is_pinned === true &&
          pulse.status === "active" &&
          pulse.category === "emergency" &&
          titleCandidate.startsWith("Safety Check-in:") &&
          isRecent
        );
      });

      if (existingNearby && typeof existingNearby.id === "string") {
        return successResponse({
          id: existingNearby.id,
          title: typeof existingNearby.title === "string" ? existingNearby.title : title,
          reused: true,
        });
      }
    }

    const { data: existing, error: existingError } = await supabase
      .from("pulses")
      .select("id, title")
      .eq("is_pinned", true)
      .eq("status", "active")
      .eq("category", "emergency")
      .gte("created_at", sixHoursAgo)
      .ilike("title", "Safety Check-in:%")
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (existingError) {
      return errorResponse(existingError.message, 500);
    }

    if (existing) {
      return successResponse({
        id: existing.id,
        title: existing.title,
        reused: true,
      });
    }

    const expiresAt = new Date(Date.now() + 12 * 60 * 60 * 1000).toISOString();

    const { data: created, error: createError } = await supabase
      .from("pulses")
      .insert({
        author_id: user.id,
        title,
        description,
        category: "emergency",
        urgency: "high",
        status: "active",
        location: `POINT(${validated.lng} ${validated.lat})`,
        radius_meters: 1000,
        is_pinned: true,
        expires_at: expiresAt,
      })
      .select("id, title")
      .single();

    if (createError) {
      return errorResponse(createError.message, 500);
    }

    return successResponse({
      id: created.id,
      title: created.title,
      reused: false,
    }, 201);
  } catch (err) {
    if (err instanceof z.ZodError) {
      return errorResponse(err.issues[0]?.message || "Invalid payload", 400);
    }

    const error = err as Error;
    return errorResponse(error.message || "Internal server error", 500);
  }
}
