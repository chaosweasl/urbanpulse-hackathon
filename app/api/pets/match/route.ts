import { NextResponse } from "next/server";

// POST /api/pets/match — AI similarity matching for pets
export async function POST() {
  // TODO: Accept uploaded photo or petId
  // TODO: Analyze photo for species, color, markings
  // TODO: Compare against opposite-type database (found→lost, lost→found)
  // TODO: Return ranked matches with confidence scores
  return NextResponse.json(
    { success: false, error: "Not implemented" },
    { status: 501 }
  );
}
