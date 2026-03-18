import { NextResponse } from "next/server";

// POST /api/auth/register
export async function POST() {
  // TODO: Validate registration fields (email, password, username)
  // TODO: Create user with Supabase Auth (profile row is auto-created by handle_new_user trigger)
  // TODO: Return session
  return NextResponse.json(
    { success: false, error: "Not implemented" },
    { status: 501 }
  );
}
