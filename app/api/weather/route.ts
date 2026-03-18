import { NextResponse } from "next/server";

// GET /api/weather — Proxy to OpenWeatherMap API
export async function GET() {
  // TODO: Accept lat/lng query params
  // TODO: Call OpenWeatherMap API with server-side API key
  // TODO: Check for severe weather alerts
  // TODO: Return weather data + alert status
  return NextResponse.json(
    { success: false, error: "Not implemented" },
    { status: 501 }
  );
}
