import { NextResponse } from "next/server";

// GET /api/moderation — List flagged content (admin only)
export async function GET() {
  // TODO: Verify admin role
  // TODO: Fetch flagged/reported content
  return NextResponse.json(
    { success: false, error: "Not implemented" },
    { status: 501 }
  );
}
