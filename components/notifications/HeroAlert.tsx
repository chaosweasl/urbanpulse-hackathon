"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { X, Check, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { useRealtime } from "@/hooks/use-realtime";
import type { Notification } from "@/types";

/**
 * HeroAlert — prominent alert for smart-matched requests.
 * Displays a soft themed banner with a bold gold title when a 'hero_alert' notification is received.
 */
export function HeroAlert() {
  const [activeAlert, setActiveAlert] = useState<Notification | null>(null);
  const router = useRouter();

  // Listen for new notifications and show if it's a hero_alert
  const handleNewNotification = useCallback((payload: Record<string, unknown>) => {
    const notification = payload as unknown as Notification;
    if (notification.type === "hero_alert") {
      setActiveAlert(notification);
    }
  }, []);

  useRealtime("notifications", "INSERT", handleNewNotification);

  if (!activeAlert) return null;

  const handleAccept = async () => {
    if (!activeAlert) return;
    try {
      await fetch("/api/notifications", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ notificationIds: [activeAlert.id] }),
      });

      if (activeAlert.action_url) {
        router.push(activeAlert.action_url);
      }
    } catch (error) {
      console.error("Failed to accept hero alert:", error);
    } finally {
      setActiveAlert(null);
    }
  };

  const handleDecline = async () => {
    if (!activeAlert) return;
    try {
      await fetch("/api/notifications", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ notificationIds: [activeAlert.id] }),
      });
    } catch (error) {
      console.error("Failed to decline hero alert:", error);
    } finally {
      setActiveAlert(null);
    }
  };

  return (
    <div
      className={cn(
        "mb-6 w-full rounded-lg border border-primary/20 p-6 transition-all animate-in fade-in slide-in-from-top-4 duration-500",
        "bg-primary/10 border-primary/20 flex flex-col sm:flex-row items-center justify-between gap-6"
      )}
    >
      <div className="flex gap-4 items-start">
        <div className="rounded-lg bg-primary/20 p-3">
          <AlertCircle className="text-primary size-6" />
        </div>
        <div>
          <h2 className="mb-1 text-xl font-bold tracking-tight text-amber-500">
            HERO ALERT
          </h2>
          <p className="font-semibold text-foreground text-lg leading-tight">
            {activeAlert.title}
          </p>
          <p className="text-muted-foreground mt-1 max-w-2xl">
            {activeAlert.body}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-3 shrink-0">
        <Button
          size="lg"
          className="rounded-lg bg-green-600 px-8 font-bold text-white transition-colors hover:bg-green-700"
          onClick={handleAccept}
        >
          <Check className="w-5 h-5 mr-2" />
          Help
        </Button>

        <Button
          size="lg"
          className="rounded-lg bg-red-600 px-8 font-bold text-white transition-colors hover:bg-red-700"
          onClick={handleDecline}
        >
          <X className="w-5 h-5 mr-2" />
          Ignore
        </Button>

        <button
          onClick={() => setActiveAlert(null)}
          className="ml-4 rounded-md p-2 text-zinc-400 transition-colors hover:bg-zinc-800 hover:text-zinc-200"
          aria-label="Dismiss"
        >
          <X size={24} />
        </button>
      </div>
    </div>
  );
}
