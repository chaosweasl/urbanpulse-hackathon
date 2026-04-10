"use client";

import React, { memo, useState } from 'react';
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { MapPin, Clock, CheckCircle2, MoreHorizontal, Flag, Trash2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AvatarWithBadge } from "@/components/shared/AvatarWithBadge";
import { cn } from "@/lib/utils";
import type { ReportReason } from "@/types";

// Feed: PulseCard — displays a single pulse in the feed
export interface Pulse {
  id?: string;
  author_id?: string;
  type: string;
  urgency: 'low' | 'medium' | 'high' | 'critical';
  message: string;
  author: string;
  avatar_url?: string;
  is_verified_neighbor?: boolean;
  created_at: string | Date;
  distance?: number;
  lat?: number;
  latitude?: number;
  lng?: number;
  longitude?: number;
}

interface PulseCardProps {
  onConfirm?: (pulseId: string) => void;
  onDelete?: (pulseId: string) => void;
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
    border: "border-rose-600 shadow-[0_0_15px_rgba(225,29,72,0.3)]",
    glow: "shadow-[0_0_35px_rgba(225,29,72,0.25)]",
    badge: "text-rose-500 font-black"
  },
};

export const PulseCard = memo(function PulseCard({ pulse, onConfirm, onDelete, onMessage, currentUserId }: PulseCardProps) {
  const tc = useTranslations("Categories");
  const router = useRouter();
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showReportForm, setShowReportForm] = useState(false);
  const [reportReason, setReportReason] = useState<ReportReason>("spam");
  const [reportDescription, setReportDescription] = useState("");
  const [isSubmittingReport, setIsSubmittingReport] = useState(false);
  const [reportSubmitted, setReportSubmitted] = useState(false);
  const [reportError, setReportError] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const { type, urgency, message, author, avatar_url, created_at, distance, id } = pulse;
  const isAuthor = !!currentUserId && currentUserId === pulse.author_id;

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
    router.push(`/feed/${id}`);
  };

  const handleReportSubmit = async () => {
    if (!id) return;

    const trimmedDescription = reportDescription.trim();
    if (trimmedDescription && trimmedDescription.length < 10) {
      setReportError("Description must be at least 10 characters.");
      return;
    }

    setIsSubmittingReport(true);
    setReportError(null);

    try {
      const response = await fetch("/api/moderation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          target_type: "pulse",
          target_id: id,
          reason: reportReason,
          description: trimmedDescription || undefined,
        }),
      });

      const data = await response.json();
      if (!data.success) {
        throw new Error(data.error || "Failed to submit report");
      }

      setReportSubmitted(true);
      setShowReportForm(false);
      setIsMenuOpen(false);
      setReportDescription("");
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to submit report";
      setReportError(message);
    } finally {
      setIsSubmittingReport(false);
    }
  };

  const handleDeletePulse = async () => {
    if (!id) return;

    setIsDeleting(true);

    try {
      const response = await fetch(`/api/pulses/${id}`, {
        method: "DELETE",
      });

      const data = await response.json();
      if (!data.success) {
        throw new Error(data.error || "Failed to delete pulse");
      }

      if (onDelete) onDelete(id);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to delete pulse";
      setReportError(message);
    } finally {
      setIsDeleting(false);
      setIsMenuOpen(false);
    }
  };

  const style = URGENCY_STYLES[urgency] || URGENCY_STYLES.low;

  const timeString = new Date(created_at).toLocaleTimeString(undefined, {
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <div className={cn(
      "glass group relative flex flex-col overflow-hidden rounded-2xl border border-border/50 transition-all hover:scale-[1.01] active:scale-[0.99]",
      style.border,
      style.glow
    )}>
      <button
        type="button"
        onClick={() => setIsMenuOpen((prev) => !prev)}
        className="absolute right-4 top-4 z-20 inline-flex size-9 items-center justify-center rounded-full border border-border/50 bg-background/90 text-muted-foreground shadow-sm transition-colors hover:bg-background hover:text-foreground"
        aria-label="Open pulse actions"
        aria-expanded={isMenuOpen}
      >
        <MoreHorizontal size={18} />
      </button>

      {isMenuOpen && (
        <div className="absolute right-4 top-14 z-20 w-48 rounded-2xl border border-border/50 bg-background/95 p-2 shadow-2xl backdrop-blur-xl">
          <button
            type="button"
            onClick={() => {
              setShowReportForm(true);
              setIsMenuOpen(false);
            }}
            className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-left text-sm font-semibold text-foreground transition-colors hover:bg-muted/60"
          >
            <Flag size={14} className="text-muted-foreground" />
            Report this pulse
          </button>
          {isAuthor && (
            <button
              type="button"
              onClick={handleDeletePulse}
              disabled={isDeleting}
              className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-left text-sm font-semibold text-destructive transition-colors hover:bg-destructive/10 disabled:opacity-60"
            >
              {isDeleting ? <Loader2 size={14} className="animate-spin" /> : <Trash2 size={14} />}
              Delete pulse
            </button>
          )}
        </div>
      )}

      {/* Header Info */}
      <div className="flex items-center gap-3 p-5">
        <AvatarWithBadge
          src={avatar_url}
          fallback={author}
          isVerified={pulse.is_verified_neighbor}
          size="md"
          className="ring-2 ring-background ring-offset-2 ring-offset-primary/20"
        />

        <div className="flex-1 overflow-hidden">
          <div className="flex items-center gap-1.5">
            <span className="truncate text-sm font-black tracking-tight text-foreground">{author}</span>
            {pulse.is_verified_neighbor && <CheckCircle2 className="size-3 text-primary fill-primary/10 shrink-0" />}
          </div>
          <div className="flex items-center gap-3 text-[10px] font-bold text-muted-foreground uppercase tracking-[0.1em]">
            <span className="flex items-center gap-1"><Clock className="size-3" /> {timeString}</span>
            {distance && <span className="flex items-center gap-1 text-primary"><MapPin className="size-3" /> {distance}m away</span>}
          </div>
        </div>

        <span className={cn("flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest shrink-0", style.badge)}>
          <span className="h-1.5 w-1.5 rounded-full bg-current" />
          {tc(type)}
        </span>
      </div>

      {/* Message Body */}
      <div className={cn(
        "px-5 pb-4",
        type === "emergency" && "border-l-2 border-rose-500 pl-4 ml-5"
      )}>
        <p className="text-base font-medium leading-relaxed text-foreground/90">
          {message}
        </p>
      </div>

      {/* Quick Actions (WhatsApp inspired) */}
      <div className="flex items-center justify-between border-t border-border/20 px-5 py-3">
        <button onClick={handleConfirm} disabled={isConfirmed} className="flex items-center gap-1.5 text-[11px] font-black text-muted-foreground hover:text-primary transition-colors">
          <CheckCircle2 size={14} className={isConfirmed ? "text-primary" : ""} />
          {isConfirmed ? "Confirmed" : "Confirm"}
        </button>
        <Button size="sm" onClick={handleMessage} className="rounded-lg h-8 px-4 text-xs font-bold bg-primary text-primary-foreground hover:bg-primary/90">
          View Post
        </Button>
      </div>

      {reportSubmitted && (
        <div className="border-t border-border/20 px-5 py-4 text-sm font-semibold text-primary">
          Thanks for reporting. We’ll review this pulse shortly.
        </div>
      )}

      {showReportForm && !reportSubmitted && (
        <div className="border-t border-border/20 bg-muted/20 px-5 py-4 space-y-4">
          <div className="space-y-3">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Reason</label>
              <select
                value={reportReason}
                onChange={(event) => setReportReason(event.target.value as ReportReason)}
                className="w-full rounded-xl border border-border/50 bg-card px-3 py-2 text-sm font-medium text-foreground"
              >
                <option value="spam">Spam</option>
                <option value="harassment">Harassment</option>
                <option value="misinformation">Misinformation</option>
                <option value="inappropriate">Inappropriate</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Description</label>
              <input
                value={reportDescription}
                onChange={(event) => setReportDescription(event.target.value)}
                placeholder="Add a short note"
                className="w-full rounded-xl border border-border/50 bg-card px-3 py-2 text-sm font-medium text-foreground placeholder:text-muted-foreground"
              />
            </div>
          </div>

          {reportError && <p className="text-xs font-semibold text-destructive">{reportError}</p>}

          <Button
            type="button"
            onClick={handleReportSubmit}
            disabled={isSubmittingReport}
            className="h-10 w-full rounded-xl bg-primary font-bold text-primary-foreground hover:bg-primary/90"
          >
            {isSubmittingReport ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Flag className="mr-2 h-4 w-4" />}
            Submit Report
          </Button>
        </div>
      )}
    </div>
  );
});
