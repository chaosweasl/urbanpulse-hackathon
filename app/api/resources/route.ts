import { createClient } from "@/utils/supabase/server";
import { requireAuth, parsePagination, errorResponse, successResponse, paginatedResponse } from "@/lib/api-helpers";
import { createResourceSchema } from "@/lib/validators";

type SupabaseClientType = Awaited<ReturnType<typeof createClient>>;

type ResourceRow = Record<string, unknown> & {
  lat?: number | null;
  lng?: number | null;
};

const normalizeResourceLocation = (resource: ResourceRow): ResourceRow => {
  const lat = typeof resource.lat === "number" ? resource.lat : null;
  const lng = typeof resource.lng === "number" ? resource.lng : null;

  return {
    ...resource,
    location: lat !== null && lng !== null ? { lat, lng } : resource.location,
  };
};

const enrichResourceCoordinates = async (
  supabase: SupabaseClientType,
  resources: ResourceRow[],
): Promise<ResourceRow[]> => {
  const resourceIds = [...new Set(
    resources
      .map((resource) => resource.id)
      .filter((resourceId): resourceId is string => typeof resourceId === "string"),
  )];

  if (resourceIds.length === 0) {
    return resources.map(normalizeResourceLocation);
  }

  const { data: coordinateRows, error: coordinateError } = await supabase
    .from("resources")
    .select("id, lat:st_y(location::geometry), lng:st_x(location::geometry)")
    .in("id", resourceIds);

  if (coordinateError) {
    throw new Error(coordinateError.message);
  }

  const coordinateMap = new Map((coordinateRows || []).map((row) => [row.id, row]));

  return resources.map((resource) => {
    if (typeof resource.id !== "string") {
      return normalizeResourceLocation(resource);
    }

    const coords = coordinateMap.get(resource.id) as { lat?: unknown; lng?: unknown } | undefined;
    if (!coords) {
      return normalizeResourceLocation(resource);
    }

    return normalizeResourceLocation({
      ...resource,
      lat: typeof coords.lat === "number" ? coords.lat : null,
      lng: typeof coords.lng === "number" ? coords.lng : null,
    });
  });
};

// GET /api/resources — List resources
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const { page, perPage } = parsePagination(searchParams);

    const type = searchParams.get("type");
    const status = searchParams.get("status") || "available";
    const ownerId = searchParams.get("owner_id");
    const tags = searchParams.getAll("tags");

    const supabase = await createClient();

    let query = supabase
      .from("resources")
      .select(`
        *,
        owner:profiles(id, username, full_name, avatar_url, trust_score, is_verified_neighbor)
      `, { count: 'exact' })
      .eq("status", status);

    if (type) query = query.eq("type", type);
    if (ownerId) query = query.eq("owner_id", ownerId);
    if (tags.length > 0) query = query.contains("tags", tags);

    // Apply pagination
    const from = (page - 1) * perPage;
    const to = from + perPage - 1;
    query = query.range(from, to).order("created_at", { ascending: false });

    const { data: resources, error, count } = await query;

    if (error) {
      return errorResponse(error.message, 500);
    }

    const normalizedResources = await enrichResourceCoordinates(supabase, (resources || []) as ResourceRow[]);
    return paginatedResponse(normalizedResources, count || 0, page, perPage);
  } catch (err) {
    const error = err as Error;
    return errorResponse(error.message || "Internal server error", 500);
  }
}

// POST /api/resources — Create a new resource
export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const user = await requireAuth(supabase);

    const body = await request.json();
    const result = createResourceSchema.safeParse(body);

    if (!result.success) {
      return errorResponse(result.error.issues[0].message, 400);
    }

    const { lat, lng, ...resourceData } = result.data;

    const dbData: Record<string, unknown> = {
      ...resourceData,
      owner_id: user.id,
    };

    if (lat !== undefined && lng !== undefined) {
      dbData.location = `POINT(${lng} ${lat})`;
    }

    const { data: resource, error } = await supabase
      .from("resources")
      .insert(dbData)
      .select("*")
      .single();

    if (error) {
      return errorResponse(error.message, 400);
    }

    const [normalizedResource] = await enrichResourceCoordinates(supabase, [((resource || {}) as ResourceRow)]);
    return successResponse(normalizedResource || normalizeResourceLocation((resource || {}) as ResourceRow), 201);
  } catch (err) {
    const error = err as Error;
    if (error.message === "Unauthorized") return errorResponse("Unauthorized", 401);
    return errorResponse(error.message || "Internal server error", 500);
  }
}
