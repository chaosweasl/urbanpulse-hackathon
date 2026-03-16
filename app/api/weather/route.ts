import { NextResponse } from "next/server";
import { fetchWeather } from "@/lib/weather";
import { errorResponse, successResponse } from "@/lib/api-helpers";

// GET /api/weather
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const latStr = searchParams.get("lat");
    const lngStr = searchParams.get("lng");

    if (!latStr || !lngStr) {
      return errorResponse("lat and lng parameters are required", 400);
    }

    const lat = parseFloat(latStr);
    const lng = parseFloat(lngStr);

    if (isNaN(lat) || isNaN(lng) || lat < -90 || lat > 90 || lng < -180 || lng > 180) {
      return errorResponse("Invalid coordinates", 400);
    }

    const weatherData = await fetchWeather(lat, lng);

    return successResponse(weatherData);
  } catch (error: any) {
    return errorResponse(error.message || "Internal server error", 500);
  }
}
