import { PulseFeed } from "@/components/feed/PulseFeed";
import { PulseForm } from "@/components/feed/PulseForm";
import { PulseFilter } from "@/components/feed/PulseFilter";
import { WeatherAlert } from "@/components/feed/WeatherAlert";

export default function FeedPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Pulse Feed</h1>
        <p className="text-muted-foreground"> Live updates from your neighborhood.</p>
      </div>

      <WeatherAlert />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <PulseForm />
          <PulseFeed />
        </div>
        <aside className="space-y-6">
          <PulseFilter />
        </aside>
      </div>
    </div>
  );
}
