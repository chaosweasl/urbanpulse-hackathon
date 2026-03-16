import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import { requireAuth, errorResponse, successResponse } from "@/lib/api-helpers";
import { findMatches } from "@/lib/matching";

// POST /api/matching — Trigger smart matching for a pulse
export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const user = await requireAuth(supabase);

    const body = await request.json();
    const pulseId = body.pulseId;

    if (!pulseId) {
      return errorResponse("pulseId is required", 400);
    }

    // Fetch the pulse
    const { data: pulse, error: pulseError } = await supabase
      .from("pulses")
      .select("*")
      .eq("id", pulseId)
      .single();

    if (pulseError || !pulse) {
      return errorResponse("Pulse not found", 404);
    }

    // Only author or admin can trigger matching
    if (pulse.author_id !== user.id) {
       const { data: profile } = await supabase
        .from("profiles")
        .select("is_admin")
        .eq("id", user.id)
        .single();

       if (!profile?.is_admin) {
          return errorResponse("Forbidden", 403);
       }
    }

    // Convert postgis POINT to lat/lng if we need to pass it to findMatches
    // Since Supabase returns EWKT format for geography types, it might look like:
    // '0101000020E6100000...'. Actually, standard select on geography point
    // without PostGIS functions often returns GeoJSON or EWKB.
    // Assuming standard Supabase JS client behaviour or that findMatches handles it
    // (We updated findMatches earlier to just look for .lat and .lng if available,
    // otherwise fallback to string matching).
    // Let's use RPC to get nearby users
    let nearbyProfiles: any[] = [];

    // Here we query nearby profiles if we know the pulse location
    // Since we don't have a direct "get nearby profiles" RPC in schema.sql,
    // we fetch all available profiles. (In production, this would use a spatial query)
    const { data: profiles, error: profilesError } = await supabase
      .from("profiles")
      .select("id, username, full_name, is_available, quiet_hours_start, quiet_hours_end, location, neighborhood_radius_km, skill_tags, trust_score")
      .eq("is_available", true)
      .neq("id", user.id); // don't match with author

    if (!profilesError && profiles) {
       nearbyProfiles = profiles;
    }

    // Find matches
    const matches = findMatches(pulse as any, nearbyProfiles as any);

    // Send "Hero Alert" notifications to matched users
    let notifiedCount = 0;
    for (const match of matches) {
      const { error: notifyError } = await supabase.rpc("create_notification", {
        _user_id: match.user_id,
        _type: "hero_alert",
        _title: "Hero Alert!",
        _body: `Someone nearby needs your help with: ${pulse.title}`,
        _action_url: `/pulses/${pulse.id}`,
        _metadata: { pulse_id: pulse.id, matched_skills: match.matching_skills }
      });

      if (!notifyError) notifiedCount++;
    }

    return successResponse({
      matched_users: matches.length,
      notifications_sent: notifiedCount,
      matches: matches.slice(0, 10) // return top 10 matches for debug/info
    });
  } catch (error: any) {
    if (error.message === "Unauthorized") return errorResponse("Unauthorized", 401);
    return errorResponse(error.message || "Internal server error", 500);
  }
}
