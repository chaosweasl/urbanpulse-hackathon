"use client";

import { useEffect, useState, useMemo } from "react";
import { PulseCard, Pulse } from "./PulseCard";
import { createClient } from "@/utils/supabase/client";
import { isWithinRadius } from "@/lib/geo";

// Feed: PulseFilter — filter feed by type, urgency, radius
// TODO: Dropdowns/toggles for pulse type, urgency level, distance slider

export function PulseFeed() {
  const [pulses, setPulses] = useState<Pulse[]>([]);

  // Filter states
  const [filterType, setFilterType] = useState<string>("all");
  const [filterUrgency, setFilterUrgency] = useState<string>("all");
  const [filterRadius, setFilterRadius] = useState<number>(50); // km
  const [userLocation, setUserLocation] = useState<{lat: number, lng: number} | null>(null);

  // Memoize supabase client to avoid recreating instance on every render
  const supabase = useMemo(() => createClient(), []);

  // Get user location for radius filtering
  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        (error) => console.warn("Location error:", error.message),
        { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 }
      );
    }
  }, []);

  useEffect(() => {
    async function loadPulses() {
      const { data } = await supabase
        .from("pulses")
        .select("*")
        .order("created_at", { ascending: false });

      setPulses(data || []);
    }

    loadPulses();

    const channel = supabase
      .channel("realtime-pulses")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "pulses",
        },
        (payload) => {
          if (payload.eventType === "INSERT") {
            setPulses((prev) => [payload.new as Pulse, ...prev]);
          }

          if (payload.eventType === "UPDATE") {
            setPulses((prev) =>
              prev.map((p) =>
                p.id === payload.new.id ? (payload.new as Pulse) : p
              )
            );
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [supabase]);

  // Apply filters efficiently and memoize to avoid recalculations on every render
  const filteredPulses = useMemo(() => {
    return pulses.filter((pulse) => {
      // 1. Filter by type
      if (filterType !== "all" && pulse.type !== filterType) return false;

      // 2. Filter by urgency
      if (filterUrgency !== "all" && pulse.urgency !== filterUrgency) return false;

      // 3. Filter by radius (if location available and radius not maxed out e.g. 50km = "all")
      if (userLocation && filterRadius < 50) {
        const pulseLat = pulse.lat ?? pulse.latitude;
        const pulseLng = pulse.lng ?? pulse.longitude;

        if (pulseLat !== undefined && pulseLng !== undefined) {
          return isWithinRadius(
            userLocation.lat,
            userLocation.lng,
            pulseLat,
            pulseLng,
            filterRadius * 1000 // convert to meters
          );
        }
      }

      return true;
    });
  }, [pulses, filterType, filterUrgency, filterRadius, userLocation]);

  return (
    <div className="flex flex-col h-full">
      {/* Filter Options Menu */}
      <div className="bg-white p-4 rounded-lg shadow-sm mb-4 space-y-4 border border-blue-300">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <label className="block text-xs font-semibold text-gray-600 mb-1 uppercase tracking-wider">Type</label>
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="w-full bg-gray-50 border border-gray-200 text-gray-700 text-sm rounded-md focus:ring-blue-500 focus:border-blue-500 block p-2"
            >
              <option value="all">All Types</option>
              <option value="alert">Alert</option>
              <option value="event">Event</option>
              <option value="request">Request</option>
              <option value="info">Info</option>
            </select>
          </div>

          <div className="flex-1">
            <label className="block text-xs font-semibold text-gray-600 mb-1 uppercase tracking-wider">Urgency</label>
            <select
              value={filterUrgency}
              onChange={(e) => setFilterUrgency(e.target.value)}
              className="w-full bg-gray-50 border border-gray-200 text-gray-700 text-sm rounded-md focus:ring-blue-500 focus:border-blue-500 block p-2"
            >
              <option value="all">Any Urgency</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
          </div>
        </div>

        <div>
          <div className="flex justify-between items-center mb-1">
            <label className="text-xs font-semibold text-gray-600 uppercase tracking-wider">Radius</label>
            <span className="text-xs font-medium text-blue-600 bg-blue-50 px-2 py-0.5 rounded">
              {filterRadius >= 50 ? "Any distance" : `Within ${filterRadius} km`}
            </span>
          </div>
          <input
            type="range"
            min="1"
            max="50"
            value={filterRadius}
            onChange={(e) => setFilterRadius(parseInt(e.target.value))}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
            disabled={!userLocation}
          />
          {!userLocation && (
            <p className="text-xs text-amber-600 mt-1 flex items-center gap-1">
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>
              Location access needed for radius filtering
            </p>
          )}
        </div>
      </div>

      {/* Feed List */}
      <div className="flex-1 space-y-3 overflow-y-auto">
        {filteredPulses.length === 0 ? (
          <div className="text-center py-10 bg-gray-50 rounded-lg border border-dashed border-gray-200">
            <p className="text-gray-500 text-sm">No pulses found matching your filters.</p>
          </div>
        ) : (
          filteredPulses.map((pulse) => (
            <PulseCard key={pulse.id} pulse={pulse} />
          ))
        )}
      </div>
    </div>
  );
}