import { NextResponse } from "next/server";

// POST /api/auth/logout
export async function POST() {
  // TODO: Sign out with Supabase Auth
  // TODO: Clear session cookies
  return NextResponse.json(
    { success: false, error: "Not implemented" },
    { status: 501 }
  );
}
