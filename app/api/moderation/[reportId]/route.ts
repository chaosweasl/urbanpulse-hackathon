import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import { requireAdmin, errorResponse, successResponse } from "@/lib/api-helpers";
import { resolveReportSchema } from "@/lib/validators";

// PATCH /api/moderation/[reportId] — Resolve a report (admin only)
export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ reportId: string }> }
) {
  try {
    const { reportId } = await params;
    const supabase = await createClient();
    const user = await requireAdmin(supabase);

    const body = await request.json();
    const result = resolveReportSchema.safeParse(body);

    if (!result.success) {
      return errorResponse(result.error.errors[0].message, 400);
    }

    const { resolution_note, status } = result.data;

    const { data: report, error } = await supabase
      .from("reports")
      .update({
        status,
        resolution_note,
        resolved_by: user.id,
        resolved_at: new Date().toISOString()
      })
      .eq("id", reportId)
      .select()
      .single();

    if (error) {
      return errorResponse(error.message, 400);
    }

    return successResponse(report);
  } catch (error: any) {
    if (error.message === "Unauthorized") return errorResponse("Unauthorized", 401);
    if (error.message === "Forbidden") return errorResponse("Forbidden", 403);
    return errorResponse(error.message || "Internal server error", 500);
  }
}
