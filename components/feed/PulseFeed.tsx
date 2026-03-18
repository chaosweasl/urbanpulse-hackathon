"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import { createClient } from "@/utils/supabase/client";
import { useRealtime } from "@/hooks/use-realtime";
import { PulseCard, type Pulse as PulseCardProps } from "./PulseCard";
import { usePulseFiltering } from "./PulseFilter";
import { useLocation } from "@/hooks/use-location";
import type { PulseWithAuthor, Pulse as DbPulse, Profile } from "@/types";

const PAGE_SIZE = 10;

// Helper to map DB urgency to UI urgency
const mapUrgency = (urgency: DbPulse["urgency"]): PulseCardProps["urgency"] => {
  if (urgency === "critical") return "high";
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
  const [hasMore, setHasMore] = useState(true);
  const loadingRef = useRef(false);
  const sentinelRef = useRef<HTMLDivElement | null>(null);

  const { latitude, longitude } = useLocation();
  const userLocation = latitude && longitude ? { lat: latitude, lng: longitude } : null;

  const supabase = createClient();

  // Ref to track pulses length safely for pagination
  const pulsesCountRef = useRef(0);
  useEffect(() => {
    pulsesCountRef.current = pulses.length;
  }, [pulses]);

  const fetchItems = useCallback(async (isInitial = false) => {
    if (loadingRef.current || (!hasMore && !isInitial)) return;

    loadingRef.current = true;
    setLoading(true);

    const start = isInitial ? 0 : pulsesCountRef.current;
    const end = start + PAGE_SIZE - 1;

    try {
      const { data, error } = await supabase
        .from("pulses")
        .select("*, author:profiles(*)")
        .order("created_at", { ascending: false })
        .range(start, end);

      if (error) throw error;

      if (data) {
        setPulses((prev) => (isInitial ? data : [...prev, ...data]));
        setHasMore(data.length === PAGE_SIZE);
      }
    } catch (error) {
      console.error("Error fetching pulses:", error);
    } finally {
      setLoading(false);
      loadingRef.current = false;
    }
  }, [hasMore, supabase]);

  useEffect(() => {
    fetchItems(true);
  }, [fetchItems]);

  // Set up Realtime subscription for live updates
  useRealtime<DbPulse>("pulses", "INSERT", async (newPulse) => {
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
  });

  // Infinite scroll logic
  useEffect(() => {
    const currentSentinel = sentinelRef.current;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !loadingRef.current) {
          fetchItems(false);
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
  }, [fetchItems, hasMore]);

  // Map to UI pulses for filtering
  const uiPulses = pulses.map(p => ({
    id: p.id,
    type: p.category,
    urgency: mapUrgency(p.urgency),
    message: p.description,
    author: p.author.username,
    created_at: p.created_at,
    lat: p.location?.lat,
    lng: p.location?.lng,
  }));

  const filteredPulses = usePulseFiltering(uiPulses, filterType, filterUrgency, filterRadius, userLocation);

  return (
    <div className="flex flex-col w-full max-w-2xl mx-auto p-4">
      <div className="flex flex-col gap-4">
        {filteredPulses.map((pulse) => (
          <PulseCard
            key={pulse.id}
            pulse={pulse}
          />
        ))}
      </div>

      {loading && (
        <div className="flex justify-center p-8 text-muted-foreground">
          Loading pulses...
        </div>
      )}

      {filteredPulses.length === 0 && !loading && (
        <div className="text-center py-10 bg-muted/30 rounded-2xl border border-dashed border-border">
          <p className="text-muted-foreground text-sm">No pulses found matching your filters.</p>
        </div>
      )}

      {/* Sentinel element for infinite scrolling */}
      <div ref={sentinelRef} className="h-4" />
    </div>
  );
}
