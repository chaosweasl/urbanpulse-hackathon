import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import { errorResponse, successResponse } from "@/lib/api-helpers";

// GET /api/users
// Optionally pass ?id=UUID to get interactions breakdown
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("id");

    if (!userId) {
      return errorResponse("User ID is required", 400);
    }

    const supabase = await createClient();

    const { data: interactions, error } = await supabase
      .from("interactions")
      .select("feedback")
      .eq("provider_id", userId)
      .eq("status", "completed");

    if (error) {
      return errorResponse(error.message, 500);
    }

    const stats = {
      positive: 0,
      neutral: 0,
      negative: 0,
      total_completed: interactions.length,
    };

    for (const i of interactions) {
      if (i.feedback === "positive") stats.positive++;
      else if (i.feedback === "neutral") stats.neutral++;
      else if (i.feedback === "negative") stats.negative++;
    }

    // You could also fetch base score & verified status from the profile
    const { data: profile } = await supabase
      .from("profiles")
      .select("trust_score, is_verified_neighbor")
      .eq("id", userId)
      .single();

    return successResponse({
      ...stats,
      trust_score: profile?.trust_score || 0,
      is_verified_neighbor: profile?.is_verified_neighbor || false,
    });
  } catch (error: any) {
    return errorResponse(error.message || "Internal server error", 500);
  }
}
