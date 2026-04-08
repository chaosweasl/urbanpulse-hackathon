import { createClient } from "@/utils/supabase/server";
import { requireAdmin, errorResponse, successResponse } from "@/lib/api-helpers";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug: userId } = await params;
    const supabase = await createClient();
    await requireAdmin(supabase);

    const { action } = await request.json();

    if (action === "ban" || action === "reject") {
      const { error } = await supabase
        .from("profiles")
        .update({ is_available: false })
        .eq("id", userId);
      if (error) return errorResponse(error.message, 400);
      return successResponse({ action, userId });
    }

    if (action === "approve") {
      const { error } = await supabase
        .from("profiles")
        .update({ is_verified_neighbor: true, is_available: true })
        .eq("id", userId);
      if (error) return errorResponse(error.message, 400);
      return successResponse({ action, userId });
    }

    if (action === "warn") {
      // Send a notification to the user
      await supabase.rpc("create_notification", {
        _user_id: userId,
        _type: "system",
        _title: "Community Guidelines Warning",
        _body: "Your account has received a warning from a moderator. Please review the community guidelines.",
        _action_url: null,
        _metadata: { type: "warning" }
      });
      return successResponse({ action, userId });
    }

    return errorResponse("Unknown action", 400);
  } catch (err) {
    const error = err as Error;
    if (error.message === "Unauthorized") return errorResponse("Unauthorized", 401);
    if (error.message === "Forbidden") return errorResponse("Forbidden", 403);
    return errorResponse(error.message, 500);
  }
}
