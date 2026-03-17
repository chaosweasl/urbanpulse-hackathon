import { createClient } from "@/utils/supabase/server";
import { requireAuth, parsePagination, errorResponse, successResponse, paginatedResponse } from "@/lib/api-helpers";

// GET /api/interactions — List interactions for current user
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const { page, perPage } = parsePagination(searchParams);
    const status = searchParams.get("status");
    const role = searchParams.get("role"); // 'requester' or 'provider'

    const supabase = await createClient();
    const user = await requireAuth(supabase);

    let query = supabase
      .from("interactions")
      .select(`
        *,
        resource:resources(*),
        requester:profiles!requester_id(id, username, full_name, avatar_url, trust_score),
        provider:profiles!provider_id(id, username, full_name, avatar_url, trust_score)
      `, { count: 'exact' });

    if (role === 'requester') {
      query = query.eq('requester_id', user.id);
    } else if (role === 'provider') {
      query = query.eq('provider_id', user.id);
    } else {
      query = query.or(`requester_id.eq.${user.id},provider_id.eq.${user.id}`);
    }

    if (status) {
      query = query.eq("status", status);
    }

    const from = (page - 1) * perPage;
    const to = from + perPage - 1;
    query = query.range(from, to).order("created_at", { ascending: false });

    const { data: interactions, error, count } = await query;

    if (error) {
      return errorResponse(error.message, 500);
    }

    return paginatedResponse(interactions || [], count || 0, page, perPage);
  } catch (err) {
    const error = err as Error;
    if (error.message === "Unauthorized") return errorResponse("Unauthorized", 401);
    return errorResponse(error.message || "Internal server error", 500);
  }
}

// POST /api/interactions — Create a new interaction request
export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const user = await requireAuth(supabase);

    const body = await request.json();
    const { resource_id } = body;

    if (!resource_id) {
      return errorResponse("resource_id is required", 400);
    }

    // Check resource exists and get provider id
    const { data: resource, error: resourceError } = await supabase
      .from("resources")
      .select("owner_id, name, status")
      .eq("id", resource_id)
      .single();

    if (resourceError || !resource) {
      return errorResponse("Resource not found", 404);
    }

    if (resource.owner_id === user.id) {
      return errorResponse("Cannot request your own resource", 400);
    }

    if (resource.status !== 'available') {
      return errorResponse("Resource is not available", 400);
    }

    // Create interaction
    const { data: interaction, error } = await supabase
      .from("interactions")
      .insert({
        resource_id,
        requester_id: user.id,
        provider_id: resource.owner_id,
        status: 'pending'
      })
      .select()
      .single();

    if (error) {
      return errorResponse(error.message, 400);
    }

    // Send notification to provider
    await supabase.rpc("create_notification", {
      _user_id: resource.owner_id,
      _type: "interaction_request",
      _title: "New Request",
      _body: `Someone requested your resource: ${resource.name}`,
      _action_url: `/interactions/${interaction.id}`,
      _metadata: { interaction_id: interaction.id, resource_id }
    });

    return successResponse(interaction, 201);
  } catch (err) {
    const error = err as Error;
    if (error.message === "Unauthorized") return errorResponse("Unauthorized", 401);
    return errorResponse(error.message || "Internal server error", 500);
  }
}
