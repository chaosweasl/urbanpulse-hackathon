export default function FeedPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold">Pulse Feed</h1>
      <p className="text-muted-foreground">Live updates from your neighborhood.</p>
      {/* TODO: <WeatherAlert /> pinned at top when severe weather */}
      {/* TODO: <PulseFilter /> for category/urgency/radius filtering */}
      {/* TODO: <PulseFeed /> real-time feed via Supabase Realtime */}
    </div>
  );
}
