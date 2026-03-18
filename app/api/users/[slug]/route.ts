import { createClient } from "@/utils/supabase/server";
import { errorResponse, successResponse } from "@/lib/api-helpers";

// GET /api/users/[slug]
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const supabase = await createClient();

    // Query public profile fields (excluding quiet_hours and is_admin)
    // slug is used for username here
    const { data: profile, error } = await supabase
      .from("profiles")
      .select("id, created_at, username, full_name, bio, avatar_url, location, neighborhood_radius_km, is_available, skill_tags, trust_score, is_verified_neighbor")
      .eq("username", slug)
      .single();

    if (error || !profile) {
      // fallback to UUID lookup just in case slug was an id
      const { data: idProfile, error: idError } = await supabase
        .from("profiles")
        .select("id, created_at, username, full_name, bio, avatar_url, location, neighborhood_radius_km, is_available, skill_tags, trust_score, is_verified_neighbor")
        .eq("id", slug)
        .single();

      if (idError || !idProfile) {
         return errorResponse("User not found", 404);
      }
      return successResponse(idProfile);
    }

    return successResponse(profile);
  } catch (err) {
    const error = err as Error;
    return errorResponse(error.message || "Internal server error", 500);
  }
}
