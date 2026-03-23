import { createClient } from "@/utils/supabase/server";
import { requireAdmin, parsePagination, errorResponse, successResponse, paginatedResponse } from "@/lib/api-helpers";

// GET /api/admin/users — List and search users (admin only)
export async function GET(request: Request) {
  try {
    const supabase = await createClient();
    await requireAdmin(supabase);

    const { searchParams } = new URL(request.url);
    const { page, perPage } = parsePagination(searchParams);
    const search = searchParams.get("search") || "";

    let query = supabase
      .from("profiles")
      .select("*", { count: 'exact' })
      .order("created_at", { ascending: false });

    if (search) {
      query = query.or(`username.ilike.%${search}%,full_name.ilike.%${search}%`);
    }

    const from = (page - 1) * perPage;
    const to = from + perPage - 1;
    query = query.range(from, to);

    const { data: users, error, count } = await query;
    if (error) {
      return errorResponse(error.message, 500);
    }

    return paginatedResponse(users || [], count || 0, page, perPage);
  } catch (err) {
    const error = err as Error;
    if (error.message === "Unauthorized") return errorResponse("Unauthorized", 401);
    if (error.message === "Forbidden") return errorResponse("Forbidden", 403);
    return errorResponse(error.message || "Internal server error", 500);
  }
}

// PATCH /api/admin/users — Update user roles (admin only)
export async function PATCH(request: Request) {
  try {
    const supabase = await createClient();
    await requireAdmin(supabase);

    const body = await request.json();
    const { userId, is_admin } = body;

    if (!userId) {
      return errorResponse("userId is required", 400);
    }

    const { data: profile, error } = await supabase
      .from("profiles")
      .update({ is_admin })
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
