import { createClient } from "@/utils/supabase/server";
import { requireAuth, errorResponse, successResponse } from "@/lib/api-helpers";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ pulseId: string }> }
) {
  try {
    const { pulseId } = await params;
    const supabase = await createClient();
    const user = await requireAuth(supabase);

    const body = await request.json();
    const { photo_url } = body;

    const { data: pulse, error: fetchError } = await supabase.from("pulses").select("author_id").eq("id", pulseId).single();
    if (fetchError || !pulse) return errorResponse("Pulse not found", 404);
    if (pulse.author_id !== user.id) return errorResponse("Forbidden", 403);

    const { error } = await supabase.from("pulses").update({ photo_url }).eq("id", pulseId);

    if (error) return errorResponse(error.message, 400);
    return successResponse({ photo_url }, 200);
  } catch (err) {
    const error = err as Error;
    if (error.message === "Unauthorized") return errorResponse("Unauthorized", 401);
    return errorResponse(error.message, 500);
  }
}
