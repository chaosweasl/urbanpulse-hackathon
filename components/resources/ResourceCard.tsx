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
 * Shows resource info, owner trust score, and availability.
 * Cohesive with the HeroAlert blue/gold palette.
 */
export function ResourceCard({ resource, onAction, className }: ResourceCardProps) {
  const isItem = resource.type === "item";

  return (
    <Card
      className={cn(
        "group flex flex-col h-full border-2 border-blue-100/50 shadow-xl shadow-blue-900/5 bg-white rounded-3xl overflow-hidden transition-all hover:shadow-2xl hover:shadow-blue-900/10 hover:border-blue-200",
        className
      )}
    >
      {/* Header with Type Icon */}
      <div className="relative h-32 bg-blue-50/50 flex items-center justify-center border-b border-blue-100/30 overflow-hidden">
        <div className={cn(
          "p-5 rounded-[2rem] shadow-xl transition-transform group-hover:scale-110",
          isItem ? "bg-amber-100 text-amber-600 shadow-amber-600/10" : "bg-blue-100 text-blue-600 shadow-blue-600/10"
        )}>
          {isItem ? <Package size={36} /> : <Wrench size={36} />}
        </div>

        {/* Availability Badge */}
        <div className="absolute top-4 right-4">
          <Badge className={cn(
            "font-black uppercase tracking-widest text-[9px] px-2.5 py-1 rounded-lg border-none shadow-sm",
            resource.status === "available" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
          )}>
            {resource.status === "available" ? "Ready" : "Busy"}
          </Badge>
        </div>
      </div>

      <CardContent className="flex-1 p-6 space-y-4">
        <div>
          <h3 className="text-xl font-black text-blue-950 tracking-tight leading-tight mb-1 group-hover:text-blue-600 transition-colors">
            {resource.name}
          </h3>
          <p className="text-blue-900/60 text-xs font-bold uppercase tracking-widest">
            {isItem ? "Physical Tool" : "Helpful Skill"}
          </p>
        </div>

        {resource.description && (
          <p className="text-sm text-blue-900/70 line-clamp-2 leading-relaxed">
            {resource.description}
          </p>
        )}

        {/* Owner Info Bar */}
        <div className="flex items-center gap-3 pt-4 border-t border-blue-50">
          <Avatar className="h-8 w-8 border border-blue-100">
            <AvatarImage src={resource.owner.avatar_url || ""} />
            <AvatarFallback className="bg-blue-50 text-blue-600 text-[10px] font-bold">
              {resource.owner.username.slice(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-bold text-blue-950 truncate">
              {resource.owner.full_name || resource.owner.username}
            </p>
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1 text-amber-500 font-black text-[10px]">
                <Star size={10} className="fill-amber-500" />
                {resource.owner.trust_score}
              </div>
              {resource.owner.is_verified_neighbor && (
                <ShieldCheck size={10} className="text-blue-500" />
              )}
            </div>
          </div>
        </div>
      </CardContent>

      <CardFooter className="p-6 pt-0">
        <Button
          onClick={() => onAction?.(resource.id)}
          disabled={resource.status !== "available"}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-black h-11 rounded-xl shadow-lg shadow-blue-600/20 transition-all active:scale-95 disabled:opacity-40"
        >
          {isItem ? "Request to Borrow" : "Inquire About Skill"}
          <ArrowUpRight size={16} className="ml-2" />
        </Button>
      </CardFooter>
    </Card>
  );
}
