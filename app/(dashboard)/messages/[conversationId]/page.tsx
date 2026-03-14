export default async function ConversationPage({
  params,
}: {
  params: Promise<{ conversationId: string }>;
}) {
  const { conversationId } = await params;

  return (
    <div>
      <h1 className="text-2xl font-bold">Conversation</h1>
      <p className="text-muted-foreground">Conversation ID: {conversationId}</p>
      {/* TODO: <ConversationHeader /> with neighbor info */}
      {/* TODO: <MessageBubble /> list with real-time updates */}
      {/* TODO: <MessageInput /> at bottom */}
    </div>
  );
}
