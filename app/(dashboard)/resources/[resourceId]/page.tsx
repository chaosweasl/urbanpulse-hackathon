"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Clock, Loader2, MessageCircle, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AvatarWithBadge } from "@/components/shared/AvatarWithBadge";
import { cn } from "@/lib/utils";
import type { ResourceStatus, ResourceType } from "@/types";
import { useTranslations } from "next-intl";

interface ResourceOwner {
  id: string;
  username: string;
  full_name: string | null;
  avatar_url: string | null;
  trust_score: number;
  is_verified_neighbor: boolean;
}

interface ResourceDetail {
  id: string;
  name: string;
  type: ResourceType;
  description: string | null;
  tags: string[];
  status: ResourceStatus;
  created_at: string;
  updated_at: string;
  owner_id: string;
  owner: ResourceOwner;
}

interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

const statusStyles: Record<ResourceStatus, string> = {
  available: "bg-emerald-500/10 text-emerald-400",
  lent_out: "bg-amber-500/10 text-amber-400",
  unavailable: "bg-muted text-muted-foreground",
};

const statusLabels: Record<ResourceStatus, "available" | "lentOut" | "unavailable"> = {
  available: "available",
  lent_out: "lentOut",
  unavailable: "unavailable",
};

export default function ResourceDetailPage() {
  const t = useTranslations("ResourceDetailPage");
  const params = useParams<{ resourceId: string }>();
  const router = useRouter();
  const [resource, setResource] = useState<ResourceDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isRequesting, setIsRequesting] = useState(false);

  const resourceId = params.resourceId;

  useEffect(() => {
    async function fetchResource() {
      setIsLoading(true);
      try {
        const response = await fetch(`/api/resources/${resourceId}`);
        const data = await response.json() as ApiResponse<ResourceDetail>;

        if (!data.success || !data.data) {
          throw new Error(data.error || t("resourceNotFound"));
        }

        setResource(data.data);
      } catch (fetchError) {
        const message = fetchError instanceof Error ? fetchError.message : t("unableToLoad");
        setError(message);
      } finally {
        setIsLoading(false);
      }
    }

    if (resourceId) {
      void fetchResource();
    }
  }, [resourceId]);

  const handleBorrowRequest = async () => {
    if (!resource) return;
    setIsRequesting(true);
    try {
      const response = await fetch("/api/conversations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          recipient_id: resource.owner.id,
          resource_id: resource.id,
        }),
      });
      const data = await response.json() as ApiResponse<{ id: string }>;

      if (!data.success || !data.data) {
        throw new Error(data.error || t("failedToStartConversation"));
      }

      router.push(`/messages/${data.data.id}`);
    } catch (requestError) {
      const message = requestError instanceof Error ? requestError.message : t("failedToStartConversation");
      setError(message);
    } finally {
      setIsRequesting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
      </div>
    );
  }

  if (error || !resource) {
    return (
      <div className="mx-auto flex min-h-[60vh] max-w-2xl flex-col items-center justify-center text-center">
        <p className="mb-4 text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground">{t("unavailableBadge")}</p>
        <h1 className="mb-3 text-4xl font-black tracking-tighter text-foreground">{t("unavailableTitle")}</h1>
        <p className="mb-6 max-w-lg text-sm font-medium text-muted-foreground">{error}</p>
        <Button asChild className="rounded-xl bg-primary font-bold text-primary-foreground hover:bg-primary/90">
          <Link href="/resources">
            <ArrowLeft className="mr-2 h-4 w-4" /> {t("backToResources")}
          </Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl space-y-8 pb-20">
      <div className="flex items-center justify-between gap-4">
        <Button asChild variant="ghost" className="rounded-xl px-4 text-muted-foreground hover:text-foreground">
          <Link href="/resources">
            <ArrowLeft className="mr-2 h-4 w-4" /> {t("backToResources")}
          </Link>
        </Button>
      </div>

      <section className="space-y-5">
        <p className="text-[10px] font-black uppercase tracking-[0.3em] text-primary">{t("detailBadge")}</p>
        <h1 className="text-5xl font-black tracking-tighter text-foreground md:text-6xl">{resource.name}</h1>
      </section>

      <div className="grid gap-8 lg:grid-cols-[1.35fr_0.9fr]">
        <div className="space-y-8">
          <div className="glass rounded-[2rem] border border-border/50 bg-card/80 p-6 shadow-2xl shadow-black/5 backdrop-blur-xl md:p-8">
            <div className="mb-5 flex flex-wrap items-center gap-2">
              <Badge variant="outline" className="rounded-full border-border/50 px-3 py-1 text-[10px] font-black uppercase tracking-widest text-foreground">
                {resource.type === "item" ? t("item") : t("skill")}
              </Badge>
              <Badge className={cn("rounded-full border-none px-3 py-1 text-[10px] font-black uppercase tracking-widest", statusStyles[resource.status])}>
                {t(`status.${statusLabels[resource.status]}`)}
              </Badge>
            </div>

            <p className="whitespace-pre-wrap text-lg font-medium leading-relaxed text-foreground/90 md:text-xl">
              {resource.description || t("noDescription")}
            </p>

            {resource.tags.length > 0 && (
              <div className="mt-6 flex flex-wrap gap-2">
                {resource.tags.map((tag) => (
                  <Badge key={tag} variant="secondary" className="rounded-full bg-muted px-3 py-1 text-xs font-bold text-foreground">
                    {tag}
                  </Badge>
                ))}
              </div>
            )}
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-3xl border border-border/50 bg-card/70 p-5 backdrop-blur-xl">
              <p className="mb-2 text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground">{t("listed")}</p>
              <p className="flex items-center gap-2 text-sm font-semibold text-foreground/90"><Clock className="h-4 w-4 text-primary" /> {new Date(resource.created_at).toLocaleString()}</p>
            </div>
            <div className="rounded-3xl border border-border/50 bg-card/70 p-5 backdrop-blur-xl">
              <p className="mb-2 text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground">{t("availability")}</p>
              <p className="flex items-center gap-2 text-sm font-semibold text-foreground/90"><ShieldCheck className="h-4 w-4 text-primary" /> {t(`status.${statusLabels[resource.status]}`)}</p>
            </div>
          </div>
        </div>

        <aside className="space-y-6">
          <div className="rounded-[2rem] border border-border/50 bg-card/80 p-6 shadow-xl shadow-black/5 backdrop-blur-xl">
            <p className="mb-4 text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground">{t("owner")}</p>
            <div className="flex items-start gap-4">
              <AvatarWithBadge
                src={resource.owner.avatar_url}
                fallback={resource.owner.full_name || resource.owner.username}
                isVerified={resource.owner.is_verified_neighbor}
                size="lg"
              />
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <h2 className="truncate text-xl font-black tracking-tight text-foreground">{resource.owner.full_name || resource.owner.username}</h2>
                  {resource.owner.is_verified_neighbor && <ShieldCheck className="h-4 w-4 shrink-0 text-primary" />}
                </div>
                <p className="text-sm font-medium text-muted-foreground">@{resource.owner.username}</p>
                <p className="mt-3 text-sm text-muted-foreground">{t("trustScore", { score: resource.owner.trust_score })}</p>
              </div>
            </div>
          </div>

          <div className="rounded-[2rem] border border-border/50 bg-card/80 p-6 shadow-xl shadow-black/5 backdrop-blur-xl space-y-4">
            <Button
              onClick={handleBorrowRequest}
              disabled={isRequesting}
              className="h-12 w-full rounded-xl bg-primary font-bold text-primary-foreground hover:bg-primary/90"
            >
              {isRequesting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <MessageCircle className="mr-2 h-4 w-4" />}
              {isRequesting ? t("requesting") : t("requestBorrow")}
            </Button>
          </div>
        </aside>
      </div>
    </div>
  );
}
