"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { PulseFeed } from "@/components/feed/PulseFeed";
import { PulseForm } from "@/components/feed/PulseForm";
import { PulseFilter } from "@/components/feed/PulseFilter";
import { WeatherAlert } from "@/components/feed/WeatherAlert";
import { useLocation } from "@/hooks/use-location";
import { useTranslations } from "next-intl";

export default function FeedPage() {
  const t = useTranslations("PulseFeed");
  const searchParams = useSearchParams();
  const [filterType, setFilterType] = useState<string>("all");
  const [filterUrgency, setFilterUrgency] = useState<string>("all");
  const [filterRadius, setFilterRadius] = useState<number>(50);
  const [showForm, setShowForm] = useState(() => searchParams.get("compose") === "true");

  const { latitude, longitude } = useLocation();
  const userLocation = latitude && longitude ? { lat: latitude, lng: longitude } : null;

  return (
    <div className="space-y-6">
      <div className="flex items-end justify-between mb-8">
        <div>
          <p className="text-[10px] font-black uppercase tracking-[0.3em] text-primary mb-2">
            {t("subtitle")}
          </p>
          <h1 className="text-5xl font-black tracking-tighter leading-none">
            {t("title")}
          </h1>
        </div>
      </div>

      <WeatherAlert />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="space-y-3">
            <Button
              onClick={() => setShowForm(!showForm)}
              className="w-full h-12 rounded-xl font-bold text-sm"
              variant={showForm ? "secondary" : "default"}
            >
              {showForm ? "✕ Cancel" : "+ Share a Pulse with your neighbors"}
            </Button>
            {showForm && <PulseForm onSuccess={() => setShowForm(false)} />}
          </div>
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
