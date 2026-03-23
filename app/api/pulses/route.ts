import { createClient } from "@/utils/supabase/server";
import { requireAuth, parsePagination, errorResponse, successResponse, paginatedResponse } from "@/lib/api-helpers";
import { createPulseSchema } from "@/lib/validators";

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

    const supabase = await createClient();

    let query;
    let totalCount = 0;

    if (lat && lng) {
      // Use RPC if available
      query = supabase.rpc("nearby_pulses", {
        lat: parseFloat(lat),
        lng: parseFloat(lng),
        radius_meters: parseFloat(radius)
      });

      const countQuery = supabase.rpc("nearby_pulses", {
        lat: parseFloat(lat),
        lng: parseFloat(lng),
        radius_meters: parseFloat(radius)
      }, { count: 'exact', head: true });

      if (category) query = query.eq("category", category);
      if (urgency) query = query.eq("urgency", urgency);
      query = query.eq("status", status);

      if (category) countQuery.eq("category", category);
      if (urgency) countQuery.eq("urgency", urgency);
      countQuery.eq("status", status);

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
      if (lat && lng && error.code === '42883') {
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
        return paginatedResponse(res.data || [], res.count || 0, page, perPage);
      }
      return errorResponse(error.message, 500);
    }

    // Total count calculation for RPC vs regular query
    const finalCount = count !== null ? count : totalCount;

    return paginatedResponse(pulses || [], finalCount, page, perPage);
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
      .select()
      .single();

    if (error) {
      return errorResponse(error.message, 400);
    }

    return successResponse(pulse, 201);
  } catch (err) {
    const error = err as Error;
    if (error.message === "Unauthorized") return errorResponse("Unauthorized", 401);
    return errorResponse(error.message || "Internal server error", 500);
  }
}
