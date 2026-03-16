import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import { requireAuth, parsePagination, errorResponse, successResponse, paginatedResponse } from "@/lib/api-helpers";

// GET /api/notifications — List notifications for user
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const { page, perPage } = parsePagination(searchParams);
    const isReadParam = searchParams.get("is_read");

    const supabase = await createClient();
    const user = await requireAuth(supabase);

    let query = supabase
      .from("notifications")
      .select("*", { count: 'exact' })
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    if (isReadParam !== null) {
      query = query.eq("is_read", isReadParam === 'true');
    }

    const from = (page - 1) * perPage;
    const to = from + perPage - 1;
    query = query.range(from, to);

    const { data: notifications, error, count } = await query;
    if (error) {
      return errorResponse(error.message, 500);
    }

    return paginatedResponse(notifications || [], count || 0, page, perPage);
  } catch (error: any) {
    if (error.message === "Unauthorized") return errorResponse("Unauthorized", 401);
    return errorResponse(error.message || "Internal server error", 500);
  }
}

// PATCH /api/notifications — Mark notifications as read
export async function PATCH(request: Request) {
  try {
    const supabase = await createClient();
    const user = await requireAuth(supabase);

    const body = await request.json();
    const { notificationIds, markAllRead } = body;

    if (markAllRead) {
      const { error } = await supabase
        .from("notifications")
        .update({ is_read: true, read_at: new Date().toISOString() })
        .eq("user_id", user.id)
        .eq("is_read", false);

      if (error) {
        return errorResponse(error.message, 500);
      }

      return successResponse({ message: "All notifications marked as read" });
    }

    if (!notificationIds || !Array.isArray(notificationIds) || notificationIds.length === 0) {
      return errorResponse("notificationIds array is required", 400);
    }

    // Validate ownership implicitly by eq("user_id", user.id)
    const { error } = await supabase
      .from("notifications")
      .update({ is_read: true, read_at: new Date().toISOString() })
      .eq("user_id", user.id)
      .in("id", notificationIds);

    if (error) {
      return errorResponse(error.message, 500);
    }

    return successResponse({ message: "Notifications marked as read" });
  } catch (error: any) {
    if (error.message === "Unauthorized") return errorResponse("Unauthorized", 401);
    return errorResponse(error.message || "Internal server error", 500);
  }
}
