import { Profile, Pulse } from "@/types";
import { createClient } from "@/utils/supabase/server";
import { requireAuth, errorResponse, successResponse } from "@/lib/api-helpers";
import { findMatches } from "@/lib/matching";

type PulseRow = Record<string, unknown> & {
  id?: string;
  author_id?: string;
  title?: string;
  description?: string;
  category?: string;
  urgency?: string;
  location?: unknown;
  lat?: number | null;
  lng?: number | null;
};

const parsePointText = (value: string): { lat: number; lng: number } | null => {
  const pointMatch = value.match(/POINT\(\s*([-+]?\d*\.?\d+)\s+([-+]?\d*\.?\d+)\s*\)/i);
  if (!pointMatch) return null;

  const lng = Number(pointMatch[1]);
  const lat = Number(pointMatch[2]);

  if (!Number.isFinite(lat) || !Number.isFinite(lng)) {
    return null;
  }

  return { lat, lng };
};

const extractCoordinatesFromLocation = (location: unknown): { lat: number; lng: number } | null => {
  if (!location) {
    return null;
  }

  if (typeof location === "object") {
    const value = location as { lat?: unknown; lng?: unknown; coordinates?: unknown };

    if (typeof value.lat === "number" && typeof value.lng === "number") {
      return { lat: value.lat, lng: value.lng };
    }

    if (
      Array.isArray(value.coordinates)
      && value.coordinates.length >= 2
      && typeof value.coordinates[0] === "number"
      && typeof value.coordinates[1] === "number"
    ) {
      return {
        lat: value.coordinates[1],
        lng: value.coordinates[0],
      };
    }

    return null;
  }

  if (typeof location === "string") {
    const parsedPoint = parsePointText(location);
    if (parsedPoint) {
      return parsedPoint;
    }

    try {
      const parsedJson = JSON.parse(location) as unknown;
      return extractCoordinatesFromLocation(parsedJson);
    } catch {
      return null;
    }
  }

  return null;
};

const normalizePulseLocation = (pulse: PulseRow): PulseRow => {
  const extracted = extractCoordinatesFromLocation(pulse.location);
  const lat = typeof pulse.lat === "number" ? pulse.lat : extracted?.lat ?? null;
  const lng = typeof pulse.lng === "number" ? pulse.lng : extracted?.lng ?? null;

  return {
    ...pulse,
    lat,
    lng,
    location: lat !== null && lng !== null ? { lat, lng } : pulse.location ?? null,
  };
};

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

    // Fetch the pulse and normalize location from the raw location payload.
    const { data: pulseRaw, error: pulseError } = await supabase
      .from("pulses")
      .select("*")
      .eq("id", pulseId)
      .single();

    if (pulseError || !pulseRaw) {
      return errorResponse("Pulse not found", 404);
    }

    const pulse = normalizePulseLocation((pulseRaw || {}) as PulseRow);

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
    if (typeof pulse.lat === "number" && typeof pulse.lng === "number") {
      const { data: profiles, error: profilesError } = await supabase.rpc("nearby_profiles", {
        p_lat: pulse.lat,
        p_lng: pulse.lng,
        p_radius_meters: 5000
      });

      if (!profilesError && profiles) {
         // Exclude author from matches
         nearbyProfiles = (profiles as Profile[])
           .filter((p: Profile) => p.id !== pulse.author_id)
           .map((profile) => {
             const coords = extractCoordinatesFromLocation((profile as Profile & { location?: unknown }).location);
             return coords
               ? ({ ...profile, lat: coords.lat, lng: coords.lng } as Profile)
               : profile;
           });
      }
    } else {
      // Fallback if no location data could be parsed
      const { data: profiles, error: profilesError } = await supabase
        .from("profiles")
        .select("*")
        .eq("is_available", true)
        .neq("id", user.id);

      if (!profilesError && profiles) {
         nearbyProfiles = profiles as Profile[];
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
        _action_url: `/feed/${pulse.id}`,
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
