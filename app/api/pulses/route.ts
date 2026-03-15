import { NextResponse } from "next/server";

// GET /api/pulses — List pulses (with location/category/urgency filters)
export async function GET() {
  // TODO: Parse query params (lat, lng, radius, category, urgency)
  // TODO: Query Supabase with PostGIS ST_DWithin for radius filtering
  // TODO: Return paginated pulses
  return NextResponse.json(
    { success: false, error: "Not implemented" },
    { status: 501 }
  );
}

// POST /api/pulses — Create a new pulse
export async function POST() {
  // TODO: Validate body (title, description, category, urgency, location)
  // TODO: Insert into pulses table
  // TODO: Trigger smart matching for nearby users with matching skill_tags
  // TODO: Return created pulse
  return NextResponse.json(
    { success: false, error: "Not implemented" },
    { status: 501 }
  );
}
