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
<<<<<<< Updated upstream
export async function POST() {
  // TODO: Validate body (title, description, category, urgency, location)
  // TODO: Insert into pulses table
  // TODO: Trigger smart matching for nearby users with matching skill_tags
  // TODO: Return created pulse
  return NextResponse.json(
    { success: false, error: "Not implemented" },
    { status: 501 }
  );
=======
export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const user = await requireAuth(supabase);

    const body = await request.json();
    const result = createPulseSchema.safeParse(body);

    if (!result.success) {
      return errorResponse(result.error.errors[0].message, 400);
    }

    const { lat, lng, photo_url, ...pulseData } = result.data;

    const { data: pulse, error } = await supabase
      .from("pulses")
      .insert({
        ...pulseData,
        photo_url,
        author_id: user.id,
        location: `POINT(${lng} ${lat})`
      })
      .select()
      .single();

    if (error) {
      return errorResponse(error.message, 400);
    }

    return successResponse(pulse, 201);
  } catch (err) {
    const error = err as Error;
    if (error.message === "Unauthorized") return errorResponse("Unauthorized", 401);
    return errorResponse(error.message || "Internal server error", 500);
  }
>>>>>>> Stashed changes
}
