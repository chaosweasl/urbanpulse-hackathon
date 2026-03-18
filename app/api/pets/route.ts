import { NextResponse } from "next/server";

// GET /api/pets — List lost/found pet reports
export async function GET() {
  // TODO: Parse query params (type: lost/found, species, location)
  // TODO: Query pet reports
  return NextResponse.json(
    { success: false, error: "Not implemented" },
    { status: 501 }
  );
}

// POST /api/pets — Report a lost or found pet
export async function POST() {
  // TODO: Validate body (type, species, description, photo, location)
  // TODO: Insert pet report
  // TODO: If "found", trigger AI matching against "lost" database
  return NextResponse.json(
    { success: false, error: "Not implemented" },
    { status: 501 }
  );
}
