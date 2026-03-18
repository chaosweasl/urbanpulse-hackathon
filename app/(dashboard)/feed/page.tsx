import { PulseFeed } from "@/components/feed/PulseFeed";

export default function FeedPage() {
  return (
    <div className="flex flex-col gap-4">
      <div>
        <h1 className="text-2xl font-bold">Pulse Feed</h1>
        <p className="text-muted-foreground">Live updates from your neighborhood.</p>
      </div>
      {/* TODO: <WeatherAlert /> pinned at top when severe weather */}
      {/* TODO: <PulseFilter /> for category/urgency/radius filtering */}
      <PulseFeed />
    </div>
  );
}
