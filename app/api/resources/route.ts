import { NextResponse } from "next/server";

// GET /api/resources — Search/filter shared items and skills
export async function GET() {
  // TODO: Parse query params (lat, lng, radius, type: item|skill, tags, search)
  // TODO: Query resources with location filtering
  // TODO: Return paginated results
  return NextResponse.json(
    { success: false, error: "Not implemented" },
    { status: 501 }
  );
}
