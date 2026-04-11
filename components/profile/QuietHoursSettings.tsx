"use client";

import { useState } from "react";
import { Moon, Bell, BellOff, MapPin, Loader2, Save, Info, ShieldAlert } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { Profile } from "@/types";
import { Switch } from "@/components/ui/switch";
import { useTranslations } from "next-intl";

interface QuietHoursSettingsProps {
  profile: Profile;
  onSave?: (updates: Partial<Profile>) => Promise<void>;
}

/**
 * Profile: QuietHoursSettings — notification preference controls.
 * Features time range picker for quiet hours, max distance slider, and availability toggle.
 * Cohesive with the HeroAlert blue/gold palette and neighbor suite design.
 */
export function QuietHoursSettings({ profile, onSave }: QuietHoursSettingsProps) {
  const t = useTranslations("Profile");
  const [isAvailable, setIsAvailable] = useState(profile.is_available);
  const [quietHoursStart, setQuietHoursStart] = useState(profile.quiet_hours_start || "22:00");
  const [quietHoursEnd, setQuietHoursEnd] = useState(profile.quiet_hours_end || "07:00");
  const [radiusKm, setRadiusKm] = useState(profile.neighborhood_radius_km || 5);
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      if (onSave) {
        await onSave({
          is_available: isAvailable,
          quiet_hours_start: quietHoursStart,
          quiet_hours_end: quietHoursEnd,
          neighborhood_radius_km: radiusKm,
        });
      }
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Card className="mx-auto w-full max-w-md overflow-hidden rounded-lg border border-white/8 bg-zinc-900">
      <CardHeader className="border-b border-white/8 bg-zinc-800 py-6">
        <div className="flex items-center gap-3">
          <div className="rounded-lg bg-primary/20 p-2.5">
            <Moon className="text-primary h-5 w-5" />
          </div>
          <CardTitle className="text-xl font-bold tracking-tight text-foreground">
            {t("quietHoursTitle")}
          </CardTitle>
        </div>
      </CardHeader>

      <CardContent className="p-6 space-y-8">
        {/* Hero Alert Info */}
        <div className="flex items-start gap-3 rounded-lg border border-primary/20 bg-primary/10 p-4">
          <ShieldAlert className="text-primary h-5 w-5 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <h4 className="text-sm font-bold text-foreground">{t("heroAlertImpact")}</h4>
            <p className="text-xs text-muted-foreground leading-relaxed">
              {t("heroAlertImpactSubtitle")}
            </p>
          </div>
        </div>

        {/* Availability Toggle */}
        <div className="flex items-center justify-between rounded-lg border border-white/8 bg-zinc-800 p-4 transition-colors hover:bg-zinc-700/60">
          <div className="flex items-center gap-3">
            <div className={cn(
              "p-2 rounded-lg transition-colors",
              isAvailable ? "bg-emerald-500/20 text-emerald-500" : "bg-rose-500/20 text-rose-500"
            )}>
              {isAvailable ? <Bell size={18} /> : <BellOff size={18} />}
            </div>
            <div>
              <Label className="text-foreground font-bold text-sm block cursor-pointer">
                {t("availableForAlerts")}
              </Label>
              <p className="mt-0.5 text-xs font-medium uppercase tracking-wider text-zinc-500">
                {isAvailable ? t("liveAndReady") : t("doNotDisturb")}
              </p>
            </div>
          </div>
          <Switch
            checked={isAvailable}
            onCheckedChange={setIsAvailable}
          />
        </div>

        {/* Time Range */}
        <div className="space-y-4">
          <Label className="px-1 text-xs font-medium uppercase tracking-wider text-zinc-500">
            {t("quietPeriod")}
          </Label>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label htmlFor="start-time" className="text-xs font-bold text-foreground px-1">{t("starts")}</Label>
              <Input
                id="start-time"
                type="time"
                value={quietHoursStart}
                onChange={(e) => setQuietHoursStart(e.target.value)}
                className="rounded-lg border border-white/10 bg-zinc-900 font-medium text-foreground focus:ring-0 focus:border-primary/50"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="end-time" className="text-xs font-bold text-foreground px-1">{t("ends")}</Label>
              <Input
                id="end-time"
                type="time"
                value={quietHoursEnd}
                onChange={(e) => setQuietHoursEnd(e.target.value)}
                className="rounded-lg border border-white/10 bg-zinc-900 font-medium text-foreground focus:ring-0 focus:border-primary/50"
              />
            </div>
          </div>
        </div>

        {/* Neighborhood Radius */}
        <div className="space-y-6">
          <div className="flex justify-between items-end px-1">
            <div className="space-y-1">
              <Label className="text-xs font-medium uppercase tracking-wider text-zinc-500">
                {t("alertRadius")}
              </Label>
              <p className="text-[10px] text-muted-foreground/50 font-medium">{t("radiusSubtitle")}</p>
            </div>
            <Badge variant="default" className="bg-primary hover:bg-primary/90 font-bold text-xs px-2.5 py-0.5 rounded-lg border-none text-primary-foreground">
              {radiusKm} km
            </Badge>
          </div>
          <div className="relative pt-1 px-1">
            <Input
              type="range"
              min={0.5}
              max={20}
              step={0.5}
              value={radiusKm}
              onChange={(e) => setRadiusKm(parseFloat(e.target.value))}
              className="h-2 w-full cursor-pointer appearance-none rounded-lg bg-muted accent-primary"
            />
            <div className="mt-3 flex justify-between px-1 text-xs font-medium uppercase tracking-wider text-zinc-500">
              <div className="flex items-center gap-1"><MapPin size={10} /> {t("local")}</div>
              <div>{t("townWide")}</div>
            </div>
          </div>
        </div>
      </CardContent>

      <CardFooter className="border-t border-white/8 bg-zinc-800 p-6">
        <Button
          onClick={handleSave}
          disabled={isSaving}
          className="h-12 w-full rounded-lg bg-primary font-bold text-primary-foreground transition-all hover:bg-primary/90 active:scale-95 disabled:opacity-50"
        >
          {isSaving ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Save className="mr-2 h-4 w-4" />
          )}
          {isSaving ? t("updatingPreferences") : t("savePreferences")}
        </Button>
      </CardFooter>
    </Card>
  );
}
