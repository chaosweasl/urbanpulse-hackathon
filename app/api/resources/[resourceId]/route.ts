import { createClient } from "@/utils/supabase/server";
import { requireAuth, errorResponse, successResponse } from "@/lib/api-helpers";
import { updateResourceSchema } from "@/lib/validators";

// GET /api/resources/[resourceId] — Get a single resource
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ resourceId: string }> }
) {
  try {
    const { resourceId } = await params;
    const supabase = await createClient();

    const { data: resource, error } = await supabase
      .from("resources")
      .select(`
        *,
        owner:profiles(id, username, full_name, avatar_url, trust_score, is_verified_neighbor)
      `)
      .eq("id", resourceId)
      .single();

    if (error || !resource) {
      return errorResponse("Resource not found", 404);
    }

    return successResponse(resource);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Internal server error";
    return errorResponse(message, 500);
  }
}

// PATCH /api/resources/[resourceId] — Update a resource (owner only)
export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ resourceId: string }> }
) {
  try {
    const { resourceId } = await params;
    const supabase = await createClient();
    const user = await requireAuth(supabase);

    // Verify ownership
    const { data: existing } = await supabase
      .from("resources")
      .select("owner_id")
      .eq("id", resourceId)
      .single();

    if (!existing) {
      return errorResponse("Resource not found", 404);
    }
    if (existing.owner_id !== user.id) {
      return errorResponse("Forbidden", 403);
    }

    const body = await request.json();
    const result = updateResourceSchema.safeParse(body);

    if (!result.success) {
      return errorResponse(result.error.issues[0].message, 400);
    }

    const { lat, lng, ...updateData } = result.data;

    const dbData: Record<string, unknown> = { ...updateData };
    if (lat !== undefined && lng !== undefined) {
      dbData.location = `POINT(${lng} ${lat})`;
    }

    const { data: resource, error } = await supabase
      .from("resources")
      .update(dbData)
      .eq("id", resourceId)
      .select()
      .single();

    if (error) {
      return errorResponse(error.message, 400);
    }

    return successResponse(resource);
  } catch (error: unknown) {
    if (error instanceof Error && error.message === "Unauthorized") {
      return errorResponse("Unauthorized", 401);
    }
    const message = error instanceof Error ? error.message : "Internal server error";
    return errorResponse(message, 500);
  }
}

// DELETE /api/resources/[resourceId] — Soft-delete a resource (owner only)
export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ resourceId: string }> }
) {
  try {
    const { resourceId } = await params;
    const supabase = await createClient();
    const user = await requireAuth(supabase);

    // Verify ownership
    const { data: existing } = await supabase
      .from("resources")
      .select("owner_id")
      .eq("id", resourceId)
      .single();

    if (!existing) {
      return errorResponse("Resource not found", 404);
    }
    if (existing.owner_id !== user.id) {
      return errorResponse("Forbidden", 403);
    }

    const { error } = await supabase
      .from("resources")
      .update({ status: "unavailable" })
      .eq("id", resourceId);

    if (error) {
      return errorResponse(error.message, 500);
    }

    return successResponse({ message: "Resource deleted" });
  } catch (error: unknown) {
    if (error instanceof Error && error.message === "Unauthorized") {
      return errorResponse("Unauthorized", 401);
    }
    const message = error instanceof Error ? error.message : "Internal server error";
    return errorResponse(message, 500);
  }
}
