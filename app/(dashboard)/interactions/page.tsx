"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Loader2, Package, CheckCircle2, XCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";

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
        throw new Error(data.error || "Failed to update interaction");
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

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-20">
      <div className="mb-8">
        <p className="mb-1 text-xs uppercase tracking-widest text-zinc-500">My Activity</p>
        <h1 className="text-3xl font-bold tracking-tight md:text-4xl">Interactions</h1>
      </div>

      <div className="flex w-fit rounded-lg border border-white/8 bg-zinc-900 p-1">
        {(["all", "requester", "provider"] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={cn(
              "rounded-lg px-5 py-2 text-xs font-medium uppercase tracking-wider transition-colors capitalize",
              activeTab === tab ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"
            )}
          >
            {tab === "requester" ? "Requested" : tab === "provider" ? "My Resources" : "All"}
          </button>
        ))}
      </div>

      {isLoading ? (
        <div className="flex justify-center p-12"><Loader2 className="animate-spin text-primary h-8 w-8" /></div>
      ) : interactions.length === 0 ? (
        <div className="rounded-lg border border-dashed border-white/20 py-20 text-center">
          <Package size={40} className="mx-auto text-muted-foreground mb-4" />
          <p className="font-bold text-foreground mb-1">No interactions yet</p>
          <p className="text-sm text-muted-foreground">Borrow something from the <Link href="/resources" className="text-primary underline font-bold">resource library</Link> to get started.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {interactions.map((interaction) => {
            const isProvider = interaction.provider?.id === user?.id;
            return (
              <div key={interaction.id} className="space-y-3 rounded-lg border border-white/8 bg-zinc-900 p-5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="rounded-lg bg-zinc-800 p-2"><Package size={16} className="text-primary" /></div>
                    <div>
                      <p className="font-bold">{interaction.resource?.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {isProvider ? `Requested by @${interaction.requester?.username}` : `From @${interaction.provider?.username}`}
                      </p>
                    </div>
                  </div>
                  <Badge className={cn("text-xs font-medium uppercase tracking-wider", statusColors[interaction.status] || "bg-muted text-muted-foreground")}>{interaction.status}</Badge>
                </div>

                {interaction.status === "pending" && isProvider && (
                  <div className="flex gap-2 pt-2">
                    <Button
                      size="sm"
                      className="rounded-xl font-bold bg-emerald-600 hover:bg-emerald-700 text-white"
                      onClick={() => handleAction(interaction.id, "accepted")}
                      disabled={pendingInteractionId === interaction.id}
                    >
                      {pendingInteractionId === interaction.id ? <Loader2 size={14} className="mr-1 animate-spin" /> : <CheckCircle2 size={14} className="mr-1" />} Accept
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      className="rounded-xl font-bold"
                      onClick={() => handleAction(interaction.id, "declined")}
                      disabled={pendingInteractionId === interaction.id}
                    >
                      {pendingInteractionId === interaction.id ? <Loader2 size={14} className="mr-1 animate-spin" /> : <XCircle size={14} className="mr-1" />} Decline
                    </Button>
                  </div>
                )}

                {interaction.status === "accepted" && (
                  <div className="flex gap-2 pt-2">
                    <Button size="sm" variant="outline" className="rounded-xl font-bold" onClick={() => handleAction(interaction.id, "completed", "positive")} disabled={pendingInteractionId === interaction.id}>
                      {pendingInteractionId === interaction.id ? <Loader2 size={14} className="mr-1 animate-spin" /> : "👍"} Positive
                    </Button>
                    <Button size="sm" variant="outline" className="rounded-xl font-bold" onClick={() => handleAction(interaction.id, "completed", "neutral")} disabled={pendingInteractionId === interaction.id}>
                      {pendingInteractionId === interaction.id ? <Loader2 size={14} className="mr-1 animate-spin" /> : "😐"} Neutral
                    </Button>
                    <Button size="sm" variant="outline" className="rounded-xl font-bold" onClick={() => handleAction(interaction.id, "completed", "negative")} disabled={pendingInteractionId === interaction.id}>
                      {pendingInteractionId === interaction.id ? <Loader2 size={14} className="mr-1 animate-spin" /> : "👎"} Negative
                    </Button>
                  </div>
                )}

                {interaction.status === "completed" && (
                  <div className="pt-2">
                    <Badge className="rounded-md border border-white/8 bg-zinc-800 px-3 py-1 text-xs font-medium uppercase tracking-wider text-primary">Completed ✓</Badge>
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