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
  const { pulseId } = await params;
  // TODO: Validate body, update pulse in Supabase
  return NextResponse.json(
    { success: false, error: `Pulse ${pulseId} update not implemented` },
    { status: 501 }
  );
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
