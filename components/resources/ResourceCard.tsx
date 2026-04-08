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
        "group flex flex-col h-full border border-border/50 bg-muted/20 backdrop-blur-sm rounded-3xl overflow-hidden transition-all hover:bg-muted/30 hover:border-primary/50 hover:shadow-[0_0_30px_rgba(var(--primary),0.1)]",
        className
      )}
    >
      {/* Header with Type Icon */}
      <div className="relative h-32 bg-muted/10 flex items-center justify-center border-b border-border/30 overflow-hidden">
        <div className={cn(
          "p-5 rounded-[2rem] shadow-xl transition-transform group-hover:scale-110",
          isItem ? "bg-amber-500/10 text-amber-500 shadow-amber-500/5" : "bg-primary/10 text-primary shadow-primary/5"
        )}>
          {isItem ? <Package size={36} /> : <Wrench size={36} />}
        </div>

        {/* Availability Badge */}
        <div className="absolute top-4 right-4">
          <Badge className={cn(
            "font-black uppercase tracking-widest text-[9px] px-2.5 py-1 rounded-lg border-none shadow-sm",
            resource.status === "available" ? "bg-primary text-primary-foreground" : "bg-destructive text-destructive-foreground"
          )}>
            {resource.status === "available" ? "Ready" : "Busy"}
          </Badge>
        </div>
      </div>

      <CardContent className="flex-1 p-6 space-y-4">
        <div>
          <h3 className="text-xl font-black text-foreground tracking-tight leading-tight mb-1 group-hover:text-primary transition-colors">
            {resource.name}
          </h3>
          <p className="text-muted-foreground text-[10px] font-bold uppercase tracking-widest">
            {isItem ? "Physical Tool" : "Helpful Skill"}
          </p>
        </div>

        {resource.description && (
          <p className="text-sm text-muted-foreground/80 line-clamp-2 leading-relaxed">
            {resource.description}
          </p>
        )}

        {/* Owner Info Bar */}
        <div className="flex items-center gap-3 pt-4 border-t border-border/30">
          <Avatar className="h-8 w-8 border border-border/50 p-0.5">
            <AvatarImage src={resource.owner.avatar_url || ""} />
            <AvatarFallback className="bg-primary/10 text-primary text-[10px] font-bold">
              {resource.owner.username.slice(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-bold text-foreground truncate">
              {resource.owner.full_name || resource.owner.username}
            </p>
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1 text-amber-500 font-black text-[10px]">
                <Star size={10} className="fill-amber-500" />
                {resource.owner.trust_score}
              </div>
              {resource.owner.is_verified_neighbor && (
                <ShieldCheck size={10} className="text-primary" />
              )}
            </div>
          </div>
        </div>
      </CardContent>

      <CardFooter className="p-6 pt-0">
        <Button
          onClick={() => onAction?.(resource.id)}
          disabled={resource.status !== "available"}
          variant={resource.status === "available" ? "default" : "secondary"}
          className="w-full font-black h-11 rounded-xl shadow-lg shadow-primary/10 transition-all active:scale-95 disabled:opacity-40"
        >
          {isItem ? "Request to Borrow" : "Inquire About Skill"}
          <ArrowUpRight size={16} className="ml-2" />
        </Button>
      </CardFooter>
    </Card>
  );
}
