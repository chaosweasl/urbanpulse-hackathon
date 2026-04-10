"use client";

import { Package, Wrench, Star, ShieldCheck, ArrowUpRight } from "lucide-react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { Resource } from "@/types";

interface ResourceCardProps {
  resource: Resource & {
    owner: {
      username: string;
      full_name: string | null;
      avatar_url: string | null;
      trust_score: number;
      is_verified_neighbor: boolean;
    };
  };
  onAction?: (id: string) => void;
  className?: string;
}

/**
 * Resources: ResourceCard — display summary for a library item/skill.
 * Updated to align with the "Tidal" dark aesthetic.
 */
export function ResourceCard({ resource, onAction, className }: ResourceCardProps) {
  const isItem = resource.type === "item";

  return (
    <Card
      className={cn(
        "group flex h-full min-h-[380px] flex-col overflow-hidden rounded-[28px] bg-neutral-900/80 p-0 transition-all hover:-translate-y-0.5 hover:shadow-[0_20px_45px_rgba(0,0,0,0.35)]",
        className
      )}
    >
      <div className="grid h-full grid-rows-[4fr_1fr]">
        {/* Header with Type Icon */}
        <div className="relative flex items-center justify-center overflow-hidden bg-gradient-to-br from-neutral-800 via-neutral-900 to-black">
          <div className={cn(
            "rounded-[2rem] p-6 shadow-xl transition-transform duration-500 group-hover:scale-110",
            isItem ? "bg-amber-400/20 text-amber-300" : "bg-primary/20 text-primary"
          )}>
            {isItem ? <Package size={44} /> : <Wrench size={44} />}
          </div>

          <div className="absolute inset-0 bg-[radial-gradient(circle_at_25%_20%,rgba(255,255,255,0.18),transparent_35%)]" />

          {/* Availability Badge */}
          <div className="absolute right-4 top-4">
            <Badge className={cn(
              "rounded-lg border-none px-2.5 py-1 text-[9px] font-black uppercase tracking-widest shadow-sm",
              resource.status === "available" ? "bg-white text-black" : "bg-destructive text-destructive-foreground"
            )}>
              {resource.status === "available" ? "Ready" : "Busy"}
            </Badge>
          </div>

          <div className="absolute bottom-4 left-4 right-4 flex items-center gap-3 text-white">
            <Avatar className="h-8 w-8 bg-white/10 p-0.5">
              <AvatarImage src={resource.owner.avatar_url || ""} />
              <AvatarFallback className="bg-white/20 text-[10px] font-bold text-white">
                {resource.owner.username.slice(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="min-w-0">
              <p className="truncate text-xs font-bold">
                {resource.owner.full_name || resource.owner.username}
              </p>
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1 text-[10px] font-black text-amber-300">
                  <Star size={10} className="fill-amber-300" />
                  {resource.owner.trust_score}
                </div>
                {resource.owner.is_verified_neighbor && (
                  <ShieldCheck size={10} className="text-primary" />
                )}
              </div>
            </div>
          </div>
        </div>

        <CardContent className="flex items-center justify-between gap-3 px-4 py-3">
          <div className="min-w-0">
            <h3 className="truncate text-lg font-black tracking-tight text-foreground">
              {resource.name}
            </h3>
            <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
              {isItem ? "Physical Tool" : "Helpful Skill"}
            </p>
            {resource.description && (
              <p className="mt-1 line-clamp-1 text-xs text-muted-foreground/80">
                {resource.description}
              </p>
            )}
          </div>

          <CardFooter className="p-0">
            <Button
              onClick={() => onAction?.(resource.id)}
              disabled={resource.status !== "available"}
              variant={resource.status === "available" ? "default" : "secondary"}
              size="sm"
              className="rounded-full px-5 text-xs font-bold disabled:opacity-45"
            >
              {isItem ? "Borrow" : "Contact"}
              <ArrowUpRight size={14} className="ml-1.5" />
            </Button>
          </CardFooter>
        </CardContent>
      </div>
    </Card>
  );
}
