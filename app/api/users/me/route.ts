import { NextResponse } from "next/server";

// GET /api/users/me — Get own profile
export async function GET() {
  // TODO: Get authenticated user from Supabase session
  // TODO: Return full profile with private fields
  return NextResponse.json(
    { success: false, error: "Not implemented" },
    { status: 501 }
  );
}

// PATCH /api/users/me — Update own profile
export async function PATCH() {
  // TODO: Validate body (bio, skill_tags, quiet_hours_start/end, location, neighborhood_radius_km, is_available)
  // TODO: Update profile in Supabase
  return NextResponse.json(
    { success: false, error: "Not implemented" },
    { status: 501 }
  );
}
