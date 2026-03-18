import { NextResponse } from "next/server";

// GET /api/notifications — Get user's notifications
export async function GET() {
  // TODO: Get authenticated user
  // TODO: Fetch notifications (hero alerts, system alerts, responses)
  // TODO: Return with read/unread status
  return NextResponse.json(
    { success: false, error: "Not implemented" },
    { status: 501 }
  );
}

// PATCH /api/notifications — Mark notifications as read
export async function PATCH() {
  // TODO: Accept notification IDs to mark read
  // TODO: Update read status
  return NextResponse.json(
    { success: false, error: "Not implemented" },
    { status: 501 }
  );
}
