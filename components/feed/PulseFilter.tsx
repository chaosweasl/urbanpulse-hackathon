"use client";

import { useMemo } from "react";
import { isWithinRadius } from "@/lib/geo";
import { Pulse } from "./PulseCard";

// Feed: PulseFilter — filter feed by type, urgency, radius

interface PulseFilterProps {
  filterType: string;
  setFilterType: (type: string) => void;
  filterUrgency: string;
  setFilterUrgency: (urgency: string) => void;
  filterRadius: number;
  setFilterRadius: (radius: number) => void;
  userLocation: { lat: number; lng: number } | null;
}

export function PulseFilter({
  filterType,
  setFilterType,
  filterUrgency,
  setFilterUrgency,
  filterRadius,
  setFilterRadius,
  userLocation,
}: PulseFilterProps) {
  return (
    <div className="flex flex-col h-full">
      {/* Filter Options Menu */}
      <div className="bg-card p-4 rounded-2xl shadow-sm space-y-4 border border-border">
        <div className="flex flex-col gap-4">
          <div className="flex-1">
            <label className="block text-xs font-semibold text-muted-foreground mb-1 uppercase tracking-wider">Type</label>
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="w-full bg-input/30 border border-input text-foreground text-sm rounded-4xl focus:ring-ring focus:border-ring block p-2 outline-none appearance-none"
            >
              <option value="all">All Types</option>
              <option value="emergency">Emergency</option>
              <option value="skill">Skill</option>
              <option value="item">Item</option>
            </select>
          </div>

          <div className="flex-1">
            <label className="block text-xs font-semibold text-muted-foreground mb-1 uppercase tracking-wider">Urgency</label>
            <select
              value={filterUrgency}
              onChange={(e) => setFilterUrgency(e.target.value)}
              className="w-full bg-input/30 border border-input text-foreground text-sm rounded-4xl focus:ring-ring focus:border-ring block p-2 outline-none appearance-none"
            >
              <option value="all">Any Urgency</option>
              <option value="critical">Critical</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
          </div>
        </div>

        <div>
          <div className="flex justify-between items-center mb-1">
            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Radius</label>
            <span className="text-xs font-medium text-primary bg-primary/10 px-2 py-0.5 rounded-full">
              {filterRadius >= 50 ? "Any distance" : `Within ${filterRadius} km`}
            </span>
          </div>
          <input
            type="range"
            min="1"
            max="50"
            value={filterRadius}
            onChange={(e) => setFilterRadius(parseInt(e.target.value))}
            className="w-full h-2 bg-input/30 rounded-lg appearance-none cursor-pointer accent-primary"
            disabled={!userLocation}
          />
          {!userLocation && (
            <p className="text-xs text-destructive mt-1 flex items-center gap-1">
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>
              Location access needed for radius filtering
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

export function usePulseFiltering(pulses: Pulse[], filterType: string, filterUrgency: string, filterRadius: number, userLocation: {lat: number, lng: number} | null) {
  return useMemo(() => {
    return pulses.filter((pulse) => {
      // 1. Filter by type
      if (filterType !== "all" && pulse.type !== filterType) return false;

      // 2. Filter by urgency
      if (filterUrgency !== "all" && pulse.urgency !== filterUrgency) return false;

      // 3. Filter by radius
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
}
