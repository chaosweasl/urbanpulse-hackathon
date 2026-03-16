import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import { requireAuth, errorResponse, successResponse } from "@/lib/api-helpers";
import { updatePulseSchema } from "@/lib/validators";

// GET /api/pulses/[pulseId] — Get a single pulse
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ pulseId: string }> }
) {
  try {
    const { pulseId } = await params;
    const supabase = await createClient();

    const { data: pulse, error } = await supabase
      .from("pulses")
      .select(`
        *,
        author:profiles(id, username, full_name, avatar_url, trust_score, is_verified_neighbor)
      `)
      .eq("id", pulseId)
      .single();

    if (error || !pulse) {
      return errorResponse("Pulse not found", 404);
    }

    return successResponse(pulse);
  } catch (error: any) {
    return errorResponse(error.message || "Internal server error", 500);
  }
}

// PATCH /api/pulses/[pulseId] — Update a pulse
export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ pulseId: string }> }
) {
  try {
    const { pulseId } = await params;
    const supabase = await createClient();
    const user = await requireAuth(supabase);

    // Check user is author or admin
    const { data: pulse, error: fetchError } = await supabase
      .from("pulses")
      .select("author_id")
      .eq("id", pulseId)
      .single();

    if (fetchError || !pulse) {
      return errorResponse("Pulse not found", 404);
    }

    let isAuthor = pulse.author_id === user.id;
    let isAdmin = false;

    if (!isAuthor) {
      const { data: profile } = await supabase
        .from("profiles")
        .select("is_admin")
        .eq("id", user.id)
        .single();
      isAdmin = !!profile?.is_admin;
    }

    if (!isAuthor && !isAdmin) {
      return errorResponse("Forbidden", 403);
    }

    const body = await request.json();
    const result = updatePulseSchema.safeParse(body);

    if (!result.success) {
      return errorResponse(result.error.errors[0].message, 400);
    }

    const { lat, lng, ...updates } = result.data;
    const dbUpdates: any = { ...updates, updated_at: new Date().toISOString() };

    if (lat !== undefined && lng !== undefined) {
      dbUpdates.location = `POINT(${lng} ${lat})`;
    }

    const { data: updatedPulse, error } = await supabase
      .from("pulses")
      .update(dbUpdates)
      .eq("id", pulseId)
      .select()
      .single();

    if (error) {
      return errorResponse(error.message, 400);
    }

    return successResponse(updatedPulse);
  } catch (error: any) {
    if (error.message === "Unauthorized") return errorResponse("Unauthorized", 401);
    return errorResponse(error.message || "Internal server error", 500);
  }
}

// DELETE /api/pulses/[pulseId] — Delete a pulse
export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ pulseId: string }> }
) {
  try {
    const { pulseId } = await params;
    const supabase = await createClient();
    const user = await requireAuth(supabase);

    // Check user is author or admin
    const { data: pulse, error: fetchError } = await supabase
      .from("pulses")
      .select("author_id")
      .eq("id", pulseId)
      .single();

    if (fetchError || !pulse) {
      return errorResponse("Pulse not found", 404);
    }

    let isAuthor = pulse.author_id === user.id;
    let isAdmin = false;

    if (!isAuthor) {
      const { data: profile } = await supabase
        .from("profiles")
        .select("is_admin")
        .eq("id", user.id)
        .single();
      isAdmin = !!profile?.is_admin;
    }

    if (!isAuthor && !isAdmin) {
      return errorResponse("Forbidden", 403);
    }

    // Soft delete by updating status
    const { error } = await supabase
      .from("pulses")
      .update({ status: "expired", updated_at: new Date().toISOString() })
      .eq("id", pulseId);

    if (error) {
      return errorResponse(error.message, 400);
    }

    return successResponse({ message: "Pulse deleted" });
  } catch (error: any) {
    if (error.message === "Unauthorized") return errorResponse("Unauthorized", 401);
    return errorResponse(error.message || "Internal server error", 500);
  }
}
