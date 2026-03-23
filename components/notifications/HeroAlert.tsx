"use client";

import { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { X, Check, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { useRealtime } from "@/hooks/use-realtime";
import type { Notification } from "@/types";

/**
 * HeroAlert — prominent alert for smart-matched requests.
 * Displays a soft blue banner with a bold gold title when a 'hero_alert' notification is received.
 */
export function HeroAlert() {
  const [activeAlert, setActiveAlert] = useState<Notification | null>(null);

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
      // Logic for accepting the request could go here, e.g., calling an API
      // For now, we just dismiss the alert
      setActiveAlert(null);
    } catch (error) {
      console.error("Failed to accept hero alert:", error);
    }
  };

  const handleDecline = async () => {
    if (!activeAlert) return;
    try {
      // Logic for declining the request could go here
      setActiveAlert(null);
    } catch (error) {
      console.error("Failed to decline hero alert:", error);
    }
  };

  return (
    <div
      className={cn(
        "w-full rounded-2xl p-6 mb-6 shadow-xl border-2 transition-all animate-in fade-in slide-in-from-top-4 duration-500",
        "bg-blue-50 border-blue-100 flex flex-col sm:flex-row items-center justify-between gap-6"
      )}
    >
      {/* LEFT CONTENT */}
      <div className="flex gap-4 items-start">
        <div className="bg-blue-100 p-3 rounded-full">
          <AlertCircle className="text-blue-600 size-6" />
        </div>
        <div>
          <h2 className="font-black text-xl tracking-tighter text-amber-500 mb-1">
            HERO ALERT
          </h2>
          <p className="font-semibold text-blue-900 text-lg leading-tight">
            {activeAlert.title}
          </p>
          <p className="text-blue-700 mt-1 max-w-2xl">
            {activeAlert.body}
          </p>
        </div>
      </div>

      {/* RIGHT ACTIONS */}
      <div className="flex items-center gap-3 shrink-0">
        <Button
          size="lg"
          className="bg-green-600 hover:bg-green-700 text-white font-bold px-8 rounded-xl shadow-md hover:shadow-lg transition-all"
          onClick={handleAccept}
        >
          <Check className="w-5 h-5 mr-2" />
          Help
        </Button>

        <Button
          size="lg"
          variant="outline"
          className="bg-red-50 border-red-200 text-red-600 hover:bg-red-100 hover:text-red-700 font-bold px-8 rounded-xl"
          onClick={handleDecline}
        >
          <X className="w-5 h-5 mr-2" />
          Ignore
        </Button>

        <button
          onClick={() => setActiveAlert(null)}
          className="ml-4 p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
          aria-label="Dismiss"
        >
          <X size={24} />
        </button>
      </div>
    </div>
  );
}
