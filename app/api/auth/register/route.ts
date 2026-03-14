import { NextResponse } from "next/server";

// POST /api/auth/register
export async function POST() {
  // TODO: Validate registration fields (email, password, display name)
  // TODO: Create user with Supabase Auth
  // TODO: Create profile row in profiles table
  // TODO: Return session
  return NextResponse.json(
    { success: false, error: "Not implemented" },
    { status: 501 }
  );
}
