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

    const { data: pulse, error: pulseError } = await supabase
      .from("pulses")
      .select("id, author_id")
      .eq("id", pulseId)
      .single();

    if (pulseError || !pulse) {
      return errorResponse("Pulse not found", 404);
    }

    if (pulse.author_id === user.id) {
      return errorResponse("Cannot confirm your own pulse", 400);
    }

    // Simplistic optimistic response
    const { error } = await supabase.from("pulse_confirmations").insert({
        pulse_id: pulseId,
        user_id: user.id
    });

    if (error) {
        // if unique constraint error, means they already confirmed
        if (error.code === '23505') {
            return successResponse({ confirmed: true, already_confirmed: true }, 200);
        }
        return errorResponse(error.message, 400);
    }

    const { data: updatedPulse } = await supabase
      .from("pulses")
      .select("confirm_count, is_verified")
      .eq("id", pulseId)
      .maybeSingle();

    return successResponse({
      confirmed: true,
      already_confirmed: false,
      confirm_count: updatedPulse?.confirm_count ?? null,
      is_verified: updatedPulse?.is_verified ?? null,
    }, 201);
  } catch (err) {
    const error = err as Error;
    if (error.message === "Unauthorized") return errorResponse("Unauthorized", 401);
    return errorResponse(error.message, 500);
  }
}
