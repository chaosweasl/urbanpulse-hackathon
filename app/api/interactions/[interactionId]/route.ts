import { createClient } from "@/utils/supabase/server";
import { requireAuth, errorResponse, successResponse } from "@/lib/api-helpers";
import { updateInteractionSchema } from "@/lib/validators";

// GET /api/interactions/[interactionId]
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ interactionId: string }> }
) {
  try {
    const { interactionId } = await params;
    const supabase = await createClient();
    const user = await requireAuth(supabase);

    const { data: interaction, error } = await supabase
      .from("interactions")
      .select(`
        *,
        resource:resources(*),
        requester:profiles!requester_id(id, username, full_name, avatar_url, trust_score),
        provider:profiles!provider_id(id, username, full_name, avatar_url, trust_score)
      `)
      .eq("id", interactionId)
      .single();

    if (error || !interaction) {
      return errorResponse("Interaction not found", 404);
    }

    // Only parties can view
    if (interaction.requester_id !== user.id && interaction.provider_id !== user.id) {
       return errorResponse("Forbidden", 403);
    }

    return successResponse(interaction);
  } catch (err) {
    const error = err as Error;
    if (error.message === "Unauthorized") return errorResponse("Unauthorized", 401);
    return errorResponse(error.message || "Internal server error", 500);
  }
}

// PATCH /api/interactions/[interactionId]
export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ interactionId: string }> }
) {
  try {
    const { interactionId } = await params;
    const supabase = await createClient();
    const user = await requireAuth(supabase);

    const body = await request.json();
    const result = updateInteractionSchema.safeParse(body);

    if (!result.success) {
      return errorResponse(result.error.errors[0].message, 400);
    }

    const updates = result.data;

    const { data: interaction, error: fetchError } = await supabase
      .from("interactions")
      .select("requester_id, provider_id, status, resource_id")
      .eq("id", interactionId)
      .single();

    if (fetchError || !interaction) {
      return errorResponse("Interaction not found", 404);
    }

    if (interaction.requester_id !== user.id && interaction.provider_id !== user.id) {
       return errorResponse("Forbidden", 403);
    }

    const isProvider = interaction.provider_id === user.id;

    // Validate state transitions
    if (updates.status) {
       if (isProvider) {
         if (!['accepted', 'declined', 'completed'].includes(updates.status)) {
            return errorResponse("Invalid status update for provider", 400);
         }
       } else {
         if (!['cancelled', 'completed'].includes(updates.status)) {
            return errorResponse("Invalid status update for requester", 400);
         }
       }
    }

    const dbUpdates: Record<string, unknown> = {
      ...updates,
      updated_at: new Date().toISOString()
    };

    if (updates.status === 'completed') {
      dbUpdates.completed_at = new Date().toISOString();
    }

    const { data: updatedInteraction, error: updateError } = await supabase
      .from("interactions")
      .update(dbUpdates)
      .eq("id", interactionId)
      .select()
      .single();

    if (updateError) {
      return errorResponse(updateError.message, 400);
    }

    // Update resource status automatically if accepted/completed
    if (updates.status === 'accepted') {
      await supabase.from("resources").update({ status: 'lent_out' }).eq("id", interaction.resource_id);
    } else if (updates.status === 'completed' || updates.status === 'declined' || updates.status === 'cancelled') {
       // Assuming it's back available. Note: interactions might overlap, this is a simplified flow
      await supabase.from("resources").update({ status: 'available' }).eq("id", interaction.resource_id);
    }

    // Send notifications
    const targetUserId = isProvider ? interaction.requester_id : interaction.provider_id;
    let notificationTitle = "Interaction Update";
    let notificationBody = `Your interaction status was updated.`;

    if (updates.status === 'accepted') {
       notificationTitle = "Request Accepted";
       notificationBody = `Your request was accepted!`;
    } else if (updates.status === 'completed') {
       notificationTitle = "Interaction Completed";
       notificationBody = `Your interaction was completed. Please leave a rating!`;
    } else if (updates.status === 'declined') {
       notificationTitle = "Request Declined";
       notificationBody = `Your request was declined.`;
    }

    if (updates.status) {
      await supabase.rpc("create_notification", {
        _user_id: targetUserId,
        _type: "system",
        _title: notificationTitle,
        _body: notificationBody,
        _action_url: `/interactions/${interactionId}`,
        _metadata: { interaction_id: interactionId }
      });
    }

    return successResponse(updatedInteraction);
  } catch (err) {
    const error = err as Error;
    if (error.message === "Unauthorized") return errorResponse("Unauthorized", 401);
    return errorResponse(error.message || "Internal server error", 500);
  }
}
