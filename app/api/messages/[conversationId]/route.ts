import { createClient } from "@/utils/supabase/server";
import { requireAuth, parsePagination, errorResponse, successResponse, paginatedResponse } from "@/lib/api-helpers";
import { sendMessageSchema } from "@/lib/validators";

// GET /api/messages/[conversationId] — Get messages
export async function GET(
  request: Request,
  { params }: { params: Promise<{ conversationId: string }> }
) {
  try {
    const { conversationId } = await params;
    const { searchParams } = new URL(request.url);
    const { page, perPage } = parsePagination(searchParams);

    const supabase = await createClient();
    const user = await requireAuth(supabase);

    // Check if user is member
    const { data: member, error: memberError } = await supabase
      .from("conversation_members")
      .select("id")
      .eq("conversation_id", conversationId)
      .eq("user_id", user.id)
      .single();

    if (memberError || !member) {
      return errorResponse("Forbidden", 403);
    }

    // Update last_read_at
    await supabase
      .from("conversation_members")
      .update({ last_read_at: new Date().toISOString() })
      .eq("conversation_id", conversationId)
      .eq("user_id", user.id);

    let query = supabase
      .from("messages")
      .select(`
        *,
        sender:profiles(id, username, full_name, avatar_url)
      `, { count: 'exact' })
      .eq("conversation_id", conversationId)
      .order("created_at", { ascending: false });

    const from = (page - 1) * perPage;
    const to = from + perPage - 1;
    query = query.range(from, to);

    const { data: messages, error, count } = await query;
    if (error) {
      return errorResponse(error.message, 500);
    }

    return paginatedResponse(messages || [], count || 0, page, perPage);
  } catch (err) {
    const error = err as Error;
    if (error.message === "Unauthorized") return errorResponse("Unauthorized", 401);
    return errorResponse(error.message || "Internal server error", 500);
  }
}

// POST /api/messages/[conversationId] — Send reply
export async function POST(
  request: Request,
  { params }: { params: Promise<{ conversationId: string }> }
) {
  try {
    const { conversationId } = await params;
    const supabase = await createClient();
    const user = await requireAuth(supabase);

    const body = await request.json();
    const result = sendMessageSchema.safeParse(body);

    if (!result.success) {
      return errorResponse(result.error.issues[0].message, 400);
    }

    const { content } = result.data;

    // Verify membership
    const { data: members, error: memberError } = await supabase
      .from("conversation_members")
      .select("user_id")
      .eq("conversation_id", conversationId);

    if (memberError || !members) {
      return errorResponse("Conversation not found", 404);
    }

    const isMember = members.some(m => m.user_id === user.id);
    if (!isMember) {
      return errorResponse("Forbidden", 403);
    }

    const { data: message, error } = await supabase
      .from("messages")
      .insert({
        conversation_id: conversationId,
        sender_id: user.id,
        content
      })
      .select(`
        *,
        sender:profiles(id, username, full_name, avatar_url)
      `)
      .single();

    if (error) {
      return errorResponse(error.message, 400);
    }

    // Update conversation updated_at
    await supabase
      .from("conversations")
      .update({ updated_at: new Date().toISOString() })
      .eq("id", conversationId);

    // Send notifications to other members
    const otherMembers = members.filter(m => m.user_id !== user.id);
    for (const member of otherMembers) {
      await supabase.rpc("create_notification", {
        _user_id: member.user_id,
        _type: "message",
        _title: "New Message",
        _body: "You have a new reply.",
        _action_url: `/messages/${conversationId}`,
        _metadata: { conversation_id: conversationId, message_id: message.id }
      });
    }

    return successResponse(message, 201);
  } catch (err) {
    const error = err as Error;
    if (error.message === "Unauthorized") return errorResponse("Unauthorized", 401);
    return errorResponse(error.message || "Internal server error", 500);
  }
}
