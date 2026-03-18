"use client";

import { useState } from "react";
import { PulseFeed } from "@/components/feed/PulseFeed";
import { PulseForm } from "@/components/feed/PulseForm";
import { PulseFilter } from "@/components/feed/PulseFilter";
import { WeatherAlert } from "@/components/feed/WeatherAlert";
import { useLocation } from "@/hooks/use-location";

export default function FeedPage() {
  const [filterType, setFilterType] = useState<string>("all");
  const [filterUrgency, setFilterUrgency] = useState<string>("all");
  const [filterRadius, setFilterRadius] = useState<number>(50);

  const { latitude, longitude } = useLocation();
  const userLocation = latitude && longitude ? { lat: latitude, lng: longitude } : null;

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
          <PulseFeed
            filterType={filterType}
            filterUrgency={filterUrgency}
            filterRadius={filterRadius}
          />
        </div>
        <aside className="space-y-6">
          <PulseFilter
            filterType={filterType}
            setFilterType={setFilterType}
            filterUrgency={filterUrgency}
            setFilterUrgency={setFilterUrgency}
            filterRadius={filterRadius}
            setFilterRadius={setFilterRadius}
            userLocation={userLocation}
          />
        </aside>
      </div>
    </div>
  );
}
