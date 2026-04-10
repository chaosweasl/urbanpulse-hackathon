"use client";

import { useMemo } from "react";
import { isWithinRadius } from "@/lib/geo";
import { Pulse } from "./PulseCard";
import { useTranslations } from "next-intl";
import { Select } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";

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
  const t = useTranslations("PulseFilter");
  const tc = useTranslations("Categories");
  const tu = useTranslations("Urgency");
  const activeFilterCount = (filterType !== "all" ? 1 : 0) + (filterUrgency !== "all" ? 1 : 0) + (filterRadius < 50 ? 1 : 0);

  return (
    <div className="flex flex-col h-full">
      {/* Filter Options Menu */}
      <div className="bg-card p-4 rounded-2xl shadow-sm space-y-4 border border-border">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <p className="text-xs font-black uppercase tracking-[0.24em] text-foreground">Filters</p>
            {activeFilterCount > 0 && (
              <Badge className="rounded-full bg-primary px-2 py-0.5 text-[10px] font-black text-primary-foreground">
                {activeFilterCount}
              </Badge>
            )}
          </div>
          {activeFilterCount > 0 && (
            <button
              type="button"
              onClick={() => {
                setFilterType("all");
                setFilterUrgency("all");
                setFilterRadius(50);
              }}
              className="text-xs font-bold text-primary hover:underline"
            >
              Clear all
            </button>
          )}
        </div>

        <div className="flex flex-col gap-4">
          <div className="flex-1">
            <label className="block text-xs font-semibold text-muted-foreground mb-1 uppercase tracking-wider">{t("type")}</label>
            <Select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="w-full rounded-2xl border-border bg-card text-foreground text-sm focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50"
            >
              <option value="all">{t("allTypes")}</option>
              <option value="emergency">{tc("emergency")}</option>
              <option value="skill">{tc("skill")}</option>
              <option value="item">{tc("item")}</option>
            </Select>
          </div>

          <div className="flex-1">
            <label className="block text-xs font-semibold text-muted-foreground mb-1 uppercase tracking-wider">{t("urgency")}</label>
            <Select
              value={filterUrgency}
              onChange={(e) => setFilterUrgency(e.target.value)}
              className="w-full rounded-2xl border-border bg-card text-foreground text-sm focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50"
            >
              <option value="all">{t("anyUrgency")}</option>
              <option value="critical">{tu("critical")}</option>
              <option value="high">{tu("high")}</option>
              <option value="medium">{tu("medium")}</option>
              <option value="low">{tu("low")}</option>
            </Select>
          </div>
        </div>

        <div>
          <div className="flex justify-between items-center mb-1">
            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">{t("radius")}</label>
            <span className="text-xs font-medium text-primary bg-primary/10 px-2 py-0.5 rounded-full">
              {filterRadius >= 50 ? t("anyDistance") : t("within", { radius: filterRadius })}
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
              {t("locationError")}
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
