import { NextResponse } from "next/server";

// GET /api/messages — List user's conversations
export async function GET() {
  // TODO: Get authenticated user
  // TODO: Fetch conversations the user is part of
  // TODO: Return with last message preview
  return NextResponse.json(
    { success: false, error: "Not implemented" },
    { status: 501 }
  );
}

// POST /api/messages — Start a new conversation
export async function POST() {
  // TODO: Validate body (recipient user slug, optional first message)
  // TODO: Create conversation + initial message
  return NextResponse.json(
    { success: false, error: "Not implemented" },
    { status: 501 }
  );
}
