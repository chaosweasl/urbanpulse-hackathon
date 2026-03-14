import { NextResponse } from "next/server";

// GET /api/messages/[conversationId] — Get messages in a conversation
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ conversationId: string }> }
) {
  const { conversationId } = await params;
  // TODO: Verify user is part of this conversation
  // TODO: Fetch messages paginated
  return NextResponse.json(
    { success: false, error: `Conversation ${conversationId} not implemented` },
    { status: 501 }
  );
}

// POST /api/messages/[conversationId] — Send a message
export async function POST(
  _request: Request,
  { params }: { params: Promise<{ conversationId: string }> }
) {
  const { conversationId } = await params;
  // TODO: Validate body (content)
  // TODO: Insert message into conversation
  return NextResponse.json(
    { success: false, error: `Send to ${conversationId} not implemented` },
    { status: 501 }
  );
}
