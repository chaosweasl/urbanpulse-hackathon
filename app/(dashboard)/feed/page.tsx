"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { PulseForm } from "@/components/feed/PulseForm";
import { PulseCard, type Pulse } from "@/components/feed/PulseCard";
import { WeatherAlert } from "@/components/feed/WeatherAlert";
import { useLocation } from "@/hooks/use-location";
import { useRealtime } from "@/hooks/use-realtime";
import { useTranslations } from "next-intl";
import { Flame, Compass, Clock3, PlusCircle, RefreshCcw, Sparkles, AlertTriangle } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { cn } from "@/lib/utils";

type FeedPulse = Pulse & {
  is_pinned?: boolean;
};

interface PulseApiItem {
  id: string;
  author_id: string;
  category: string;
  urgency: "low" | "medium" | "high" | "critical";
  description: string;
  created_at: string;
  photo_url?: string | null;
  is_pinned?: boolean;
  has_confirmed?: boolean;
  distance_meters?: number;
  location?: { lat?: number; lng?: number } | null;
  lat?: number;
  lng?: number;
  author?: {
    username?: string;
    avatar_url?: string | null;
    is_verified_neighbor?: boolean;
  };
}

function PulseCarouselRow({
  title,
  subtitle,
  icon,
  pulses,
  currentUserId,
  onDelete,
}: {
  title: string;
  subtitle: string;
  icon: React.ReactNode;
  pulses: Pulse[];
  currentUserId?: string;
  onDelete: (pulseId: string) => void;
}) {
  const t = useTranslations("PulseFeed");

  return (
    <section className="space-y-3 animate-reveal-up">
      <div className="flex items-end justify-between gap-3">
        <div>
          <p className="text-xs font-medium uppercase tracking-wider text-zinc-400">{subtitle}</p>
          <h2 className="mt-1 flex items-center gap-2 text-2xl font-bold tracking-tight text-foreground">
            <span className="text-primary">{icon}</span>
            {title}
          </h2>
        </div>
        <span className="text-xs text-zinc-500">
          {t("liveCount", { count: pulses.length })}
        </span>
      </div>

      {pulses.length === 0 ? (
        <div className="rounded-lg border border-white/8 bg-zinc-900 px-6 py-7 text-sm text-muted-foreground">
          {t("rowEmpty")}
        </div>
      ) : (
        <div className="w-full">
          <div className="relative md:hidden">
            <div className="pointer-events-none absolute bottom-0 left-0 top-0 z-10 w-7 bg-gradient-to-r from-background to-transparent md:hidden" />
            <div className="pointer-events-none absolute bottom-0 right-0 top-0 z-10 w-7 bg-gradient-to-l from-background to-transparent md:hidden" />

            <div className="hide-scrollbar flex snap-x snap-mandatory gap-4 overflow-x-auto pb-2">
              {pulses.map((pulse) => (
                <div key={pulse.id} className="w-[82vw] max-w-[360px] shrink-0 snap-start md:w-[340px]">
                  <PulseCard
                    pulse={pulse}
                    currentUserId={currentUserId}
                    onDelete={onDelete}
                  />
                </div>
              ))}
            </div>
          </div>

          <p className="mt-2 text-xs font-medium uppercase tracking-wider text-zinc-500 md:hidden">
            {t("swipeHint")}
          </p>

          <div className="hidden grid-cols-2 gap-4 md:grid xl:grid-cols-3">
            {pulses.slice(0, 6).map((pulse) => (
              <PulseCard
                key={pulse.id}
                pulse={pulse}
                currentUserId={currentUserId}
                onDelete={onDelete}
              />
            ))}
          </div>
        </div>
      )}
    </section>
  );
}

export default function FeedPage() {
  const t = useTranslations("PulseFeed");
  const { user } = useAuth();
  const searchParams = useSearchParams();
  const [showForm, setShowForm] = useState(() => searchParams.get("compose") === "true");
  const [pulses, setPulses] = useState<FeedPulse[]>([]);
  const [loading, setLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const { latitude, longitude } = useLocation();
  const userLocation = useMemo(
    () => (latitude !== null && longitude !== null ? { lat: latitude, lng: longitude } : null),
    [latitude, longitude]
  );

  const fetchPulses = useCallback(async (manualRefresh = false) => {
    if (manualRefresh) {
      setIsRefreshing(true);
    } else {
      setLoading(true);
    }

    try {
      const params = new URLSearchParams({
        status: "active",
        page: "1",
        per_page: "36",
      });

      if (userLocation) {
        params.set("lat", String(userLocation.lat));
        params.set("lng", String(userLocation.lng));
        params.set("radius", "5000");
      }

      const response = await fetch(`/api/pulses?${params.toString()}`);
      const data = await response.json();

      if (!data.success) {
        console.error("Failed to fetch pulses:", data.error || "Unknown API error");
        setPulses([]);
        return;
      }

      const mapped = ((data.data || []) as PulseApiItem[]).map((item) => ({
        id: item.id,
        author_id: item.author_id,
        type: item.category,
        urgency: item.urgency,
        message: item.description,
        author: item.author?.username || "Neighbor",
        avatar_url: item.author?.avatar_url || undefined,
        is_verified_neighbor: item.author?.is_verified_neighbor || false,
        created_at: item.created_at,
        distance: typeof item.distance_meters === "number" ? Math.round(item.distance_meters) : undefined,
        lat: item.location?.lat ?? item.lat,
        lng: item.location?.lng ?? item.lng,
        photo_url: item.photo_url,
        is_pinned: item.is_pinned || false,
        has_confirmed: item.has_confirmed || false,
      }));

      setPulses(mapped);
      setLastUpdated(new Date());
    } catch (error) {
      console.error("Failed to fetch feed rows:", error);
      setPulses([]);
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  }, [userLocation]);

  useEffect(() => {
    fetchPulses();
  }, [fetchPulses]);

  useRealtime<PulseApiItem>("pulses", "INSERT", () => {
    void fetchPulses();
  });

  useRealtime<PulseApiItem>("pulses", "UPDATE", () => {
    void fetchPulses();
  });

  useRealtime<PulseApiItem>("pulses", "DELETE", () => {
    void fetchPulses();
  });

  const pinnedPulses = useMemo(
    () => [...pulses].filter((pulse) => pulse.is_pinned).sort((a, b) => +new Date(b.created_at) - +new Date(a.created_at)).slice(0, 10),
    [pulses]
  );

  const nonPinnedPulses = useMemo(
    () => pulses.filter((pulse) => !pulse.is_pinned),
    [pulses]
  );

  const highlightedPulses = useMemo(
    () => nonPinnedPulses.filter((pulse) => pulse.urgency === "high" || pulse.urgency === "critical").slice(0, 10),
    [nonPinnedPulses]
  );

  const nearbyPulses = useMemo(() => {
    const withDistance = nonPinnedPulses.filter((pulse) => pulse.distance !== undefined);
    return (withDistance.length > 0 ? withDistance : nonPinnedPulses).slice(0, 10);
  }, [nonPinnedPulses]);

  const latestPulses = useMemo(
    () => [...nonPinnedPulses].sort((a, b) => +new Date(b.created_at) - +new Date(a.created_at)).slice(0, 10),
    [nonPinnedPulses]
  );

  const handleDelete = (pulseId: string) => {
    setPulses((prev) => prev.filter((pulse) => pulse.id !== pulseId));
  };

  return (
    <div className="space-y-8 pb-10">
      <section className="relative overflow-hidden rounded-lg border border-white/8 bg-zinc-900 px-6 py-8 md:px-10 animate-reveal-up">
        <div className="relative z-10 max-w-3xl space-y-5">
          <div>
            <div className="mb-2 flex flex-wrap items-center gap-2">
              <p className="text-xs uppercase tracking-widest text-zinc-500">
                {t("subtitle")}
              </p>
              <span className="inline-flex items-center gap-1 text-[10px] font-medium uppercase tracking-widest text-primary">
                <Sparkles className="h-3 w-3" />
                {t("curatedTag")}
              </span>
            </div>

            <h1 className="text-4xl font-bold leading-none tracking-tight md:text-6xl">
              {t("title")}
            </h1>
            <p className="mt-4 max-w-xl text-sm text-muted-foreground md:text-base">
              {t("deckDescription")}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Button
              onClick={() => setShowForm((prev) => !prev)}
              className="h-11 rounded-full px-6 text-sm font-bold"
              variant={showForm ? "secondary" : "default"}
            >
              <PlusCircle className="mr-2 h-4 w-4" />
              {showForm ? t("hideComposer") : t("sharePulse")}
            </Button>

            <Button
              onClick={() => fetchPulses(true)}
              variant="outline"
              className="h-11 rounded-full px-5 text-sm font-bold"
              disabled={isRefreshing}
            >
              <RefreshCcw className={cn("mr-2 h-4 w-4", isRefreshing && "animate-spin")} />
              {t("refresh")}
            </Button>
          </div>

          {lastUpdated && (
            <p className="text-xs font-medium uppercase tracking-wider text-zinc-500">
              {t("updatedAt", { time: lastUpdated.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) })}
            </p>
          )}
        </div>
      </section>

      {showForm && <PulseForm onSuccess={() => {
        setShowForm(false);
        void fetchPulses(true);
      }} />}

      <WeatherAlert />

      {loading ? (
        <div className="space-y-3">
          <p className="text-sm font-medium text-muted-foreground">{t("loadingRows")}</p>
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {[...Array(3)].map((_, index) => (
              <div key={index} className="h-80 rounded-lg border border-white/8 bg-zinc-900 animate-pulse" />
            ))}
          </div>
        </div>
      ) : (
        <div className="space-y-8">
          {pinnedPulses.length > 0 && (
            <PulseCarouselRow
              title={t("safetyCheckinTitle")}
              subtitle={t("safetyCheckinSubtitle")}
              icon={<AlertTriangle className="h-5 w-5" />}
              pulses={pinnedPulses}
              currentUserId={user?.id}
              onDelete={handleDelete}
            />
          )}

          <PulseCarouselRow
            title={t("hotNow")}
            subtitle={t("highUrgency")}
            icon={<Flame className="h-5 w-5" />}
            pulses={highlightedPulses}
            currentUserId={user?.id}
            onDelete={handleDelete}
          />

          <PulseCarouselRow
            title={t("nearYou")}
            subtitle={t("localRadius")}
            icon={<Compass className="h-5 w-5" />}
            pulses={nearbyPulses}
            currentUserId={user?.id}
            onDelete={handleDelete}
          />

          <PulseCarouselRow
            title={t("latestDrops")}
            subtitle={t("mostRecent")}
            icon={<Clock3 className="h-5 w-5" />}
            pulses={latestPulses}
            currentUserId={user?.id}
            onDelete={handleDelete}
          />
        </div>
      )}
    </div>
  );
}
