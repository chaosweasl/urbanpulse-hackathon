import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import { requireAuth, errorResponse, successResponse } from "@/lib/api-helpers";

// GET /api/pets/match?report_id=UUID
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const reportId = searchParams.get("report_id");

    if (!reportId) {
      return errorResponse("report_id is required", 400);
    }

    const supabase = await createClient();
    const user = await requireAuth(supabase);

    // Validate the report belongs to the user
    const { data: report, error: reportError } = await supabase
      .from("pet_reports")
      .select("reporter_id")
      .eq("id", reportId)
      .single();

    if (reportError || !report || report.reporter_id !== user.id) {
      return errorResponse("Forbidden", 403);
    }

    // Fetch pet matches for this report
    const { data: matches, error } = await supabase
      .from("pet_matches")
      .select(`
        id,
        confidence_score,
        status,
        created_at,
        lost_report:pet_reports!lost_report_id(id, type, species, breed, color, name, description, photo_url, location),
        found_report:pet_reports!found_report_id(id, type, species, breed, color, name, description, photo_url, location)
      `)
      .or(`lost_report_id.eq.${reportId},found_report_id.eq.${reportId}`)
      .order("created_at", { ascending: false });

    if (error) {
      return errorResponse(error.message, 500);
    }

    return successResponse(matches || []);
  } catch (error: any) {
    if (error.message === "Unauthorized") return errorResponse("Unauthorized", 401);
    return errorResponse(error.message || "Internal server error", 500);
  }
}
