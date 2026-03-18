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

    // Validate the report exists and belongs to the requesting user.
    // NOTE: the table is called 'pets', NOT 'pet_reports'.
    const { data: report, error: reportError } = await supabase
      .from("pets")
      .select("reporter_id")
      .eq("id", reportId)
      .single();

    if (reportError || !report) {
      return errorResponse("Pet report not found", 404);
    }

    if (report.reporter_id !== user.id) {
      return errorResponse("Forbidden", 403);
    }

    // Fetch pet matches for this report, sorted by best confidence first
    const { data: matches, error } = await supabase
      .from("pet_matches")
      .select(
        `
        id,
        confidence_score,
        matched_traits,
        created_at,
        lost_report:pets!lost_report_id(id, type, species, breed, color, name, description, photo_url, location),
        found_report:pets!found_report_id(id, type, species, breed, color, name, description, photo_url, location)
      `,
      )
      .or(`lost_report_id.eq.${reportId},found_report_id.eq.${reportId}`)
      .order("confidence_score", { ascending: false });

    if (error) {
      return errorResponse(error.message, 500);
    }

    return successResponse(matches || []);
  } catch (err) {
    const error = err as Error;
    if (error.message === "Unauthorized")
      return errorResponse("Unauthorized", 401);
    return errorResponse(error.message || "Internal server error", 500);
  }
}
