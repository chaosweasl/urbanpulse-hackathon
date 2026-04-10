"use client";

import React, { useState, useEffect, useCallback, useRef, useMemo } from "react";
import { createClient } from "@/utils/supabase/client";
import { useRealtime } from "@/hooks/use-realtime";
import { PulseCard, type Pulse as PulseCardProps } from "./PulseCard";
import { usePulseFiltering } from "./PulseFilter";
import { useLocation } from "@/hooks/use-location";
import { useAuth } from "@/hooks/use-auth";
import type { PulseWithAuthor, Pulse as DbPulse, Profile } from "@/types";
import { useTranslations } from "next-intl";

const PAGE_SIZE = 10;


function PulseCardSkeleton() {
  return (
    <div className="glass rounded-3xl border border-border/50 p-5 space-y-3 animate-pulse">
      <div className="flex items-center gap-3">
        <div className="h-10 w-10 rounded-full bg-muted/50" />
        <div className="flex-1 space-y-2">
          <div className="h-3 w-24 rounded bg-muted/50" />
          <div className="h-2 w-16 rounded bg-muted/30" />
        </div>
        <div className="h-5 w-16 rounded-lg bg-muted/50" />
      </div>
      <div className="space-y-2">
        <div className="h-3 w-full rounded bg-muted/30" />
        <div className="h-3 w-3/4 rounded bg-muted/30" />
      </div>
    </div>
  );
}

// Helper to map DB urgency to UI urgency
const mapUrgency = (urgency: DbPulse["urgency"]): PulseCardProps["urgency"] => {
  return urgency;
};

interface PulseFeedProps {
  filterType?: string;
  filterUrgency?: string;
  filterRadius?: number;
}

// Feed: PulseFeed — real-time scrollable list of pulses
export function PulseFeed({
  filterType = "all",
  filterUrgency = "all",
  filterRadius = 50
}: PulseFeedProps) {
  const [pulses, setPulses] = useState<PulseWithAuthor[]>([]);
  const [loading, setLoading] = useState(false);
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [hasMore, setHasMore] = useState(true);
  const loadingRef = useRef(false);
  const sentinelRef = useRef<HTMLDivElement | null>(null);
  const { user } = useAuth();

  const { latitude, longitude } = useLocation();
  const userLocation = latitude && longitude ? { lat: latitude, lng: longitude } : null;

  const supabase = useMemo(() => createClient(), []);

  const buildPulseUrl = useCallback((page: number) => {
    const searchParams = new URLSearchParams({
      page: String(page),
      per_page: String(PAGE_SIZE),
      status: "active",
    });

    if (userLocation) {
      searchParams.set("lat", String(userLocation.lat));
      searchParams.set("lng", String(userLocation.lng));
      searchParams.set("radius", "5000");
    }

    return `/api/pulses?${searchParams.toString()}`;
  }, [userLocation]);

  interface PulseFeedResponse {
    success: boolean;
    data?: PulseWithAuthor[];
    error?: string;
  }

  const loadPulsePage = useCallback(async (page: number, replace: boolean) => {
    const response = await fetch(buildPulseUrl(page));
    const data = await response.json() as PulseFeedResponse;

    if (!data.success) {
      throw new Error(data.error || "Failed to fetch pulses");
    }

    const nextPulses = data.data || [];
    setPulses((prev) => (replace ? nextPulses : [...prev, ...nextPulses]));
    setHasMore(nextPulses.length === PAGE_SIZE);
    hasMoreRef.current = nextPulses.length === PAGE_SIZE;
  }, [buildPulseUrl]);

  // Ref to track pulses length safely for pagination
  const pulsesCountRef = useRef(0);
  useEffect(() => {
    pulsesCountRef.current = pulses.length;
  }, [pulses]);

  const hasMoreRef = useRef(hasMore);
  useEffect(() => {
    hasMoreRef.current = hasMore;
  }, [hasMore]);

  const fetchItems = useCallback(async () => {
    if (loadingRef.current || !hasMoreRef.current) return;

    loadingRef.current = true;
    setLoading(true);

    try {
      const nextPage = Math.floor(pulsesCountRef.current / PAGE_SIZE) + 1;
      await loadPulsePage(nextPage, false);
    } catch (error) {
      console.error("Error fetching pulses:", error);
    } finally {
      setLoading(false);
      loadingRef.current = false;
    }
  }, [loadPulsePage]);

  useEffect(() => {
    async function initialLoad() {
      loadingRef.current = true;
      setLoading(true);
      setIsInitialLoading(true);
      setPulses([]);
      setHasMore(true);
      hasMoreRef.current = true;

      try {
        await loadPulsePage(1, true);
      } catch (error) {
        console.error("Error fetching pulses:", error);
      }

      setLoading(false);
      setIsInitialLoading(false);
      loadingRef.current = false;
    }

    initialLoad();
  }, [loadPulsePage]);

  // Set up Realtime subscription for live updates

  const handleNewPulse = useCallback(async (newPulse: DbPulse) => {
    const { data: authorData, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", newPulse.author_id)
      .single();

    if (!error && authorData) {
      const enrichedPulse: PulseWithAuthor = {
        ...newPulse,
        author: authorData as Profile,
      };
      setPulses((prev) => [enrichedPulse, ...prev]);
    }
  }, [supabase]);

  useRealtime<DbPulse>("pulses", "INSERT", handleNewPulse);


  // Infinite scroll logic
  useEffect(() => {
    const currentSentinel = sentinelRef.current;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMoreRef.current && !loadingRef.current) {
          fetchItems();
        }
      },
      { threshold: 1.0 }
    );

    if (currentSentinel) {
      observer.observe(currentSentinel);
    }

    return () => {
      if (currentSentinel) {
        observer.unobserve(currentSentinel);
      }
    };
  }, [fetchItems]);

  // Map to UI pulses for filtering
  const uiPulses = pulses.map((p) => {
    const pulseWithCoords = p as PulseWithAuthor & { lat?: number; lng?: number };

    return {
      id: p.id,
      author_id: p.author_id,
      type: p.category,
      urgency: mapUrgency(p.urgency),
      message: p.description,
      author: p.author.username,
      avatar_url: p.author.avatar_url ?? undefined,
      is_verified_neighbor: p.author.is_verified_neighbor,
      created_at: p.created_at,
      lat: p.location?.lat ?? pulseWithCoords.lat,
      lng: p.location?.lng ?? pulseWithCoords.lng,
    };
  });

  const filteredPulses = usePulseFiltering(uiPulses, filterType, filterUrgency, filterRadius, userLocation);
  const t = useTranslations("PulseFeed");

  return (
    <div className="flex flex-col w-full max-w-2xl mx-auto p-4">
      <div className="flex flex-col gap-4">
        {isInitialLoading ? [...Array(5)].map((_, i) => <PulseCardSkeleton key={i} />) : filteredPulses.map((pulse) => (
          <PulseCard
            key={pulse.id}
            pulse={pulse}
            currentUserId={user?.id}
            onDelete={(pulseId) => setPulses((prev) => prev.filter((item) => item.id !== pulseId))}
          />
        ))}
      </div>

      {loading && (
        <div className="flex justify-center p-8 text-muted-foreground">
          {t("loading")}
        </div>
      )}

      {filteredPulses.length === 0 && !isInitialLoading && !loading && (
        <div className="text-center py-10 bg-muted/30 rounded-2xl border border-dashed border-border">
          <p className="text-muted-foreground text-sm">{t("noPulses")}</p>
        </div>
      )}

      {/* Sentinel element for infinite scrolling */}
      <div ref={sentinelRef} className="h-4" />
    </div>
  );
}
