import { createClient } from "@/utils/supabase/server";
import { requireAuth, errorResponse, successResponse, parsePagination, paginatedResponse } from "@/lib/api-helpers";
import { sendMessageSchema } from "@/lib/validators";

// GET /api/messages — List conversations
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const { page, perPage } = parsePagination(searchParams);

    const supabase = await createClient();
    const user = await requireAuth(supabase);

    // Get conversations where user is a member
    let query = supabase
      .from("conversation_members")
      .select(`
        conversation_id,
        last_read_at,
        conversations (
          id,
          created_at,
          updated_at,
          pulse_id,
          resource_id,
          messages (
            id,
            content,
            created_at,
            sender_id
          )
        )
      `, { count: 'exact' })
      .eq("user_id", user.id);

    const from = (page - 1) * perPage;
    const to = from + perPage - 1;
    query = query.range(from, to).order('last_read_at', { ascending: false });

    const { data: members, error, count } = await query;
    if (error) {
      return errorResponse(error.message, 500);
    }

    return paginatedResponse(members || [], count || 0, page, perPage);
  } catch (err) {
    const error = err as Error;
    if (error.message === "Unauthorized") return errorResponse("Unauthorized", 401);
    return errorResponse(error.message || "Internal server error", 500);
  }
}

// POST /api/messages — Start a new conversation or send a message
export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const user = await requireAuth(supabase);

    const body = await request.json();
    const result = sendMessageSchema.safeParse(body);

    if (!result.success) {
      return errorResponse(result.error.issues[0].message, 400);
    }

    const { content, recipient_id } = result.data;

    if (!recipient_id) {
       return errorResponse("recipient_id is required to start a new conversation", 400);
    }

    // 1. Create conversation
    const { data: conversation, error: convError } = await supabase
      .from("conversations")
      .insert({})
      .select()
      .single();

    if (convError || !conversation) {
      return errorResponse(convError?.message || "Failed to create conversation", 500);
    }

    // 2. Add members
    const members = [
      { conversation_id: conversation.id, user_id: user.id },
      { conversation_id: conversation.id, user_id: recipient_id }
    ];

    const { error: memberError } = await supabase
      .from("conversation_members")
      .insert(members);

    if (memberError) {
      return errorResponse(memberError.message, 500);
    }

    // 3. Insert message
    const { data: message, error: msgError } = await supabase
      .from("messages")
      .insert({
        conversation_id: conversation.id,
        sender_id: user.id,
        content
      })
      .select()
      .single();

    if (msgError) {
      return errorResponse(msgError.message, 500);
    }

    // Update conversation timestamp
    await supabase.from("conversations").update({ updated_at: new Date().toISOString() }).eq("id", conversation.id);

    // Send notification to recipient
    await supabase.rpc("create_notification", {
      _user_id: recipient_id,
      _type: "message",
      _title: "New Message",
      _body: "You have a new message.",
      _action_url: `/messages/${conversation.id}`,
      _metadata: { conversation_id: conversation.id }
    });

    return successResponse({ conversation, message }, 201);
  } catch (err) {
    const error = err as Error;
    if (error.message === "Unauthorized") return errorResponse("Unauthorized", 401);
    return errorResponse(error.message || "Internal server error", 500);
  }
}
