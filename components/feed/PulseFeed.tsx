"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import { createClient } from "@/utils/supabase/client";
import { useRealtime } from "@/hooks/use-realtime";
import { PulseCard, type Pulse as PulseCardProps } from "./PulseCard";
import type { PulseWithAuthor, Pulse as DbPulse, Profile } from "@/types";

const PAGE_SIZE = 10;

// Helper to map DB urgency to UI urgency
const mapUrgency = (urgency: DbPulse["urgency"]): PulseCardProps["urgency"] => {
  if (urgency === "critical") return "high";
  return urgency;
};

// Feed: PulseFeed — real-time scrollable list of pulses
export function PulseFeed() {
  const [pulses, setPulses] = useState<PulseWithAuthor[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const loadingRef = useRef(false);
  const sentinelRef = useRef<HTMLDivElement | null>(null);

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

  return (
    <div className="flex flex-col w-full max-w-2xl mx-auto p-4">
      <div className="flex flex-col gap-4">
        {pulses.map((pulse) => (
          <PulseCard
            key={pulse.id}
            pulse={{
              id: pulse.id,
              type: pulse.category,
              urgency: mapUrgency(pulse.urgency),
              message: pulse.description,
              author: pulse.author.username,
              created_at: pulse.created_at,
            }}
          />
        ))}
      </div>

      {loading && (
        <div className="flex justify-center p-8 text-gray-500">
          Loading pulses...
        </div>
      )}

      {/* Sentinel element for infinite scrolling */}
      <div ref={sentinelRef} className="h-4" />
    </div>
  );
}
