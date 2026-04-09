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
        <p className="text-[10px] font-black uppercase tracking-[0.3em] text-primary mb-3">
          {t("liveMap")}
        </p>
        <h1 className="text-5xl font-black tracking-tighter">{t("radar")}</h1>
        <p className="text-muted-foreground font-medium mt-2">
          {t("radarSubtitle")}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-1 space-y-6">
          <Card className="bg-card border-border/50 rounded-2xl overflow-hidden shadow-xl">
            <CardHeader className="bg-muted/30 pb-4">
              <div className="flex items-center gap-2 mb-1">
                <Filter size={16} className="text-primary" />
                <CardTitle className="text-sm font-black uppercase tracking-widest">{t("filters")}</CardTitle>
              </div>
              <CardDescription className="text-[11px] font-bold text-muted-foreground">{t("customize")}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6 pt-6">
              <div className="space-y-3">
                <Label htmlFor="category-select" className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">{t("category")}</Label>
                <Select
                  id="category-select"
                  value={filters.category}
                  onChange={(e) => setFilters({ ...filters, category: e.target.value })}
                  className="bg-muted/50 border-border/50 rounded-xl font-bold text-sm"
                >
                  <option value="all">{t("allPulses")}</option>
                  <option value="emergency">{t("emergency")}</option>
                  <option value="skill">{t("skillRequest")}</option>
                  <option value="item">{t("itemRequest")}</option>
                </Select>
              </div>

              <div className="space-y-3">
                <Label htmlFor="urgency-select" className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">{t("urgency")}</Label>
                <Select
                  id="urgency-select"
                  value={filters.urgency}
                  onChange={(e) => setFilters({ ...filters, urgency: e.target.value })}
                  className="bg-muted/50 border-border/50 rounded-xl font-bold text-sm"
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
                  <Label htmlFor="show-resources" className="text-xs font-bold">{t("showResources")}</Label>
                  <Switch
                    id="show-resources"
                    checked={filters.showResources}
                    onCheckedChange={(v: boolean) => setFilters({ ...filters, showResources: v })}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <Label htmlFor="show-heatmap" className="text-xs font-bold text-primary">{t("heatmap")}</Label>
                  <Switch
                    id="show-heatmap"
                    checked={filters.showHeatmap}
                    onCheckedChange={(v: boolean) => setFilters({ ...filters, showHeatmap: v })}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card border-border/50 rounded-2xl overflow-hidden shadow-xl">
            <CardHeader className="bg-muted/30 pb-4">
               <div className="flex items-center gap-2 mb-1">
                <Info size={16} className="text-primary" />
                <CardTitle className="text-sm font-black uppercase tracking-widest">{t("legend")}</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-4 pt-6">
              <div className="flex items-center gap-3">
                <div className="h-3 w-3 rounded-full bg-[#ff4d4d] shadow-[0_0_8px_rgba(255,77,77,0.5)]" />
                <span className="text-[11px] font-bold uppercase tracking-tight">{t("emergency")}</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="h-3 w-3 rounded-full bg-[#00f2ff] shadow-[0_0_8px_rgba(0,242,255,0.5)]" />
                <span className="text-[11px] font-bold uppercase tracking-tight">{t("skillRequest")}</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="h-3 w-3 rounded-full bg-[#00ff88] shadow-[0_0_8px_rgba(0,255,136,0.5)]" />
                <span className="text-[11px] font-bold uppercase tracking-tight">{t("itemRequest")}</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="h-3 w-3 rounded-full bg-purple-500 shadow-[0_0_8px_rgba(168,85,247,0.5)]" />
                <span className="text-[11px] font-bold uppercase tracking-tight">{t("skillResource")}</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="h-3 w-3 rounded-full bg-orange-500 shadow-[0_0_8px_rgba(249,115,22,0.5)]" />
                <span className="text-[11px] font-bold uppercase tracking-tight">{t("itemResource")}</span>
              </div>
              <div className="pt-2 border-t border-border/30 text-[9px] font-bold text-muted-foreground uppercase leading-relaxed tracking-wider">
                {t("sizeNote")}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-3 min-h-[600px] rounded-[2.5rem] overflow-hidden border border-border/50 shadow-2xl glass p-1">
          <MapContainer filters={activeFilters} />
        </div>
      </div>
    </div>
  );
}
