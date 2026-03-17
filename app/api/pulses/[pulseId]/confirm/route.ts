import { createClient } from "@/utils/supabase/server";
import { requireAuth, errorResponse, successResponse } from "@/lib/api-helpers";

// POST /api/pulses/[pulseId]/confirm — Upvote / confirm a pulse
export async function POST(
  request: Request,
  { params }: { params: Promise<{ pulseId: string }> },
) {
  try {
    const { pulseId } = await params;
    const supabase = await createClient();
    const user = await requireAuth(supabase);

    // Insert confirmation
    // If user already confirmed, unique constraint (pulse_id, user_id) will throw error
    const { data: confirmation, error } = await supabase
      .from("pulse_confirmations")
      .insert({
        pulse_id: pulseId,
        user_id: user.id,
      })
      .select()
      .single();

    if (error) {
      if (error.code === '23505') { // Unique violation
        return errorResponse("You have already confirmed this pulse", 400);
      }
      return errorResponse(error.message, 400);
    }

    return successResponse(confirmation, 201);
  } catch (err) {
    const error = err as Error;
    if (error.message === "Unauthorized") return errorResponse("Unauthorized", 401);
    return errorResponse(error.message || "Internal server error", 500);
  }
}
