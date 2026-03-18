import { NextResponse } from "next/server";

// PATCH /api/moderation/[reportId] — Resolve a report
export async function PATCH(
  _request: Request,
  { params }: { params: Promise<{ reportId: string }> }
) {
  const { reportId } = await params;
  // TODO: Verify admin role (use is_admin() check)
  // TODO: Update report status (reviewed, dismissed) + resolution_note
  return NextResponse.json(
    { success: false, error: `Report ${reportId} resolve not implemented` },
    { status: 501 }
  );
}

// DELETE /api/moderation/[reportId] — Dismiss a report
export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ reportId: string }> }
) {
  const { reportId } = await params;
  // TODO: Verify admin role
  // TODO: Dismiss report
  return NextResponse.json(
    { success: false, error: `Report ${reportId} dismiss not implemented` },
    { status: 501 }
  );
}
