import { createClient } from "@/utils/supabase/server";
import { requireAuth, parsePagination, errorResponse, successResponse, paginatedResponse } from "@/lib/api-helpers";
import { createPulseSchema } from "@/lib/validators";

type SupabaseClientType = Awaited<ReturnType<typeof createClient>>;

type PulseRow = Record<string, unknown> & {
  id?: string;
  author_id?: string;
  lat?: number | null;
  lng?: number | null;
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
      query = query.order("created_at", { ascending: false });
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
        fallbackQuery = fallbackQuery.order("created_at", { ascending: false });
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

    return successResponse(normalizePulseLocation((pulse || {}) as PulseRow), 201);
  } catch (err) {
    const error = err as Error;
    if (error.message === "Unauthorized") return errorResponse("Unauthorized", 401);
    return errorResponse(error.message || "Internal server error", 500);
  }
}
