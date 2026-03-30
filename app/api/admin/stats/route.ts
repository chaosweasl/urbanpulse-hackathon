import { createClient } from "@/utils/supabase/server";
import { requireAdmin, errorResponse, successResponse } from "@/lib/api-helpers";

// GET /api/admin/stats — Fetch key platform metrics (admin only)
export async function GET() {
  try {
    const supabase = await createClient();
    await requireAdmin(supabase);

    // Get total users count
    const { count: usersCount, error: usersError } = await supabase
      .from("profiles")
      .select("*", { count: 'exact', head: true });

    // Get active pulses count
    const { count: pulsesCount, error: pulsesError } = await supabase
      .from("pulses")
      .select("*", { count: 'exact', head: true })
      .eq("status", "active");

    // Get pending reports count
    const { count: flaggedCount, error: flaggedError } = await supabase
      .from("reports")
      .select("*", { count: 'exact', head: true })
      .eq("status", "pending");

    // Get verified pulses count
    const { count: verifiedCount, error: verifiedError } = await supabase
      .from("pulses")
      .select("*", { count: 'exact', head: true })
      .eq("is_verified", true);

    if (usersError || pulsesError || flaggedError || verifiedError) {
      return errorResponse("Failed to fetch statistics", 500);
    }

    return successResponse({
      users: usersCount || 0,
      posts: pulsesCount || 0,
      flagged: flaggedCount || 0,
      verified: verifiedCount || 0,
    });
  } catch (err) {
    const error = err as Error;
    if (error.message === "Unauthorized") return errorResponse("Unauthorized", 401);
    if (error.message === "Forbidden") return errorResponse("Forbidden", 403);
    return errorResponse(error.message || "Internal server error", 500);
  }
}
