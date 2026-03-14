import { NextResponse } from "next/server";

// GET /api/pulses — List pulses (with location/type/urgency filters)
export async function GET() {
  // TODO: Parse query params (lat, lng, radius, type, urgency)
  // TODO: Query Supabase with PostGIS ST_DWithin for radius filtering
  // TODO: Return paginated pulses
  return NextResponse.json(
    { success: false, error: "Not implemented" },
    { status: 501 }
  );
}

// POST /api/pulses — Create a new pulse
export async function POST() {
  // TODO: Validate body (title, description, type, urgency, location)
  // TODO: Insert into pulses table
  // TODO: Trigger smart matching if type is "need"
  // TODO: Return created pulse
  return NextResponse.json(
    { success: false, error: "Not implemented" },
    { status: 501 }
  );
}
