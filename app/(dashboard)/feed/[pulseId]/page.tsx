"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, CheckCircle2, Clock, Loader2, MapPin, MessageCircle } from "lucide-react";
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
  const [error, setError] = useState<string | null>(null);
  const [isConfirming, setIsConfirming] = useState(false);
  const [isMessaging, setIsMessaging] = useState(false);
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [confirmCount, setConfirmCount] = useState(0);

  const pulseId = params.pulseId;

  useEffect(() => {
    async function fetchPulse() {
      setIsLoading(true);
      try {
        const response = await fetch(`/api/pulses/${pulseId}`);
        const data = await response.json() as ApiResponse<PulseDetail>;

        if (!data.success || !data.data) {
          throw new Error(data.error || "Pulse not found");
        }

        setPulse(data.data);
        setConfirmCount(data.data.confirm_count);
      } catch (fetchError) {
        const message = fetchError instanceof Error ? fetchError.message : "Unable to load pulse";
        setError(message);
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
      setError(message);
    } finally {
      setIsConfirming(false);
    }
  };

  const handleMessageAuthor = async () => {
    if (!pulse) return;
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
      setError(message);
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

  if (error || !pulse) {
    return (
      <div className="mx-auto flex min-h-[60vh] max-w-2xl flex-col items-center justify-center text-center">
        <p className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground mb-4">Pulse unavailable</p>
        <h1 className="text-4xl font-black tracking-tighter text-foreground mb-3">This pulse could not be loaded</h1>
        <p className="max-w-lg text-sm font-medium text-muted-foreground mb-6">{error}</p>
        <Button asChild className="rounded-xl bg-primary font-bold text-primary-foreground hover:bg-primary/90">
          <Link href="/feed">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to feed
          </Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl space-y-8 pb-20">
      <div className="flex items-center justify-between gap-4">
        <Button asChild variant="ghost" className="rounded-xl px-4 text-muted-foreground hover:text-foreground">
          <Link href="/feed">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to feed
          </Link>
        </Button>
      </div>

      <section className="space-y-5">
        <p className="text-[10px] font-black uppercase tracking-[0.3em] text-primary">Pulse detail</p>
        <h1 className="text-5xl md:text-6xl font-black tracking-tighter text-foreground">{pulse.title}</h1>
      </section>

      <div className="grid gap-8 lg:grid-cols-[1.35fr_0.9fr]">
        <div className="space-y-8">
          <div className="glass rounded-[2rem] border border-border/50 bg-card/80 p-6 md:p-8 shadow-2xl shadow-black/5 backdrop-blur-xl">
            <div className="flex flex-wrap items-center gap-2 mb-5">
              <Badge className={cn("rounded-full px-3 py-1 text-[10px] font-black uppercase tracking-widest border-none", urgencyStyles[pulse.urgency])}>
                {tUrgency(pulse.urgency)}
              </Badge>
              <Badge variant="outline" className="rounded-full px-3 py-1 text-[10px] font-black uppercase tracking-widest border-border/50 text-foreground">
                {tCategories(pulse.category)}
              </Badge>
              <Badge className={cn("rounded-full px-3 py-1 text-[10px] font-black uppercase tracking-widest border-none", statusStyles[pulse.status])}>
                {pulse.status}
              </Badge>
            </div>

            <p className="whitespace-pre-wrap text-lg md:text-xl leading-relaxed text-foreground/90 font-medium">
              {pulse.description}
            </p>

            {pulse.photo_url && (
              <div className="relative mt-6 aspect-[16/9] overflow-hidden rounded-3xl border border-border/50 bg-muted/20">
                <Image src={pulse.photo_url} alt={pulse.title} fill className="object-cover" />
              </div>
            )}
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            <div className="rounded-3xl border border-border/50 bg-card/70 p-5 backdrop-blur-xl">
              <p className="mb-2 text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground">Confirmed</p>
              <p className="text-3xl font-black tracking-tighter text-foreground">{confirmCount}</p>
            </div>
            <div className="rounded-3xl border border-border/50 bg-card/70 p-5 backdrop-blur-xl">
              <p className="mb-2 text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground">Posted</p>
              <p className="flex items-center gap-2 text-sm font-semibold text-foreground/90"><Clock className="h-4 w-4 text-primary" /> {new Date(pulse.created_at).toLocaleString()}</p>
            </div>
            <div className="rounded-3xl border border-border/50 bg-card/70 p-5 backdrop-blur-xl">
              <p className="mb-2 text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground">Status</p>
              <p className="flex items-center gap-2 text-sm font-semibold text-foreground/90"><MapPin className="h-4 w-4 text-primary" /> {pulse.status}</p>
            </div>
          </div>
        </div>

        <aside className="space-y-6">
          <div className="rounded-[2rem] border border-border/50 bg-card/80 p-6 shadow-xl shadow-black/5 backdrop-blur-xl">
            <p className="mb-4 text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground">Author</p>
            <div className="flex items-start gap-4">
              <AvatarWithBadge
                src={pulse.author.avatar_url}
                fallback={pulse.author.full_name || pulse.author.username}
                isVerified={pulse.author.is_verified_neighbor}
                size="lg"
              />
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <h2 className="truncate text-xl font-black tracking-tight text-foreground">{pulse.author.full_name || pulse.author.username}</h2>
                  {pulse.author.is_verified_neighbor && <CheckCircle2 className="h-4 w-4 shrink-0 text-primary fill-primary/10" />}
                </div>
                <p className="text-sm font-medium text-muted-foreground">@{pulse.author.username}</p>
                <p className="mt-3 text-sm text-muted-foreground">Trust score {pulse.author.trust_score}</p>
              </div>
            </div>
          </div>

          <div className="rounded-[2rem] border border-border/50 bg-card/80 p-6 shadow-xl shadow-black/5 backdrop-blur-xl space-y-4">
            <Button
              onClick={handleConfirm}
              disabled={isConfirming || isConfirmed}
              className="h-12 w-full rounded-xl bg-primary font-bold text-primary-foreground hover:bg-primary/90"
            >
              {isConfirming ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <CheckCircle2 className="mr-2 h-4 w-4" />}
              {isConfirmed ? "Confirmed" : "Confirm pulse"}
            </Button>

            <Button
              variant="secondary"
              onClick={handleMessageAuthor}
              disabled={isMessaging}
              className="h-12 w-full rounded-xl font-bold"
            >
              {isMessaging ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <MessageCircle className="mr-2 h-4 w-4" />}
              Message Author
            </Button>
          </div>
        </aside>
      </div>
    </div>
  );
}
