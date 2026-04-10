"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Loader2, Package, CheckCircle2, XCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { useTranslations } from "next-intl";

interface InteractionWithDetails {
  id: string;
  status: string;
  created_at: string;
  resource: { name: string; type: string };
  requester: { id: string; username: string };
  provider: { id: string; username: string };
  feedback: string | null;
}

export default function InteractionsPage() {
  const t = useTranslations("InteractionsPage");
  const { user } = useAuth();
  const [interactions, setInteractions] = useState<InteractionWithDetails[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"all" | "requester" | "provider">("all");
  const [pendingInteractionId, setPendingInteractionId] = useState<string | null>(null);

  useEffect(() => {
    async function fetchInteractions() {
      setIsLoading(true);
      try {
        const res = await fetch(activeTab === "all" ? "/api/interactions" : `/api/interactions?role=${activeTab}`);
        const data = await res.json();
        if (data.success) setInteractions(data.data || []);
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    }
    fetchInteractions();
  }, [activeTab]);

  const handleAction = async (id: string, status: string, feedback?: "positive" | "neutral" | "negative") => {
    setPendingInteractionId(id);
    try {
      const response = await fetch(`/api/interactions/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(feedback ? { status, feedback } : { status }),
      });

      const data = await response.json();
      if (!data.success) {
        throw new Error(data.error || t("errors.update"));
      }

      setInteractions((prev) =>
        prev.map((i) =>
          i.id === id
            ? {
                ...i,
                status,
                feedback: feedback || i.feedback,
              }
            : i
        )
      );
    } catch (error) {
      console.error("Failed to update interaction:", error);
    } finally {
      setPendingInteractionId(null);
    }
  };

  const statusColors: Record<string, string> = {
    pending: "bg-amber-500/10 text-amber-400",
    accepted: "bg-emerald-500/10 text-emerald-400",
    completed: "bg-primary/10 text-primary",
    declined: "bg-destructive/10 text-destructive",
    cancelled: "bg-muted text-muted-foreground",
  };

  const statusLabels: Record<string, string> = {
    pending: t("status.pending"),
    accepted: t("status.accepted"),
    completed: t("status.completed"),
    declined: t("status.declined"),
    cancelled: t("status.cancelled"),
  };

  return (
    <div className="mx-auto max-w-4xl space-y-8 pb-20">
      <div className="mb-8">
        <p className="mb-1 text-xs uppercase tracking-widest text-zinc-500">{t("badge")}</p>
        <h1 className="text-3xl font-bold tracking-tight md:text-4xl">{t("title")}</h1>
      </div>

      <div className="flex w-full flex-wrap rounded-lg border border-white/8 bg-zinc-900 p-1 md:w-fit md:flex-nowrap">
        {(["all", "requester", "provider"] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={cn(
              "min-w-[7rem] flex-1 rounded-lg px-4 py-2 text-xs font-medium uppercase tracking-wider transition-colors md:min-w-0 md:flex-none",
              activeTab === tab ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"
            )}
          >
            {t(`tabs.${tab}`)}
          </button>
        ))}
      </div>

      {isLoading ? (
        <div className="flex justify-center p-12"><Loader2 className="animate-spin text-primary h-8 w-8" /></div>
      ) : interactions.length === 0 ? (
        <div className="rounded-lg border border-dashed border-white/20 py-20 text-center">
          <Package size={40} className="mx-auto text-muted-foreground mb-4" />
          <p className="mb-1 font-bold text-foreground">{t("emptyTitle")}</p>
          <p className="mb-4 text-sm text-muted-foreground">{t("emptyDescription")}</p>
          <Button asChild variant="outline" className="rounded-lg">
            <Link href="/resources">{t("browseResources")}</Link>
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          {interactions.map((interaction) => {
            const isProvider = interaction.provider?.id === user?.id;
            return (
              <div key={interaction.id} className="space-y-3 rounded-lg border border-white/8 bg-zinc-900 p-5">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex items-center gap-3">
                    <div className="rounded-lg bg-zinc-800 p-2"><Package size={16} className="text-primary" /></div>
                    <div>
                      <p className="font-bold">{interaction.resource?.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {isProvider
                          ? t("requestedBy", { username: interaction.requester?.username || t("unknownUser") })
                          : t("fromUser", { username: interaction.provider?.username || t("unknownUser") })}
                      </p>
                      <p className="text-[11px] uppercase tracking-wider text-zinc-500">
                        {interaction.resource?.type || "resource"} · {new Date(interaction.created_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <Badge className={cn("text-xs font-medium uppercase tracking-wider", statusColors[interaction.status] || "bg-muted text-muted-foreground")}>{statusLabels[interaction.status] || interaction.status}</Badge>
                </div>

                {interaction.status === "pending" && isProvider && (
                  <div className="flex flex-wrap gap-2 pt-2">
                    <Button
                      size="sm"
                      className="flex-1 rounded-lg bg-emerald-600 font-bold text-white hover:bg-emerald-700 sm:flex-none"
                      onClick={() => handleAction(interaction.id, "accepted")}
                      disabled={pendingInteractionId === interaction.id}
                    >
                      {pendingInteractionId === interaction.id ? <Loader2 size={14} className="mr-1 animate-spin" /> : <CheckCircle2 size={14} className="mr-1" />} {t("actions.accept")}
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      className="flex-1 rounded-lg font-bold sm:flex-none"
                      onClick={() => handleAction(interaction.id, "declined")}
                      disabled={pendingInteractionId === interaction.id}
                    >
                      {pendingInteractionId === interaction.id ? <Loader2 size={14} className="mr-1 animate-spin" /> : <XCircle size={14} className="mr-1" />} {t("actions.decline")}
                    </Button>
                  </div>
                )}

                {interaction.status === "accepted" && (
                  <div className="flex flex-wrap gap-2 pt-2">
                    <Button size="sm" variant="outline" className="flex-1 rounded-lg font-bold sm:flex-none" onClick={() => handleAction(interaction.id, "completed", "positive")} disabled={pendingInteractionId === interaction.id}>
                      {pendingInteractionId === interaction.id ? <Loader2 size={14} className="mr-1 animate-spin" /> : "👍"} {t("actions.positive")}
                    </Button>
                    <Button size="sm" variant="outline" className="flex-1 rounded-lg font-bold sm:flex-none" onClick={() => handleAction(interaction.id, "completed", "neutral")} disabled={pendingInteractionId === interaction.id}>
                      {pendingInteractionId === interaction.id ? <Loader2 size={14} className="mr-1 animate-spin" /> : "😐"} {t("actions.neutral")}
                    </Button>
                    <Button size="sm" variant="outline" className="flex-1 rounded-lg font-bold sm:flex-none" onClick={() => handleAction(interaction.id, "completed", "negative")} disabled={pendingInteractionId === interaction.id}>
                      {pendingInteractionId === interaction.id ? <Loader2 size={14} className="mr-1 animate-spin" /> : "👎"} {t("actions.negative")}
                    </Button>
                  </div>
                )}

                {interaction.status === "completed" && (
                  <div className="pt-2">
                    <Badge className="rounded-md border border-white/8 bg-zinc-800 px-3 py-1 text-xs font-medium uppercase tracking-wider text-primary">{t("completed")} ✓</Badge>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}