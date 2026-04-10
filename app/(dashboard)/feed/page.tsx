"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { PulseForm } from "@/components/feed/PulseForm";
import { PulseCard, type Pulse } from "@/components/feed/PulseCard";
import { WeatherAlert } from "@/components/feed/WeatherAlert";
import { useLocation } from "@/hooks/use-location";
import { useTranslations } from "next-intl";
import { Flame, Compass, Clock3, PlusCircle, RefreshCcw, Sparkles } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { cn } from "@/lib/utils";

interface PulseApiItem {
  id: string;
  author_id: string;
  category: string;
  urgency: "low" | "medium" | "high" | "critical";
  description: string;
  created_at: string;
  photo_url?: string | null;
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
  return (
    <section className="space-y-3 animate-reveal-up">
      <div className="flex items-end justify-between gap-3">
        <div>
          <p className="text-[10px] font-black uppercase tracking-[0.24em] text-muted-foreground">{subtitle}</p>
          <h2 className="mt-1 flex items-center gap-2 text-2xl font-black tracking-tight text-foreground">
            <span className="text-primary">{icon}</span>
            {title}
          </h2>
        </div>
        <span className="rounded-full bg-neutral-900 px-3 py-1 text-[10px] font-black uppercase tracking-[0.14em] text-muted-foreground">
          {pulses.length} live
        </span>
      </div>

      {pulses.length === 0 ? (
        <div className="rounded-2xl bg-neutral-900/70 px-6 py-7 text-sm text-muted-foreground">
          No pulses in this row right now.
        </div>
      ) : (
        <div className="-mx-4 md:mx-0">
          <div className="relative">
            <div className="pointer-events-none absolute bottom-0 left-0 top-0 z-10 w-7 bg-gradient-to-r from-background to-transparent md:hidden" />
            <div className="pointer-events-none absolute bottom-0 right-0 top-0 z-10 w-7 bg-gradient-to-l from-background to-transparent md:hidden" />

            <div className="hide-scrollbar flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-2 md:px-0">
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

          <p className="mt-2 px-4 text-[10px] font-bold uppercase tracking-[0.14em] text-muted-foreground md:hidden">
            Swipe to browse
          </p>
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
  const [pulses, setPulses] = useState<Pulse[]>([]);
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
        throw new Error(data.error || "Failed to fetch pulses");
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

  const highlightedPulses = useMemo(
    () => pulses.filter((pulse) => pulse.urgency === "high" || pulse.urgency === "critical").slice(0, 10),
    [pulses]
  );

  const nearbyPulses = useMemo(() => {
    const withDistance = pulses.filter((pulse) => pulse.distance !== undefined);
    return (withDistance.length > 0 ? withDistance : pulses).slice(0, 10);
  }, [pulses]);

  const latestPulses = useMemo(
    () => [...pulses].sort((a, b) => +new Date(b.created_at) - +new Date(a.created_at)).slice(0, 10),
    [pulses]
  );

  const handleDelete = (pulseId: string) => {
    setPulses((prev) => prev.filter((pulse) => pulse.id !== pulseId));
  };

  return (
    <div className="space-y-8 pb-10">
      <section className="relative overflow-hidden rounded-[32px] bg-[radial-gradient(circle_at_20%_20%,hsl(var(--primary)/0.35),transparent_40%),linear-gradient(120deg,#0b0d13,#050506_55%,#101721)] px-6 py-8 md:px-10 animate-reveal-up">
        <div className="absolute -right-6 top-6 h-28 w-28 rounded-full bg-primary/25 blur-3xl md:right-8 md:top-8 md:h-36 md:w-36 animate-drift-slow" />
        <div className="relative z-10 max-w-3xl space-y-5">
          <div>
            <div className="mb-2 flex flex-wrap items-center gap-2">
              <p className="text-[10px] font-black uppercase tracking-[0.3em] text-primary">
                {t("subtitle")}
              </p>
              <span className="inline-flex items-center gap-1 rounded-full bg-white/10 px-2.5 py-1 text-[9px] font-black uppercase tracking-[0.14em] text-white/80">
                <Sparkles className="h-3 w-3" />
                Live curation
              </span>
            </div>

            <h1 className="text-4xl font-black leading-none tracking-tighter md:text-6xl">
              {t("title")}
            </h1>
            <p className="mt-4 max-w-xl text-sm text-muted-foreground md:text-base">
              Discover urgent neighbor requests, nearby opportunities to help, and the latest local activity in a swipe-first feed.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Button
              onClick={() => setShowForm((prev) => !prev)}
              className="h-11 rounded-full px-6 text-sm font-bold"
              variant={showForm ? "secondary" : "default"}
            >
              <PlusCircle className="mr-2 h-4 w-4" />
              {showForm ? "Hide composer" : "Share a pulse"}
            </Button>

            <Button
              onClick={() => fetchPulses(true)}
              variant="outline"
              className="h-11 rounded-full px-5 text-sm font-bold"
              disabled={isRefreshing}
            >
              <RefreshCcw className={cn("mr-2 h-4 w-4", isRefreshing && "animate-spin")} />
              Refresh
            </Button>
          </div>

          {lastUpdated && (
            <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-muted-foreground">
              Updated {lastUpdated.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
            </p>
          )}
        </div>
      </section>

      {showForm && <PulseForm onSuccess={() => setShowForm(false)} />}

      <WeatherAlert />

      {loading ? (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {[...Array(3)].map((_, index) => (
            <div key={index} className="h-80 rounded-3xl bg-neutral-900/70 animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="space-y-8">
          <PulseCarouselRow
            title="Hot Right Now"
            subtitle="High urgency"
            icon={<Flame className="h-5 w-5" />}
            pulses={highlightedPulses}
            currentUserId={user?.id}
            onDelete={handleDelete}
          />

          <PulseCarouselRow
            title="Near You"
            subtitle="Local radius"
            icon={<Compass className="h-5 w-5" />}
            pulses={nearbyPulses}
            currentUserId={user?.id}
            onDelete={handleDelete}
          />

          <PulseCarouselRow
            title="Latest Drops"
            subtitle="Most recent"
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
