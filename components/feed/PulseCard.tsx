"use client";

import React, { memo, useState } from 'react';
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { MapPin, Clock, CheckCircle2, MoreHorizontal, Flag, Trash2, Loader2, TriangleAlert, Wrench, Package } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AvatarWithBadge } from "@/components/shared/AvatarWithBadge";
import { cn } from "@/lib/utils";
import type { ReportReason } from "@/types";
import Image from "next/image";

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
  photo_url?: string | null;
}

interface PulseCardProps {
  onConfirm?: (pulseId: string) => void;
  onDelete?: (pulseId: string) => void;
  onMessage?: (authorUsername: string) => void;
  currentUserId?: string;
  pulse: Pulse;
}

const URGENCY_STYLES: Record<Pulse['urgency'], { badge: string; chip: string }> = {
  low: {
    badge: "text-emerald-300",
    chip: "text-emerald-300"
  },
  medium: {
    badge: "text-amber-300",
    chip: "text-amber-300"
  },
  high: {
    badge: "text-rose-300",
    chip: "text-rose-300"
  },
  critical: {
    badge: "text-rose-200",
    chip: "text-rose-200"
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
  const { type, urgency, message, author, avatar_url, created_at, distance, id, photo_url } = pulse;
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
    <div className="group relative flex flex-col overflow-hidden rounded-lg border border-white/8 bg-zinc-900 transition-all hover:-translate-y-0.5">
      <button
        type="button"
        onClick={() => setIsMenuOpen((prev) => !prev)}
        className="absolute right-4 top-4 z-20 inline-flex size-9 items-center justify-center rounded-full border border-white/10 bg-zinc-900 text-white/80 transition-colors hover:bg-zinc-800 hover:text-white"
        aria-label="Open pulse actions"
        aria-expanded={isMenuOpen}
      >
        <MoreHorizontal size={18} />
      </button>

      {isMenuOpen && (
        <div className="absolute right-4 top-14 z-20 w-48 rounded-lg border border-white/10 bg-zinc-900 p-2">
          <button
            type="button"
            onClick={() => {
              setShowReportForm(true);
              setIsMenuOpen(false);
            }}
            className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm font-semibold text-white transition-colors hover:bg-white/10"
          >
            <Flag size={14} className="text-white/70" />
            Report this pulse
          </button>
          {isAuthor && (
            <button
              type="button"
              onClick={handleDeletePulse}
              disabled={isDeleting}
              className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm font-semibold text-rose-300 transition-colors hover:bg-rose-500/15 disabled:opacity-60"
            >
              {isDeleting ? <Loader2 size={14} className="animate-spin" /> : <Trash2 size={14} />}
              Delete pulse
            </button>
          )}
        </div>
      )}

      <div className="relative aspect-square w-full overflow-hidden">
        {photo_url ? (
          <Image
            src={photo_url}
            alt={message.slice(0, 80)}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-zinc-800 text-zinc-300">
            {type === "emergency" ? <TriangleAlert className="size-8" /> : type === "skill" ? <Wrench className="size-8" /> : <Package className="size-8" />}
          </div>
        )}

        <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-black/70 to-transparent" />

        <div className="absolute left-4 right-16 top-4 flex items-center gap-2">
          <span className="rounded-full bg-zinc-800 px-3 py-1 text-[10px] font-semibold uppercase tracking-wider text-zinc-100">
            {tc(type)}
          </span>
          <span className={cn("rounded-full bg-zinc-800 px-3 py-1 text-[10px] font-semibold uppercase tracking-wider", style.chip)}>
            {urgency}
          </span>
        </div>

        <div className="absolute bottom-4 left-4 right-4">
          <p className="line-clamp-2 text-base font-semibold leading-relaxed text-white/95">{message}</p>
        </div>
      </div>

      <div className="flex items-center justify-between gap-3 px-4 py-4">
        <div className="flex min-w-0 items-center gap-3">
          <AvatarWithBadge
            src={avatar_url}
            fallback={author}
            isVerified={pulse.is_verified_neighbor}
            size="md"
          />

          <div className="min-w-0">
            <div className="flex items-center gap-1.5">
              <span className="truncate text-sm font-bold tracking-tight text-foreground">{author}</span>
              {pulse.is_verified_neighbor && <CheckCircle2 className="size-3 shrink-0 text-primary fill-primary/10" />}
            </div>
            <div className="flex items-center gap-3 text-xs font-medium uppercase tracking-wider text-zinc-500">
              <span className="flex items-center gap-1"><Clock className="size-3" /> {timeString}</span>
              {distance !== undefined && distance !== null && (
                <span className={cn("flex items-center gap-1", style.badge)}><MapPin className="size-3" /> {distance}m</span>
              )}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button onClick={handleConfirm} disabled={isConfirmed} className="flex items-center gap-1.5 rounded-full bg-zinc-800 px-3 py-2 text-[11px] font-bold text-muted-foreground transition-colors hover:text-primary">
            <CheckCircle2 size={14} className={isConfirmed ? "text-primary" : ""} />
            {isConfirmed ? "Confirmed" : "Confirm"}
          </button>
          <Button size="sm" onClick={handleMessage} className="h-9 rounded-full px-4 text-xs font-bold">
            View Post
          </Button>
        </div>
      </div>

      {reportSubmitted && (
        <div className="border-t border-white/10 px-5 py-4 text-sm font-semibold text-primary">
          Thanks for reporting. We’ll review this pulse shortly.
        </div>
      )}

      {showReportForm && !reportSubmitted && (
        <div className="space-y-4 border-t border-white/10 bg-neutral-950/80 px-5 py-4">
          <div className="space-y-3">
            <div className="space-y-2">
              <label className="text-xs uppercase tracking-widest text-zinc-500">Reason</label>
              <select
                value={reportReason}
                onChange={(event) => setReportReason(event.target.value as ReportReason)}
                className="w-full rounded-lg border border-white/10 bg-zinc-900 px-3 py-2 text-sm font-medium text-foreground"
              >
                <option value="spam">Spam</option>
                <option value="harassment">Harassment</option>
                <option value="misinformation">Misinformation</option>
                <option value="inappropriate">Inappropriate</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-xs uppercase tracking-widest text-zinc-500">Description</label>
              <input
                value={reportDescription}
                onChange={(event) => setReportDescription(event.target.value)}
                placeholder="Add a short note"
                className="w-full rounded-lg border border-white/10 bg-zinc-900 px-3 py-2 text-sm font-medium text-foreground placeholder:text-muted-foreground"
              />
            </div>
          </div>

          {reportError && <p className="text-xs font-semibold text-destructive">{reportError}</p>}

          <Button
            type="button"
            onClick={handleReportSubmit}
            disabled={isSubmittingReport}
            className="h-10 w-full rounded-lg font-bold"
          >
            {isSubmittingReport ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Flag className="mr-2 h-4 w-4" />}
            Submit Report
          </Button>
        </div>
      )}
    </div>
  );
});
