"use client";

import React, { memo, useState } from 'react';
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { MapPin, Clock, MessageCircle, Heart, CheckCircle2, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

// Feed: PulseCard — displays a single pulse in the feed
export interface Pulse {
  id?: string;
  type: string;
  urgency: 'low' | 'medium' | 'high' | 'critical';
  message: string;
  author: string;
  avatar_url?: string;
  created_at: string | Date;
  distance?: number;
  lat?: number;
  latitude?: number;
  lng?: number;
  longitude?: number;
}

interface PulseCardProps {
  onConfirm?: (pulseId: string) => void;
  onMessage?: (authorUsername: string) => void;
  currentUserId?: string;
  pulse: Pulse;
}

const URGENCY_STYLES: Record<Pulse['urgency'], { border: string; glow: string; badge: string }> = {
  low: {
    border: "border-emerald-500/30",
    glow: "shadow-[0_0_20px_rgba(16,185,129,0.1)]",
    badge: "bg-emerald-500/10 text-emerald-400"
  },
  medium: {
    border: "border-amber-500/30",
    glow: "shadow-[0_0_20px_rgba(245,158,11,0.1)]",
    badge: "bg-amber-500/10 text-amber-400"
  },
  high: {
    border: "border-rose-500/30",
    glow: "shadow-[0_0_25px_rgba(244,63,94,0.15)]",
    badge: "bg-rose-500/10 text-rose-400"
  },
  critical: {
    border: "border-rose-600 shadow-[0_0_15px_rgba(225,29,72,0.3)] animate-pulse",
    glow: "shadow-[0_0_35px_rgba(225,29,72,0.25)]",
    badge: "bg-rose-600 text-white font-black"
  },
};

export const PulseCard = memo(function PulseCard({ pulse, onConfirm, onMessage, currentUserId }: PulseCardProps) {
  const tc = useTranslations("Categories");
  const router = useRouter();
  const [isConfirmed, setIsConfirmed] = useState(false);
  const { type, urgency, message, author, avatar_url, created_at, distance, id } = pulse;

  const handleConfirm = async () => {
    if (isConfirmed || !id) return;
    setIsConfirmed(true);
    if (onConfirm) onConfirm(id);
    try {
      await fetch(`/api/pulses/${id}/confirm`, { method: 'POST' });
    } catch (e) {
      setIsConfirmed(false);
    }
  };

  const handleMessage = () => {
    if (onMessage) onMessage(author);
    router.push(`/profile/${author}`);
  };

  const style = URGENCY_STYLES[urgency] || URGENCY_STYLES.low;

  const timeString = new Date(created_at).toLocaleTimeString(undefined, {
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <div className={cn(
      "glass group relative flex flex-col overflow-hidden rounded-3xl border border-border/50 transition-all hover:scale-[1.01] active:scale-[0.99]",
      style.border,
      style.glow
    )}>
      {/* Header Info */}
      <div className="flex items-center gap-3 p-5">
        <Avatar className="size-10 border border-border/50 ring-2 ring-background ring-offset-2 ring-offset-primary/20">
          <AvatarImage src={avatar_url} />
          <AvatarFallback className="bg-primary/10 text-primary text-xs font-bold uppercase tracking-widest">
            {author.substring(0, 2)}
          </AvatarFallback>
        </Avatar>

        <div className="flex-1 overflow-hidden">
          <div className="flex items-center gap-1.5">
            <span className="truncate text-sm font-black tracking-tight text-foreground">{author}</span>
            <CheckCircle2 className="size-3 text-primary fill-primary/10 shrink-0" />
          </div>
          <div className="flex items-center gap-3 text-[10px] font-bold text-muted-foreground uppercase tracking-[0.1em]">
            <span className="flex items-center gap-1"><Clock className="size-3" /> {timeString}</span>
            {distance && <span className="flex items-center gap-1 text-primary"><MapPin className="size-3" /> {distance}m away</span>}
          </div>
        </div>

        <span className={cn("rounded-lg px-2.5 py-1 text-[10px] font-black uppercase tracking-widest shrink-0", style.badge)}>
          {tc(type)}
        </span>
      </div>

      {/* Message Body */}
      <div className="px-5 pb-4">
        <p className="text-base font-medium leading-relaxed text-foreground/90">
          {message}
        </p>
      </div>

      {/* Quick Actions (WhatsApp inspired) */}
      <div className="flex border-t border-border/20 bg-muted/20 p-2 gap-2 backdrop-blur-md">
        <Button variant="ghost" size="sm" onClick={() => handleConfirm()} disabled={isConfirmed} className="flex-1 rounded-xl font-bold text-xs hover:bg-primary/10 hover:text-primary transition-all">
          <Heart className="mr-2 size-4" />
          Help
        </Button>
        <Button variant="ghost" size="sm" onClick={handleMessage} className="flex-1 rounded-xl font-bold text-xs hover:bg-primary/10 hover:text-primary transition-all">
          <MessageCircle className="mr-2 size-4" />
          Message
        </Button>
        <Button variant="ghost" size="sm" className="flex-1 rounded-xl font-bold text-xs hover:bg-primary/10 hover:text-primary transition-all">
          <CheckCircle2 className="mr-2 size-4" />
          {isConfirmed ? "Confirmed!" : "Confirm"}
        </Button>
      </div>
    </div>
  );
});
