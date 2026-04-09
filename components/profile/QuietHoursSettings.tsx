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
    <Card className="w-full max-w-md mx-auto bg-card border border-border/50 rounded-2xl overflow-hidden shadow-xl shadow-black/5">
      <CardHeader className="bg-muted/30 border-b border-border/50 py-6">
        <div className="flex items-center gap-3">
          <div className="bg-primary/20 p-2.5 rounded-xl">
            <Moon className="text-primary h-5 w-5" />
          </div>
          <CardTitle className="text-xl font-black text-foreground tracking-tight">
            Quiet Hours & Reach
          </CardTitle>
        </div>
      </CardHeader>

      <CardContent className="p-6 space-y-8">
        {/* Hero Alert Info */}
        <div className="p-4 rounded-xl bg-primary/10 border border-primary/20 flex gap-3 items-start">
          <ShieldAlert className="text-primary h-5 w-5 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <h4 className="text-sm font-bold text-foreground">Hero Alert Impact</h4>
            <p className="text-xs text-muted-foreground leading-relaxed">
              These settings control when and where you&apos;ll receive high-priority <strong>Hero Alerts</strong> to help neighbors in critical need.
            </p>
          </div>
        </div>

        {/* Availability Toggle */}
        <div className="flex items-center justify-between p-4 rounded-xl bg-muted/20 border border-border/20 transition-all hover:bg-muted/30">
          <div className="flex items-center gap-3">
            <div className={cn(
              "p-2 rounded-lg transition-colors",
              isAvailable ? "bg-emerald-500/20 text-emerald-500" : "bg-rose-500/20 text-rose-500"
            )}>
              {isAvailable ? <Bell size={18} /> : <BellOff size={18} />}
            </div>
            <div>
              <Label className="text-foreground font-bold text-sm block cursor-pointer">
                Available for Alerts
              </Label>
              <p className="text-[10px] text-muted-foreground uppercase font-black tracking-widest mt-0.5">
                {isAvailable ? "Live & Ready" : "Do Not Disturb"}
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsAvailable(!isAvailable)}
            className={cn(
              "relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2",
              isAvailable ? "bg-primary" : "bg-muted-foreground/30"
            )}
            role="switch"
            aria-checked={isAvailable}
          >
            <span
              className={cn(
                "pointer-events-none inline-block h-5 w-5 transform rounded-full bg-background shadow ring-0 transition duration-200 ease-in-out",
                isAvailable ? "translate-x-5" : "translate-x-0"
              )}
            />
          </button>
        </div>

        {/* Time Range */}
        <div className="space-y-4">
          <Label className="text-muted-foreground font-black text-[10px] uppercase tracking-[0.2em] px-1">
            Quiet Period
          </Label>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label htmlFor="start-time" className="text-xs font-bold text-foreground px-1">Starts</Label>
              <Input
                id="start-time"
                type="time"
                value={quietHoursStart}
                onChange={(e) => setQuietHoursStart(e.target.value)}
                className="bg-muted/50 border-border/50 rounded-xl focus:ring-primary focus:border-primary font-medium text-foreground"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="end-time" className="text-xs font-bold text-foreground px-1">Ends</Label>
              <Input
                id="end-time"
                type="time"
                value={quietHoursEnd}
                onChange={(e) => setQuietHoursEnd(e.target.value)}
                className="bg-muted/50 border-border/50 rounded-xl focus:ring-primary focus:border-primary font-medium text-foreground"
              />
            </div>
          </div>
        </div>

        {/* Neighborhood Radius */}
        <div className="space-y-6">
          <div className="flex justify-between items-end px-1">
            <div className="space-y-1">
              <Label className="text-muted-foreground font-black text-[10px] uppercase tracking-[0.2em]">
                Alert Radius
              </Label>
              <p className="text-[10px] text-muted-foreground/50 font-medium">How far you&apos;re willing to travel to help</p>
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
            <div className="flex justify-between mt-3 px-1 text-[10px] font-black text-muted-foreground/50 uppercase tracking-tighter">
              <div className="flex items-center gap-1"><MapPin size={10} /> Local</div>
              <div>Town-wide</div>
            </div>
          </div>
        </div>
      </CardContent>

      <CardFooter className="bg-muted/30 border-t border-border/50 p-6">
        <Button
          onClick={handleSave}
          disabled={isSaving}
          className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-bold h-12 rounded-xl transition-all active:scale-95 disabled:opacity-50"
        >
          {isSaving ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Save className="mr-2 h-4 w-4" />
          )}
          {isSaving ? "Updating Preferences..." : "Save Preferences"}
        </Button>
      </CardFooter>
    </Card>
  );
}
