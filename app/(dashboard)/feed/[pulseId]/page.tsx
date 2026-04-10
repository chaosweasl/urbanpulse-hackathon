"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, CheckCircle2, Clock, Loader2, MapPin, MessageCircle, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AvatarWithBadge } from "@/components/shared/AvatarWithBadge";
import { cn } from "@/lib/utils";
import { useTranslations } from "next-intl";
import type { PulseCategory, PulseStatus, PulseUrgency } from "@/types";

interface PulseAuthor {
  id: string;
  username: string;
  full_name: string | null;
  avatar_url: string | null;
  trust_score: number;
  is_verified_neighbor: boolean;
}

interface PulseDetail {
  id: string;
  title: string;
  description: string;
  category: PulseCategory;
  urgency: PulseUrgency;
  status: PulseStatus;
  confirm_count: number;
  created_at: string;
  updated_at: string;
  photo_url: string | null;
  author_id: string;
  author: PulseAuthor;
}

interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

interface ViewerProfile {
  id: string;
  is_admin: boolean;
}

const urgencyStyles: Record<PulseUrgency, string> = {
  low: "bg-emerald-500/10 text-emerald-400",
  medium: "bg-amber-500/10 text-amber-400",
  high: "bg-rose-500/10 text-rose-400",
  critical: "bg-rose-600/15 text-rose-300",
};

const statusStyles: Record<PulseStatus, string> = {
  active: "bg-primary/10 text-primary",
  resolved: "bg-emerald-500/10 text-emerald-400",
  expired: "bg-muted text-muted-foreground",
};

export default function PulseDetailPage() {
  const params = useParams<{ pulseId: string }>();
  const router = useRouter();
  const tCategories = useTranslations("Categories");
  const tUrgency = useTranslations("Urgency");
  const [pulse, setPulse] = useState<PulseDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);
  const [viewerId, setViewerId] = useState<string | null>(null);
  const [isConfirming, setIsConfirming] = useState(false);
  const [isMessaging, setIsMessaging] = useState(false);
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [confirmCount, setConfirmCount] = useState(0);
  const [canTriggerMatch, setCanTriggerMatch] = useState(false);
  const [isTriggeringMatch, setIsTriggeringMatch] = useState(false);
  const [matchStatus, setMatchStatus] = useState<string | null>(null);

  const pulseId = params.pulseId;

  useEffect(() => {
    async function fetchPulse() {
      setIsLoading(true);
      setLoadError(null);
      try {
        const response = await fetch(`/api/pulses/${pulseId}`);
        const data = await response.json() as ApiResponse<PulseDetail>;

        if (!data.success || !data.data) {
          throw new Error(data.error || "Pulse not found");
        }

        setPulse(data.data);
        setConfirmCount(data.data.confirm_count);

        const meResponse = await fetch("/api/users/me");
        const meData = await meResponse.json() as ApiResponse<ViewerProfile>;
        if (meData.success && meData.data) {
          setViewerId(meData.data.id);
          setCanTriggerMatch(meData.data.id === data.data.author_id || meData.data.is_admin);
        }
      } catch (fetchError) {
        const message = fetchError instanceof Error ? fetchError.message : "Unable to load pulse";
        setLoadError(message);
      } finally {
        setIsLoading(false);
      }
    }

    if (pulseId) {
      void fetchPulse();
    }
  }, [pulseId]);

  const handleConfirm = async () => {
    if (!pulse) return;
    if (viewerId && viewerId === pulse.author_id) {
      setActionError("You cannot confirm your own pulse.");
      return;
    }

    setActionError(null);
    setIsConfirming(true);
    try {
      const response = await fetch(`/api/pulses/${pulse.id}/confirm`, {
        method: "POST",
      });
      const data = await response.json() as ApiResponse<{ message: string }>;

      if (!data.success) {
        throw new Error(data.error || "Failed to confirm pulse");
      }

      setIsConfirmed(true);
      setConfirmCount((currentCount) => currentCount + 1);
    } catch (confirmError) {
      const message = confirmError instanceof Error ? confirmError.message : "Failed to confirm pulse";
      setActionError(message);
    } finally {
      setIsConfirming(false);
    }
  };

  const handleTriggerMatch = async () => {
    if (!pulse) return;

    setIsTriggeringMatch(true);
    setMatchStatus(null);

    try {
      const response = await fetch("/api/matching", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pulseId: pulse.id }),
      });

      const data = await response.json() as ApiResponse<{ matched_users: number; notifications_sent: number }>;

      if (!data.success || !data.data) {
        throw new Error(data.error || "Failed to run matching");
      }

      setMatchStatus(`Matched ${data.data.matched_users} neighbors and sent ${data.data.notifications_sent} hero alerts.`);
    } catch (matchError) {
      const message = matchError instanceof Error ? matchError.message : "Failed to run matching";
      setMatchStatus(message);
    } finally {
      setIsTriggeringMatch(false);
    }
  };

  const handleMessageAuthor = async () => {
    if (!pulse) return;
    if (viewerId && viewerId === pulse.author_id) {
      setActionError("You cannot start a conversation with yourself.");
      return;
    }

    setActionError(null);
    setIsMessaging(true);
    try {
      const response = await fetch("/api/conversations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          recipient_id: pulse.author.id,
          pulse_id: pulse.id,
        }),
      });
      const data = await response.json() as ApiResponse<{ id: string }>;

      if (!data.success || !data.data) {
        throw new Error(data.error || "Failed to start conversation");
      }

      router.push(`/messages/${data.data.id}`);
    } catch (messageError) {
      const message = messageError instanceof Error ? messageError.message : "Failed to start conversation";
      setActionError(message);
    } finally {
      setIsMessaging(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
      </div>
    );
  }

  if (loadError || !pulse) {
    return (
      <div className="mx-auto flex min-h-[60vh] max-w-2xl flex-col items-center justify-center text-center">
        <p className="mb-2 text-xs uppercase tracking-widest text-zinc-500">Pulse unavailable</p>
        <h1 className="mb-3 text-3xl font-bold tracking-tight text-foreground md:text-4xl">This pulse could not be loaded</h1>
        <p className="max-w-lg text-sm font-medium text-muted-foreground mb-6">{loadError}</p>
        <Button asChild className="rounded-lg bg-primary font-bold text-primary-foreground hover:bg-primary/90">
          <Link href="/feed">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to feed
          </Link>
        </Button>
      </div>
    );
  }

  const isOwnPulse = !!viewerId && viewerId === pulse.author_id;

  return (
    <div className="mx-auto max-w-5xl space-y-8 pb-20">
      <div className="flex items-center justify-between gap-4">
        <Button asChild variant="ghost" className="rounded-lg px-4 text-muted-foreground hover:text-foreground">
          <Link href="/feed">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to feed
          </Link>
        </Button>
      </div>

      <section className="space-y-5">
        <p className="text-xs uppercase tracking-widest text-zinc-500">Pulse detail</p>
        <h1 className="text-3xl font-bold tracking-tight text-foreground md:text-4xl">{pulse.title}</h1>
      </section>

      <div className="grid gap-8 lg:grid-cols-[1.35fr_0.9fr]">
        <div className="space-y-8">
          <div className="rounded-lg border border-white/8 bg-zinc-900 p-6 md:p-8">
            <div className="flex flex-wrap items-center gap-2 mb-5">
              <Badge className={cn("rounded-full border-none px-3 py-1 text-xs font-medium uppercase tracking-wider", urgencyStyles[pulse.urgency])}>
                {tUrgency(pulse.urgency)}
              </Badge>
              <Badge variant="outline" className="rounded-full border-border/50 px-3 py-1 text-xs font-medium uppercase tracking-wider text-foreground">
                {tCategories(pulse.category)}
              </Badge>
              <Badge className={cn("rounded-full border-none px-3 py-1 text-xs font-medium uppercase tracking-wider", statusStyles[pulse.status])}>
                {pulse.status}
              </Badge>
            </div>

            <p className="whitespace-pre-wrap text-lg md:text-xl leading-relaxed text-foreground/90 font-medium">
              {pulse.description}
            </p>

            {pulse.photo_url && (
              <div className="relative mt-6 aspect-[16/9] overflow-hidden rounded-lg border border-white/8 bg-muted/20">
                <Image
                  src={pulse.photo_url}
                  alt={pulse.title}
                  fill
                  sizes="(max-width: 1024px) 100vw, 60vw"
                  className="object-cover"
                />
              </div>
            )}
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            <div className="rounded-lg border border-white/8 bg-zinc-900 p-5">
              <p className="mb-1 text-xs uppercase tracking-widest text-zinc-500">Confirmed</p>
              <p className="text-3xl font-bold tracking-tight text-foreground">{confirmCount}</p>
            </div>
            <div className="rounded-lg border border-white/8 bg-zinc-900 p-5">
              <p className="mb-1 text-xs uppercase tracking-widest text-zinc-500">Posted</p>
              <p className="flex items-center gap-2 text-sm font-semibold text-foreground/90"><Clock className="h-4 w-4 text-primary" /> {new Date(pulse.created_at).toLocaleString()}</p>
            </div>
            <div className="rounded-lg border border-white/8 bg-zinc-900 p-5">
              <p className="mb-1 text-xs uppercase tracking-widest text-zinc-500">Status</p>
              <p className="flex items-center gap-2 text-sm font-semibold text-foreground/90"><MapPin className="h-4 w-4 text-primary" /> {pulse.status}</p>
            </div>
          </div>
        </div>

        <aside className="space-y-6">
          <div className="rounded-lg border border-white/8 bg-zinc-900 p-6">
            <p className="mb-1 text-xs uppercase tracking-widest text-zinc-500">Author</p>
            <div className="flex items-start gap-4">
              <AvatarWithBadge
                src={pulse.author.avatar_url}
                fallback={pulse.author.full_name || pulse.author.username}
                isVerified={pulse.author.is_verified_neighbor}
                size="lg"
              />
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <h2 className="truncate text-xl font-bold tracking-tight text-foreground">{pulse.author.full_name || pulse.author.username}</h2>
                  {pulse.author.is_verified_neighbor && <CheckCircle2 className="h-4 w-4 shrink-0 text-primary fill-primary/10" />}
                </div>
                <p className="text-sm font-medium text-muted-foreground">@{pulse.author.username}</p>
                <p className="mt-3 text-sm text-muted-foreground">Trust score {pulse.author.trust_score}</p>
              </div>
            </div>
          </div>

          <div className="space-y-4 rounded-lg border border-white/8 bg-zinc-900 p-6">
            <Button
              onClick={handleConfirm}
              disabled={isConfirming || isConfirmed || isOwnPulse}
              className="h-12 w-full rounded-lg bg-primary font-bold text-primary-foreground hover:bg-primary/90"
            >
              {isConfirming ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <CheckCircle2 className="mr-2 h-4 w-4" />}
              {isOwnPulse ? "Your Pulse" : isConfirmed ? "Confirmed" : "Confirm pulse"}
            </Button>

            <Button
              variant="secondary"
              onClick={handleMessageAuthor}
              disabled={isMessaging || isOwnPulse}
              className="h-12 w-full rounded-lg font-bold"
            >
              {isMessaging ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <MessageCircle className="mr-2 h-4 w-4" />}
              {isOwnPulse ? "Your Pulse" : "Message Author"}
            </Button>

            {canTriggerMatch && (
              <Button
                variant="outline"
                onClick={handleTriggerMatch}
                disabled={isTriggeringMatch}
                className="h-12 w-full rounded-lg font-bold"
              >
                {isTriggeringMatch ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Users className="mr-2 h-4 w-4" />}
                Find Helpers
              </Button>
            )}

            {matchStatus && (
              <p className="text-xs font-semibold text-muted-foreground">{matchStatus}</p>
            )}

            {actionError && (
              <p className="text-xs font-semibold text-destructive">{actionError}</p>
            )}
          </div>
        </aside>
      </div>
    </div>
  );
}
