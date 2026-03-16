import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import { errorResponse, successResponse } from "@/lib/api-helpers";

// GET /api/pets/[petId] — Get a single pet report
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ petId: string }> }
) {
  try {
    const { petId } = await params;
    const supabase = await createClient();

    const { data: report, error } = await supabase
      .from("pet_reports")
      .select(`
        *,
        reporter:profiles(id, username, full_name, avatar_url, trust_score, is_verified_neighbor)
      `)
      .eq("id", petId)
      .single();

    if (error || !report) {
      return errorResponse("Pet report not found", 404);
    }

    return successResponse(report);
  } catch (error: any) {
    return errorResponse(error.message || "Internal server error", 500);
  }
}
