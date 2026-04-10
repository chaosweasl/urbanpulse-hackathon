import { createClient } from "@/utils/supabase/server";
import { requireAuth, parsePagination, errorResponse, successResponse, paginatedResponse } from "@/lib/api-helpers";

type ConversationRow = {
  id: string;
  [key: string]: unknown;
};

type MessageRow = {
  id: string;
  conversation_id: string;
  content: string;
  created_at: string;
  sender_id: string;
};

type ConversationMemberRow = {
  conversation_id: string;
  user_id: string;
  last_read_at: string | null;
};

type ProfileRow = {
  id: string;
  username: string;
  full_name: string | null;
  avatar_url: string | null;
};

// GET /api/conversations — List conversations for the current user
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const { page, perPage } = parsePagination(searchParams);

    const supabase = await createClient();
    const user = await requireAuth(supabase);

    // Get membership rows for the current user.
    const { data: myMembershipRows, error: membersError } = await supabase
      .from("conversation_members")
      .select("conversation_id, last_read_at")
      .eq("user_id", user.id);

    if (membersError) {
      return errorResponse(membersError.message, 500);
    }

    if (!myMembershipRows || myMembershipRows.length === 0) {
      return paginatedResponse([], 0, page, perPage);
    }

    const conversationIds = myMembershipRows.map((membership) => membership.conversation_id);

    // Fetch paginated conversations.
    let query = supabase
      .from("conversations")
      .select("*", { count: 'exact' })
      .in("id", conversationIds)
      .order("updated_at", { ascending: false });

    const from = (page - 1) * perPage;
    const to = from + perPage - 1;
    query = query.range(from, to);

    const { data: conversations, error, count } = await query;

    if (error) {
      return errorResponse(error.message, 500);
    }

    const typedConversations = (conversations || []) as ConversationRow[];
    const pageConversationIds = typedConversations
      .map((conversation) => conversation.id)
      .filter((id): id is string => typeof id === "string");

    let latestByConversation = new Map<string, MessageRow>();
    let membersByConversation = new Map<string, ConversationMemberRow[]>();

    if (pageConversationIds.length > 0) {
      const { data: memberRows, error: memberRowsError } = await supabase
        .from("conversation_members")
        .select("conversation_id, user_id, last_read_at")
        .in("conversation_id", pageConversationIds);

      if (memberRowsError) {
        return errorResponse(memberRowsError.message, 500);
      }

      const typedMemberRows = (memberRows || []) as ConversationMemberRow[];

      const { data: latestMessages, error: latestMessagesError } = await supabase
        .from("messages")
        .select("id, conversation_id, content, created_at, sender_id")
        .in("conversation_id", pageConversationIds)
        .order("created_at", { ascending: false });

      if (latestMessagesError) {
        return errorResponse(latestMessagesError.message, 500);
      }

      for (const message of (latestMessages || []) as MessageRow[]) {
        if (!latestByConversation.has(message.conversation_id)) {
          latestByConversation.set(message.conversation_id, message);
        }
      }

      const memberUserIds = [...new Set(typedMemberRows.map((member) => member.user_id))];
      let profileById = new Map<string, ProfileRow>();

      if (memberUserIds.length > 0) {
        // Profile lookup can fail due stricter RLS in some setups; fallback to null profile payloads.
        const { data: profiles, error: profilesError } = await supabase
          .from("profiles")
          .select("id, username, full_name, avatar_url")
          .in("id", memberUserIds);

        if (!profilesError) {
          profileById = new Map((profiles || []).map((profile) => [profile.id, profile as ProfileRow]));
        }
      }

      membersByConversation = typedMemberRows.reduce((map, member) => {
        const existing = map.get(member.conversation_id) || [];
        existing.push(member);
        map.set(member.conversation_id, existing);
        return map;
      }, new Map<string, ConversationMemberRow[]>());

      const formattedConversations = typedConversations.map((conversation) => {
        const membersForConversation = membersByConversation.get(conversation.id) || [];
        const enrichedMembers = membersForConversation.map((member) => ({
          user_id: member.user_id,
          last_read_at: member.last_read_at,
          profiles: profileById.get(member.user_id) || null,
        }));

        return {
          ...conversation,
          conversation_members: enrichedMembers,
          latest_message: latestByConversation.get(conversation.id) || null,
        };
      });

      return paginatedResponse(formattedConversations, count || 0, page, perPage);
    }

    return paginatedResponse([], count || 0, page, perPage);
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
