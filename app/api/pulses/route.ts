import { createClient } from "@/utils/supabase/server";
import { requireAuth, parsePagination, errorResponse, successResponse, paginatedResponse } from "@/lib/api-helpers";
import { createPulseSchema } from "@/lib/validators";
import { findMatches } from "@/lib/matching";
import type { Profile, Pulse } from "@/types";

type SupabaseClientType = Awaited<ReturnType<typeof createClient>>;

type PulseRow = Record<string, unknown> & {
  id?: string;
  author_id?: string;
  lat?: number | null;
  lng?: number | null;
  title?: string;
  description?: string;
  category?: string;
  urgency?: string;
};

const normalizePulseLocation = (pulse: PulseRow): PulseRow => {
  const lat = typeof pulse.lat === "number" ? pulse.lat : null;
  const lng = typeof pulse.lng === "number" ? pulse.lng : null;

  return {
    ...pulse,
    location: lat !== null && lng !== null ? { lat, lng } : pulse.location,
  };
};

const enrichPulseCoordinates = async (
  supabase: SupabaseClientType,
  pulseRows: PulseRow[],
): Promise<PulseRow[]> => {
  const pulseIds = [...new Set(
    pulseRows
      .map((pulse) => pulse.id)
      .filter((pulseId): pulseId is string => typeof pulseId === "string"),
  )];

  if (pulseIds.length === 0) {
    return pulseRows.map(normalizePulseLocation);
  }

  const { data: pulseCoordinates, error: pulseCoordinatesError } = await supabase
    .from("pulses")
    .select("id, lat:st_y(location::geometry), lng:st_x(location::geometry)")
    .in("id", pulseIds);

  if (pulseCoordinatesError) {
    throw new Error(pulseCoordinatesError.message);
  }

  const coordinateMap = new Map((pulseCoordinates || []).map((row) => [row.id, row]));

  return pulseRows.map((pulse) => {
    if (typeof pulse.id !== "string") {
      return normalizePulseLocation(pulse);
    }

    const coords = coordinateMap.get(pulse.id) as { lat?: unknown; lng?: unknown } | undefined;
    if (!coords) {
      return normalizePulseLocation(pulse);
    }

    const nextLat = typeof coords.lat === "number" ? coords.lat : null;
    const nextLng = typeof coords.lng === "number" ? coords.lng : null;

    return normalizePulseLocation({
      ...pulse,
      lat: nextLat,
      lng: nextLng,
    });
  });
};

const triggerHeroAlertsForPulse = async (
  supabase: SupabaseClientType,
  pulse: PulseRow,
  authorId: string,
) => {
  const lat = typeof pulse.lat === "number" ? pulse.lat : null;
  const lng = typeof pulse.lng === "number" ? pulse.lng : null;

  if (lat === null || lng === null || !pulse.id) {
    return { matched_users: 0, notifications_sent: 0 };
  }

  const { data: nearbyProfilesData, error: nearbyProfilesError } = await supabase.rpc("nearby_profiles", {
    lat,
    lng,
    radius_meters: 5000,
  });

  if (nearbyProfilesError || !nearbyProfilesData) {
    return { matched_users: 0, notifications_sent: 0 };
  }

  let nearbyProfiles = (nearbyProfilesData as Profile[]).filter((profile) => profile.id !== authorId);

  const profileIds = nearbyProfiles.map((profile) => profile.id);
  if (profileIds.length > 0) {
    const { data: profileCoords } = await supabase
      .from("profiles")
      .select("id, lat:st_y(location::geometry), lng:st_x(location::geometry)")
      .in("id", profileIds);

    if (profileCoords) {
      nearbyProfiles = nearbyProfiles.map((profile) => {
        const coords = profileCoords.find((row) => row.id === profile.id);
        return coords ? { ...profile, lat: coords.lat, lng: coords.lng } : profile;
      });
    }
  }

  const pulseForMatching: Pulse = {
    id: String(pulse.id),
    created_at: typeof pulse.created_at === "string" ? pulse.created_at : new Date().toISOString(),
    updated_at: typeof pulse.updated_at === "string" ? pulse.updated_at : new Date().toISOString(),
    author_id: authorId,
    title: typeof pulse.title === "string" ? pulse.title : "Neighborhood Need",
    description: typeof pulse.description === "string" ? pulse.description : "",
    category: (pulse.category as Pulse["category"]) || "emergency",
    urgency: (pulse.urgency as Pulse["urgency"]) || "medium",
    status: "active",
    location: { lat, lng },
    radius_meters: 500,
    confirm_count: typeof pulse.confirm_count === "number" ? pulse.confirm_count : 0,
    is_verified: Boolean(pulse.is_verified),
    is_pinned: Boolean(pulse.is_pinned),
    photo_url: typeof pulse.photo_url === "string" ? pulse.photo_url : null,
    expires_at: typeof pulse.expires_at === "string" ? pulse.expires_at : null,
  };

  const matches = findMatches(pulseForMatching, nearbyProfiles);

  let notificationsSent = 0;
  for (const match of matches) {
    const { error: notifyError } = await supabase.rpc("create_notification", {
      _user_id: match.user_id,
      _type: "hero_alert",
      _title: "Hero Alert!",
      _body: `Someone nearby needs help with: ${pulseForMatching.title}`,
      _action_url: `/feed/${pulseForMatching.id}`,
      _metadata: { pulse_id: pulseForMatching.id, matched_skills: match.matching_skills },
    });

    if (!notifyError) notificationsSent++;
  }

  return { matched_users: matches.length, notifications_sent: notificationsSent };
};

// GET /api/pulses — List pulses (with location/category/urgency filters)
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const { page, perPage } = parsePagination(searchParams);

    const lat = searchParams.get("lat");
    const lng = searchParams.get("lng");
    const radius = searchParams.get("radius") || "5000"; // meters
    const category = searchParams.get("category");
    const urgency = searchParams.get("urgency");
    const status = searchParams.get("status") || "active";

    const parsedLat = lat !== null ? Number(lat) : Number.NaN;
    const parsedLng = lng !== null ? Number(lng) : Number.NaN;
    const parsedRadius = Number(radius);
    const hasCoordinates = Number.isFinite(parsedLat) && Number.isFinite(parsedLng);

    const supabase = await createClient();

    let query;
    let totalCount = 0;

    if (hasCoordinates) {
      // Use RPC if available
      query = supabase.rpc("nearby_pulses", {
        lat: parsedLat,
        lng: parsedLng,
        radius_meters: Number.isFinite(parsedRadius) ? parsedRadius : 5000,
      });

      let countQuery = supabase.rpc("nearby_pulses", {
        lat: parsedLat,
        lng: parsedLng,
        radius_meters: Number.isFinite(parsedRadius) ? parsedRadius : 5000,
      }, { count: 'exact', head: true });

      if (category) query = query.eq("category", category);
      if (urgency) query = query.eq("urgency", urgency);
      query = query.eq("status", status);
      query = query.order("is_pinned", { ascending: false }).order("created_at", { ascending: false });

      if (category) countQuery = countQuery.eq("category", category);
      if (urgency) countQuery = countQuery.eq("urgency", urgency);
      countQuery = countQuery.eq("status", status);

      const countRes = await countQuery;
      totalCount = countRes.count || 0;

    } else {
      query = supabase.from("pulses").select(`
        *,
        author:profiles(id, username, full_name, avatar_url, trust_score, is_verified_neighbor)
      `, { count: 'exact' });

      if (category) query = query.eq("category", category);
      if (urgency) query = query.eq("urgency", urgency);
      query = query.eq("status", status);
      query = query.order("is_pinned", { ascending: false }).order("created_at", { ascending: false });
    }

    // Apply pagination
    const from = (page - 1) * perPage;
    const to = from + perPage - 1;
    query = query.range(from, to);

    const { data: pulses, error, count } = await query;
    if (error) {
      // If RPC fails (e.g. not implemented), fallback to standard query
      if (hasCoordinates && error.code === '42883') {
        let fallbackQuery = supabase.from("pulses").select(`
          *,
          author:profiles(id, username, full_name, avatar_url, trust_score, is_verified_neighbor)
        `, { count: 'exact' });
        if (category) fallbackQuery = fallbackQuery.eq("category", category);
        if (urgency) fallbackQuery = fallbackQuery.eq("urgency", urgency);
        fallbackQuery = fallbackQuery.eq("status", status);
        fallbackQuery = fallbackQuery.order("is_pinned", { ascending: false }).order("created_at", { ascending: false });
        fallbackQuery = fallbackQuery.range(from, to);

        const res = await fallbackQuery;
        if (res.error) {
          return errorResponse(res.error.message, 500);
        }

        const normalizedFallback = await enrichPulseCoordinates(supabase, (res.data || []) as PulseRow[]);
        return paginatedResponse(normalizedFallback, res.count || 0, page, perPage);
      }
      return errorResponse(error.message, 500);
    }

    let pulseRows = await enrichPulseCoordinates(supabase, (pulses || []) as PulseRow[]);

    if (hasCoordinates && pulseRows.length > 0) {
      const authorIds = [...new Set(
        pulseRows
          .map((pulse) => pulse.author_id)
          .filter((authorId): authorId is string => typeof authorId === "string"),
      )];

      if (authorIds.length > 0) {
        const { data: authors, error: authorsError } = await supabase
          .from("profiles")
          .select("id, username, full_name, avatar_url, trust_score, is_verified_neighbor")
          .in("id", authorIds);

        if (authorsError) {
          return errorResponse(authorsError.message, 500);
        }

        const authorMap = new Map((authors || []).map((author) => [author.id, author]));
        pulseRows = pulseRows.map((pulse) => ({
          ...pulse,
          author: typeof pulse.author_id === "string" ? (authorMap.get(pulse.author_id) ?? null) : null,
        }));
      }
    }

    pulseRows = pulseRows.sort((a, b) => {
      const aPinned = a.is_pinned ? 1 : 0;
      const bPinned = b.is_pinned ? 1 : 0;
      if (aPinned !== bPinned) return bPinned - aPinned;

      const aDate = typeof a.created_at === "string" ? +new Date(a.created_at) : 0;
      const bDate = typeof b.created_at === "string" ? +new Date(b.created_at) : 0;
      return bDate - aDate;
    });

    // Total count calculation for RPC vs regular query
    const finalCount = count !== null ? count : totalCount;

    return paginatedResponse(pulseRows, finalCount, page, perPage);
  } catch (err) {
    const error = err as Error;
    return errorResponse(error.message || "Internal server error", 500);
  }
}

// POST /api/pulses — Create a new pulse
export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const user = await requireAuth(supabase);

    const body = await request.json();
    const result = createPulseSchema.safeParse(body);

    if (!result.success) {
      return errorResponse(result.error.issues[0].message, 400);
    }

    const { lat, lng, ...pulseData } = result.data;

    const { data: pulse, error } = await supabase
      .from("pulses")
      .insert({
        ...pulseData,
        author_id: user.id,
        location: `POINT(${lng} ${lat})`
      })
      .select("*, lat:st_y(location::geometry), lng:st_x(location::geometry)")
      .single();

    if (error) {
      return errorResponse(error.message, 400);
    }

    const normalizedPulse = normalizePulseLocation((pulse || {}) as PulseRow);

    // Auto-run hero matching on pulse creation so needs are routed immediately.
    try {
      await triggerHeroAlertsForPulse(supabase, normalizedPulse, user.id);
    } catch (matchingError) {
      console.error("Failed to auto-run pulse matching:", matchingError);
    }

    return successResponse(normalizedPulse, 201);
  } catch (err) {
    const error = err as Error;
    if (error.message === "Unauthorized") return errorResponse("Unauthorized", 401);
    return errorResponse(error.message || "Internal server error", 500);
  }
}
