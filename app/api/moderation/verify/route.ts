import { createClient } from "@/utils/supabase/server";
import { requireAuth, errorResponse, successResponse } from "@/lib/api-helpers";

// POST /api/moderation/verify — Auto-verify content based on upvote threshold
// Note: Based on instructions, the plan is to verify pulses via confirmations
export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const user = await requireAuth(supabase);

    const body = await request.json();
    const pulseId = body.pulseId;

    if (!pulseId) {
      return errorResponse("pulseId is required", 400);
    }

    // Check if pulse exists
    const { data: pulse, error: pulseError } = await supabase
      .from("pulses")
      .select("id, author_id, confirm_count")
      .eq("id", pulseId)
      .single();

    if (pulseError || !pulse) {
      return errorResponse("Pulse not found", 404);
    }

    // Users cannot confirm their own pulse
    if (pulse.author_id === user.id) {
       return errorResponse("Cannot confirm your own pulse", 400);
    }

    // Insert confirmation
    const { error: confirmError } = await supabase
      .from("pulse_confirmations")
      .insert({
        pulse_id: pulseId,
        user_id: user.id
      });

    if (confirmError) {
      // 23505 is unique violation, meaning already confirmed
      if (confirmError.code === "23505") {
         return errorResponse("Already confirmed", 400);
      }
      return errorResponse(confirmError.message, 500);
    }

    // The handle_pulse_confirmation trigger in DB handles the confirm_count update
    // and setting is_verified = true if it crosses VERIFICATION_THRESHOLD.
    // Let's fetch the latest to return
    const { data: updatedPulse, error: fetchError } = await supabase
      .from("pulses")
      .select("confirm_count, is_verified")
      .eq("id", pulseId)
      .single();

    if (fetchError) {
      return errorResponse(fetchError.message, 500);
    }

    return successResponse({
      pulseId,
      confirmed: true,
      confirm_count: updatedPulse.confirm_count,
      is_verified: updatedPulse.is_verified,
    }, 201);
  } catch (err) {
    const error = err as Error;
    if (error.message === "Unauthorized") return errorResponse("Unauthorized", 401);
    return errorResponse(error.message || "Internal server error", 500);
  }
}
