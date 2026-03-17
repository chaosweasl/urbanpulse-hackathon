import { createClient } from "@/utils/supabase/server";
import { requireAuth, parsePagination, errorResponse, successResponse, paginatedResponse } from "@/lib/api-helpers";
import { createResourceSchema } from "@/lib/validators";

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

    return paginatedResponse(resources || [], count || 0, page, perPage);
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
      return errorResponse(result.error.errors[0].message, 400);
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
      .select()
      .single();

    if (error) {
      return errorResponse(error.message, 400);
    }

    return successResponse(resource, 201);
  } catch (err) {
    const error = err as Error;
    if (error.message === "Unauthorized") return errorResponse("Unauthorized", 401);
    return errorResponse(error.message || "Internal server error", 500);
  }
}
