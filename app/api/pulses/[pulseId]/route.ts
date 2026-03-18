import { NextResponse } from "next/server";

// GET /api/pulses/[pulseId] — Get a single pulse
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ pulseId: string }> }
) {
  const { pulseId } = await params;
  // TODO: Fetch pulse by ID from Supabase
  return NextResponse.json(
    { success: false, error: `Pulse ${pulseId} not implemented` },
    { status: 501 }
  );
}

// PATCH /api/pulses/[pulseId] — Update a pulse
export async function PATCH(
  _request: Request,
  { params }: { params: Promise<{ pulseId: string }> }
) {
<<<<<<< Updated upstream
  const { pulseId } = await params;
  // TODO: Validate body, update pulse in Supabase
  return NextResponse.json(
    { success: false, error: `Pulse ${pulseId} update not implemented` },
    { status: 501 }
  );
=======
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

    const isAuthor = pulse.author_id === user.id;
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

    const { lat, lng, photo_url, ...updates } = result.data;
    const dbUpdates: Record<string, unknown> = {
      ...updates,
      photo_url,
      updated_at: new Date().toISOString(),
    };

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
  } catch (err) {
    const error = err as Error;
    if (error.message === "Unauthorized")
      return errorResponse("Unauthorized", 401);
    return errorResponse(error.message || "Internal server error", 500);
  }
>>>>>>> Stashed changes
}

// DELETE /api/pulses/[pulseId] — Delete a pulse
export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ pulseId: string }> }
) {
  const { pulseId } = await params;
  // TODO: Soft-delete or hard-delete pulse
  return NextResponse.json(
    { success: false, error: `Pulse ${pulseId} delete not implemented` },
    { status: 501 }
  );
}
