import { NextResponse } from "next/server";

// GET /api/pets/[petId]
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ petId: string }> }
) {
  const { petId } = await params;
  // TODO: Fetch pet report by ID
  return NextResponse.json(
    { success: false, error: `Pet ${petId} not implemented` },
    { status: 501 }
  );
}

// PATCH /api/pets/[petId]
export async function PATCH(
  _request: Request,
  { params }: { params: Promise<{ petId: string }> }
) {
  const { petId } = await params;
  // TODO: Update pet report (e.g., mark as resolved)
  return NextResponse.json(
    { success: false, error: `Pet ${petId} update not implemented` },
    { status: 501 }
  );
}

// DELETE /api/pets/[petId]
export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ petId: string }> }
) {
  const { petId } = await params;
  // TODO: Delete pet report
  return NextResponse.json(
    { success: false, error: `Pet ${petId} delete not implemented` },
    { status: 501 }
  );
}
