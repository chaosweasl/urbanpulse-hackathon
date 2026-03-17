import { createClient } from "@/utils/supabase/server";
import { requireAuth, errorResponse, successResponse } from "@/lib/api-helpers";
import { updateProfileSchema } from "@/lib/validators";

export async function GET() {
  try {
    const supabase = await createClient();
    const user = await requireAuth(supabase);

    const { data: profile, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .single();

    if (error) {
      return errorResponse("Profile not found", 404);
    }

    return successResponse(profile);
  } catch (err) {
    const error = err as Error;
    if (error.message === "Unauthorized") return errorResponse("Unauthorized", 401);
    return errorResponse(error.message, 500);
  }
}

export async function PATCH(request: Request) {
  try {
    const supabase = await createClient();
    const user = await requireAuth(supabase);

    const body = await request.json();
    const result = updateProfileSchema.safeParse(body);

    if (!result.success) {
      return errorResponse(result.error.errors[0].message, 400);
    }

    const { lat, lng, ...updates } = result.data;

    const dbUpdates: any = { ...updates, updated_at: new Date().toISOString() };

    if (lat !== undefined && lng !== undefined) {
      dbUpdates.location = `POINT(${lng} ${lat})`;
    }

    const { data, error } = await supabase
      .from("profiles")
      .update(dbUpdates)
      .eq("id", user.id)
      .select()
      .single();

    if (error) {
      return errorResponse(error.message, 400);
    }

    return successResponse(data);
  } catch (err) {
    const error = err as Error;
    if (error.message === "Unauthorized") return errorResponse("Unauthorized", 401);
    return errorResponse(error.message, 500);
  }
}
