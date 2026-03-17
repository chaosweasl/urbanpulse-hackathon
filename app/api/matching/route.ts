import { Profile, Pulse } from "@/types";
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

    // Fetch the pulse and extract lat/lng using PostGIS functions
    const { data: pulseRaw, error: pulseError } = await supabase
      .from("pulses")
      .select("*, lat:st_y(location::geometry), lng:st_x(location::geometry)")
      .eq("id", pulseId)
      .single();

    if (pulseError || !pulseRaw) {
      return errorResponse("Pulse not found", 404);
    }

    // Inject the extracted coords into the pulse object for `findMatches`
    const pulse = { ...pulseRaw, lat: pulseRaw.lat, lng: pulseRaw.lng };

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
    let nearbyProfiles: Profile[] = [];

    // Here we query nearby profiles using the pulse location and a default radius (e.g. 5000m)
    // The `nearby_profiles` RPC was added to the schema.sql
    if (pulse.lat && pulse.lng) {
      const { data: profiles, error: profilesError } = await supabase.rpc("nearby_profiles", {
        lat: pulse.lat,
        lng: pulse.lng,
        radius_meters: 5000
      });

      if (!profilesError && profiles) {
         // Exclude author from matches
         nearbyProfiles = profiles.filter((p: Profile) => p.id !== user.id);

         // In order for the findMatches logic to work properly, we need to ensure each profile
         // has lat and lng if the location is selected.
         // But the RPC just returns `setof profiles`, which has `location` as geography.
         // Let's fetch the coords for profiles so haversineDistance works.
         const profileIds = nearbyProfiles.map(p => p.id);
         if (profileIds.length > 0) {
            const { data: profilesWithCoords } = await supabase
              .from("profiles")
              .select("id, lat:st_y(location::geometry), lng:st_x(location::geometry)")
              .in("id", profileIds);

            if (profilesWithCoords) {
               nearbyProfiles = nearbyProfiles.map(p => {
                  const coords = profilesWithCoords.find(c => c.id === p.id);
                  return coords ? { ...p, lat: coords.lat, lng: coords.lng } : p;
               });
            }
         }
      }
    } else {
      // Fallback if no location data could be parsed
      const { data: profiles, error: profilesError } = await supabase
        .from("profiles")
        .select("id, username, full_name, is_available, quiet_hours_start, quiet_hours_end, location, neighborhood_radius_km, skill_tags, trust_score")
        .eq("is_available", true)
        .neq("id", user.id);

      if (!profilesError && profiles) {
         nearbyProfiles = profiles;
      }
    }

    // Find matches
    const matches = findMatches(pulse as unknown as Pulse, nearbyProfiles);

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
  } catch (err) {
    const error = err as Error;
    if (error.message === "Unauthorized") return errorResponse("Unauthorized", 401);
    return errorResponse(error.message || "Internal server error", 500);
  }
}
