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
          <h3 className="text-sm font-black text-foreground uppercase tracking-widest">
            Neighbor Trust
          </h3>
          {breakdown.verified_badge && (
            <Badge className="bg-green-100 text-green-700 hover:bg-green-200 border-none px-2 py-0.5 rounded-lg text-[10px] font-bold flex items-center gap-1">
              <ShieldCheck size={10} /> Verified
            </Badge>
          )}
        </div>
        <div className="text-3xl font-black text-amber-500 tracking-tighter">
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
        <Card className="bg-muted/20 border-border/50 shadow-sm rounded-2xl overflow-hidden mt-4">
          <CardContent className="p-4 grid grid-cols-2 gap-4">
            <div className="flex items-center gap-3">
              <div className="bg-primary/10 p-2 rounded-xl text-primary">
                <Package size={16} />
              </div>
              <div>
                <p className="text-[10px] font-black text-muted-foreground uppercase tracking-tighter">Lends</p>
                <p className="text-sm font-bold text-foreground">{breakdown.successful_lends}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="bg-primary/10 p-2 rounded-xl text-primary">
                <Handshake size={16} />
              </div>
              <div>
                <p className="text-[10px] font-black text-muted-foreground uppercase tracking-tighter">Helps</p>
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
