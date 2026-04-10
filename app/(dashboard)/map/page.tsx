"use client";

import { useState } from "react";
import { MapContainer } from "@/components/map/MapContainer";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Filter, Map as MapIcon, Info } from "lucide-react";
import { useTranslations } from "next-intl";

export default function MapPage() {
  const t = useTranslations("MapPage");
  const [filters, setFilters] = useState({
    category: "all",
    urgency: "all",
    showResources: true,
    showHeatmap: false,
  });

  const activeFilters = {
    category: filters.category === "all" ? undefined : filters.category,
    urgency: filters.urgency === "all" ? undefined : filters.urgency,
    showResources: filters.showResources,
    showHeatmap: filters.showHeatmap,
  };

  return (
    <div className="flex flex-col gap-8">
      <div className="mb-8">
        <p className="mb-1 text-xs uppercase tracking-widest text-zinc-500">
          {t("liveMap")}
        </p>
        <h1 className="text-3xl font-bold tracking-tight md:text-4xl">{t("radar")}</h1>
        <p className="mt-2 max-w-2xl text-sm font-medium text-muted-foreground md:text-base">
          {t("radarSubtitle")}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-1 space-y-6">
          <Card className="overflow-hidden rounded-lg border border-white/8 bg-zinc-900">
            <CardHeader className="bg-zinc-800 pb-4">
              <div className="flex items-center gap-2 mb-1">
                <Filter size={16} className="text-primary" />
                <CardTitle className="text-xs font-medium uppercase tracking-wider text-zinc-400">{t("filters")}</CardTitle>
              </div>
              <CardDescription className="text-xs font-medium text-muted-foreground">{t("customize")}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6 pt-6">
              <div className="space-y-3">
                <Label htmlFor="category-select" className="text-xs font-medium uppercase tracking-wider text-zinc-500">{t("category")}</Label>
                <Select
                  id="category-select"
                  value={filters.category}
                  onChange={(e) => setFilters({ ...filters, category: e.target.value })}
                  className="rounded-lg border border-white/10 bg-zinc-900 text-sm font-medium"
                >
                  <option value="all">{t("allPulses")}</option>
                  <option value="emergency">{t("emergency")}</option>
                  <option value="skill">{t("skillRequest")}</option>
                  <option value="item">{t("itemRequest")}</option>
                </Select>
              </div>

              <div className="space-y-3">
                <Label htmlFor="urgency-select" className="text-xs font-medium uppercase tracking-wider text-zinc-500">{t("urgency")}</Label>
                <Select
                  id="urgency-select"
                  value={filters.urgency}
                  onChange={(e) => setFilters({ ...filters, urgency: e.target.value })}
                  className="rounded-lg border border-white/10 bg-zinc-900 text-sm font-medium"
                >
                  <option value="all">{t("allLevels")}</option>
                  <option value="low">{t("low")}</option>
                  <option value="medium">{t("medium")}</option>
                  <option value="high">{t("high")}</option>
                  <option value="critical">{t("critical")}</option>
                </Select>
              </div>

              <div className="pt-2 space-y-4">
                <div className="flex items-center justify-between">
                  <Label htmlFor="show-resources" className="text-xs font-medium">{t("showResources")}</Label>
                  <Switch
                    id="show-resources"
                    checked={filters.showResources}
                    onCheckedChange={(v: boolean) => setFilters({ ...filters, showResources: v })}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <Label htmlFor="show-heatmap" className="text-xs font-medium text-primary">{t("heatmap")}</Label>
                  <Switch
                    id="show-heatmap"
                    checked={filters.showHeatmap}
                    onCheckedChange={(v: boolean) => setFilters({ ...filters, showHeatmap: v })}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="overflow-hidden rounded-lg border border-white/8 bg-zinc-900">
            <CardHeader className="bg-zinc-800 pb-4">
               <div className="flex items-center gap-2 mb-1">
                <Info size={16} className="text-primary" />
                <CardTitle className="text-xs font-medium uppercase tracking-wider text-zinc-400">{t("legend")}</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-4 pt-6">
              <div className="flex items-center gap-3">
                <div className="h-3 w-3 rounded-full bg-[#ff4d4d]" />
                <span className="text-[11px] font-bold uppercase tracking-tight">{t("emergency")}</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="h-3 w-3 rounded-full bg-[#00f2ff]" />
                <span className="text-[11px] font-bold uppercase tracking-tight">{t("skillRequest")}</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="h-3 w-3 rounded-full bg-[#00ff88]" />
                <span className="text-[11px] font-bold uppercase tracking-tight">{t("itemRequest")}</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="h-3 w-3 rounded-full bg-sky-500" />
                <span className="text-[11px] font-bold uppercase tracking-tight">{t("skillResource")}</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="h-3 w-3 rounded-full bg-orange-500" />
                <span className="text-[11px] font-bold uppercase tracking-tight">{t("itemResource")}</span>
              </div>
              <div className="pt-2 border-t border-border/30 text-xs font-medium uppercase tracking-wider text-zinc-500">
                {t("sizeNote")}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="min-h-[360px] overflow-hidden rounded-lg border border-white/8 bg-zinc-900 sm:min-h-[460px] lg:col-span-3 lg:min-h-[620px]">
          <MapContainer filters={activeFilters} />
        </div>
      </div>
    </div>
  );
}
