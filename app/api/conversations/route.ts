import { createClient } from "@/utils/supabase/server";
import { requireAuth, parsePagination, errorResponse, successResponse, paginatedResponse } from "@/lib/api-helpers";

// GET /api/conversations — List conversations for the current user
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const { page, perPage } = parsePagination(searchParams);

    const supabase = await createClient();
    const user = await requireAuth(supabase);

    // Get conversation IDs where user is a member
    const { data: members, error: membersError } = await supabase
      .from("conversation_members")
      .select("conversation_id")
      .eq("user_id", user.id);

    if (membersError) {
      return errorResponse(membersError.message, 500);
    }

    if (!members || members.length === 0) {
      return paginatedResponse([], 0, page, perPage);
    }

    const conversationIds = members.map(m => m.conversation_id);

    // Fetch those conversations along with members details and latest message
    let query = supabase
      .from("conversations")
      .select(`
        *,
        conversation_members (
          user_id,
          last_read_at,
          profiles (id, username, full_name, avatar_url)
        ),
        messages (
          id,
          content,
          created_at,
          sender_id
        )
      `, { count: 'exact' })
      .in("id", conversationIds)
      .order("updated_at", { ascending: false });

    // In PostgREST, we can limit the nested resource directly to fetch only the latest message:
    // e.g. messages!inner(*).order(created_at.desc).limit(1)
    query = query.order('created_at', { foreignTable: 'messages', ascending: false }).limit(1, { foreignTable: 'messages' });

    const from = (page - 1) * perPage;
    const to = from + perPage - 1;
    query = query.range(from, to);

    const { data: conversations, error, count } = await query;

    if (error) {
      return errorResponse(error.message, 500);
    }

    // Format output to extract the single message that PostgREST returned
    const formattedConversations = conversations?.map(conv => {
       const msgs = conv.messages as Record<string, unknown>[] || [];
       return {
         ...conv,
         latest_message: msgs[0] || null,
         messages: undefined // Remove full messages array from list view
       };
    });

    return paginatedResponse(formattedConversations || [], count || 0, page, perPage);
  } catch (err) {
    const error = err as Error;
    if (error.message === "Unauthorized") return errorResponse("Unauthorized", 401);
    return errorResponse(error.message || "Internal server error", 500);
  }
}

// POST /api/conversations — Create a new conversation (or return existing 1-on-1)
export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const user = await requireAuth(supabase);

    const body = await request.json();
    const { recipient_id, pulse_id, resource_id } = body;

    if (!recipient_id) {
      return errorResponse("recipient_id is required", 400);
    }

    if (recipient_id === user.id) {
      return errorResponse("Cannot start a conversation with yourself", 400);
    }

    // Check if a 1-on-1 conversation already exists between these two users (ignoring pulse/resource for simplicity, or we can enforce separation)
    // Since find_direct_conversation might not exist in schema, let's do it manually:
    // We'll just create a new one every time if pulse_id/resource_id is different,
    // or we can find an existing one manually.

    // For Hackathon scope, creating a new conversation or finding it by manual query:
    const { data: myMemberships } = await supabase
      .from("conversation_members")
      .select("conversation_id")
      .eq("user_id", user.id);

    const { data: theirMemberships } = await supabase
      .from("conversation_members")
      .select("conversation_id")
      .eq("user_id", recipient_id);

    if (myMemberships && theirMemberships) {
       const myConvIds = new Set(myMemberships.map(m => m.conversation_id));
       const sharedConvIds = theirMemberships.filter(m => myConvIds.has(m.conversation_id)).map(m => m.conversation_id);

       if (sharedConvIds.length > 0) {
           // Find one that matches the pulse/resource (or if neither provided, just return the first one)
           let existingConvId = sharedConvIds[0];
           if (pulse_id || resource_id) {
               const { data: specificConv } = await supabase
                 .from("conversations")
                 .select("id")
                 .in("id", sharedConvIds)
                 .eq("pulse_id", pulse_id || null)
                 .eq("resource_id", resource_id || null)
                 .maybeSingle();

               if (specificConv) {
                   existingConvId = specificConv.id;
               } else {
                   existingConvId = null; // Need to create a new one for this specific pulse/resource
               }
           }

           if (existingConvId) {
             const { data: existingConvData } = await supabase
                .from("conversations")
                .select("*")
                .eq("id", existingConvId)
                .single();
             return successResponse(existingConvData, 200);
           }
       }
    }

    // Create conversation
    const { data: conversation, error: convError } = await supabase
      .from("conversations")
      .insert({
         pulse_id: pulse_id || null,
         resource_id: resource_id || null
      })
      .select()
      .single();

    if (convError || !conversation) {
      return errorResponse(convError?.message || "Failed to create conversation", 400);
    }

    // Add members
    const members = [
      { conversation_id: conversation.id, user_id: user.id },
      { conversation_id: conversation.id, user_id: recipient_id }
    ];

    const { error: membersError } = await supabase
      .from("conversation_members")
      .insert(members);

    if (membersError) {
      return errorResponse(membersError.message, 500);
    }

    return successResponse(conversation, 201);
  } catch (err) {
    const error = err as Error;
    if (error.message === "Unauthorized") return errorResponse("Unauthorized", 401);
    return errorResponse(error.message || "Internal server error", 500);
  }
}
