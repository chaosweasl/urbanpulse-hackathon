import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import { requireAuth, requireAdmin, parsePagination, errorResponse, successResponse, paginatedResponse } from "@/lib/api-helpers";
import { createReportSchema } from "@/lib/validators";

// GET /api/moderation — List flagged content (admin only)
export async function GET(request: Request) {
  try {
    const supabase = await createClient();
    await requireAdmin(supabase);

    const { searchParams } = new URL(request.url);
    const { page, perPage } = parsePagination(searchParams);
    const status = searchParams.get("status") || "pending";

    let query = supabase
      .from("reports")
      .select(`
        *,
        reporter:profiles!reporter_id(id, username),
        resolver:profiles!resolved_by(id, username)
      `, { count: 'exact' })
      .eq("status", status)
      .order("created_at", { ascending: false });

    const from = (page - 1) * perPage;
    const to = from + perPage - 1;
    query = query.range(from, to);

    const { data: reports, error, count } = await query;
    if (error) {
      return errorResponse(error.message, 500);
    }

    return paginatedResponse(reports || [], count || 0, page, perPage);
  } catch (error: any) {
    if (error.message === "Unauthorized") return errorResponse("Unauthorized", 401);
    if (error.message === "Forbidden") return errorResponse("Forbidden", 403);
    return errorResponse(error.message || "Internal server error", 500);
  }
}

// POST /api/moderation — Create a new report
export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const user = await requireAuth(supabase);

    const body = await request.json();
    const result = createReportSchema.safeParse(body);

    if (!result.success) {
      return errorResponse(result.error.errors[0].message, 400);
    }

    const reportData = result.data;

    const { data: report, error } = await supabase
      .from("reports")
      .insert({
        ...reportData,
        reporter_id: user.id
      })
      .select()
      .single();

    if (error) {
      return errorResponse(error.message, 400);
    }

    return successResponse(report, 201);
  } catch (error: any) {
    if (error.message === "Unauthorized") return errorResponse("Unauthorized", 401);
    return errorResponse(error.message || "Internal server error", 500);
  }
}
