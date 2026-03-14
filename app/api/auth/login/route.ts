import { NextResponse } from "next/server";

// POST /api/auth/login
export async function POST() {
  // TODO: Validate email + password
  // TODO: Sign in with Supabase Auth
  // TODO: Return session token
  return NextResponse.json(
    { success: false, error: "Not implemented" },
    { status: 501 }
  );
}
