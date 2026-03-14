import { NextResponse } from "next/server";

// GET /api/users — Search nearby users
export async function GET() {
  // TODO: Parse query params (lat, lng, radius, skill tags)
  // TODO: Query users with PostGIS proximity
  // TODO: Return user list (public fields only)
  return NextResponse.json(
    { success: false, error: "Not implemented" },
    { status: 501 }
  );
}
