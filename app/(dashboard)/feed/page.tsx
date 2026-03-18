import { PulseForm } from "@/components/feed/PulseForm";

export default function FeedPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Pulse Feed</h1>
        <p className="text-muted-foreground">Live updates from your neighborhood.</p>
      </div>

      <PulseForm />

      {/* TODO: <WeatherAlert /> pinned at top when severe weather */}
      {/* TODO: <PulseFilter /> for category/urgency/radius filtering */}
      {/* TODO: <PulseFeed /> real-time feed via Supabase Realtime */}
    </div>
  );
}
