"use client";

import { Star, ShieldCheck, Handshake, Package, Info } from "lucide-react";
import { cn } from "@/lib/utils";
import type { TrustScoreBreakdown } from "@/types";
import {
  Card,
  CardContent,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface TrustScoreProps {
  breakdown: TrustScoreBreakdown;
  className?: string;
  showBreakdown?: boolean;
}

/**
 * Profile: TrustScore — visual trust/reliability score display.
 * Displays score number, star rating, and optionally a detailed breakdown.
 * Cohesive with the HeroAlert blue/gold palette.
 */
export function TrustScore({ breakdown, className, showBreakdown = true }: TrustScoreProps) {
  const stars = Math.round(breakdown.computed_score / 20); // 0–100 -> 0–5

  return (
    <div className={cn("space-y-4", className)}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h3 className="text-sm font-bold uppercase tracking-wider text-foreground">
            Neighbor Trust
          </h3>
          {breakdown.verified_badge && (
            <Badge className="flex items-center gap-1 rounded-lg border-none bg-emerald-500/15 px-2 py-0.5 text-[10px] font-semibold text-emerald-300 hover:bg-emerald-500/20">
              <ShieldCheck size={10} /> Verified
            </Badge>
          )}
        </div>
        <div className="text-3xl font-bold tracking-tight text-amber-500">
          {breakdown.computed_score}
        </div>
      </div>

      {/* Stars */}
      <div className="flex gap-1">
        {Array.from({ length: 5 }).map((_, i) => (
          <Star
            key={i}
            size={18}
            className={cn(
              "transition-all duration-300",
              i < stars ? "text-amber-400 fill-amber-400" : "text-muted-foreground/30 fill-transparent"
            )}
          />
        ))}
      </div>

      {/* Detailed Breakdown */}
      {showBreakdown && (
        <Card className="mt-4 overflow-hidden rounded-lg border border-white/8 bg-zinc-800">
          <CardContent className="p-4 grid grid-cols-2 gap-4">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-primary/10 p-2 text-primary">
                <Package size={16} />
              </div>
              <div>
                <p className="text-xs font-medium uppercase tracking-wider text-zinc-500">Lends</p>
                <p className="text-sm font-bold text-foreground">{breakdown.successful_lends}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-primary/10 p-2 text-primary">
                <Handshake size={16} />
              </div>
              <div>
                <p className="text-xs font-medium uppercase tracking-wider text-zinc-500">Helps</p>
                <p className="text-sm font-bold text-foreground">{breakdown.successful_helps}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {!showBreakdown && (
        <p className="text-[10px] font-medium text-muted-foreground italic flex items-center gap-1.5">
          <Info size={10} /> Based on community activity and feedback
        </p>
      )}
    </div>
  );
}
