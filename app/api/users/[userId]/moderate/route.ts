import { createClient } from "@/utils/supabase/server";
import { requireAdmin, errorResponse, successResponse } from "@/lib/api-helpers";
import { z } from "zod";

const moderationSchema = z.object({
  action: z.enum(["approve", "reject", "warn", "ban"]),
});

// POST /api/users/[userId]/moderate — Take moderation action on a user (admin only)
export async function POST(
  request: Request,
  { params }: { params: Promise<{ userId: string }> }
) {
  try {
    const { userId } = await params;
    const supabase = await createClient();
    await requireAdmin(supabase);

    const body = await request.json();
    const result = moderationSchema.safeParse(body);

    if (!result.success) {
      return errorResponse(result.error.errors[0].message, 400);
    }

    const { action } = result.data;

    let updateData = {};
    if (action === "approve") {
      updateData = { is_verified_neighbor: true };
    } else if (action === "reject") {
      updateData = { is_verified_neighbor: false };
    } else if (action === "ban") {
      // Logic for ban (e.g., mark as inactive or set a 'banned' column)
      // Since 'is_available' exists, we use that as a proxy for now
      updateData = { is_available: false, trust_score: 0 };
    } else if (action === "warn") {
       // Logic for warning (could decrement trust score)
       const { data: currentProfile } = await supabase
         .from("profiles")
         .select("trust_score")
         .eq("id", userId)
         .single();

       const newScore = Math.max(0, (currentProfile?.trust_score || 50) - 10);
       updateData = { trust_score: newScore };
    }

    const { data: profile, error } = await supabase
      .from("profiles")
      .update(updateData)
      .eq("id", userId)
      .select()
      .single();

    if (error) {
      return errorResponse(error.message, 400);
    }

    return successResponse(profile);
  } catch (err) {
    const error = err as Error;
    if (error.message === "Unauthorized") return errorResponse("Unauthorized", 401);
    if (error.message === "Forbidden") return errorResponse("Forbidden", 403);
    return errorResponse(error.message || "Internal server error", 500);
  }
}
