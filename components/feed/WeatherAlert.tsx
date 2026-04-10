"use client";

import { useEffect, useRef, useState } from "react";
import { useLocation } from "@/hooks/use-location";
import { useAuth } from "@/hooks/use-auth";
import { AlertTriangle, CloudLightning, Info } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { useTranslations } from "next-intl";

interface WeatherAlertData {
  event: string;
  description: string;
  start: number;
  end: number;
}

export function WeatherAlert() {
  const t = useTranslations("weather");
  const { user } = useAuth();
  const { latitude, longitude, loading: locationLoading } = useLocation();
  const [alert, setAlert] = useState<WeatherAlertData | null>(null);
  const [loading, setLoading] = useState(false);
  const lastPinnedAlertRef = useRef<string | null>(null);

  useEffect(() => {
    if (locationLoading || latitude === null || longitude === null) return;

    async function fetchWeatherData() {
      setLoading(true);
      try {
        const res = await fetch(`/api/weather?lat=${latitude}&lng=${longitude}`);
        const data = await res.json();

        if (data.success && data.data.alerts && data.data.alerts.length > 0) {
          // Find the most severe alert (keywords: storm, severe, flood, warning)
          const severe = data.data.alerts.find((a: WeatherAlertData) => {
            const ev = a.event.toLowerCase();
            return ev.includes("storm") || ev.includes("severe") || ev.includes("flood") || ev.includes("warning");
          });

          if (severe) {
            setAlert(severe);
          }
        }
      } catch (err) {
        console.error("Failed to fetch weather alert:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchWeatherData();
  }, [latitude, longitude, locationLoading]);

  useEffect(() => {
    if (!alert || !user || latitude === null || longitude === null) return;

    const alertKey = `${alert.event}:${alert.start}:${Math.round(latitude * 1000)}:${Math.round(longitude * 1000)}`;
    if (lastPinnedAlertRef.current === alertKey) return;

    lastPinnedAlertRef.current = alertKey;

    const pinSafetyCheckin = async () => {
      try {
        await fetch("/api/pulses/safety-checkin", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            lat: latitude,
            lng: longitude,
            event: alert.event,
            description: alert.description,
          }),
        });
      } catch (err) {
        console.error("Failed to create safety check-in pulse:", err);
      }
    };

    void pinSafetyCheckin();
  }, [alert, latitude, longitude, user]);

  if (loading || !alert) return null;

  return (
    <Card className="bg-blue-900 text-white border-none shadow-lg overflow-hidden animate-in fade-in slide-in-from-top-4 duration-500">
      <CardContent className="p-4 flex items-start gap-4">
        <div className="bg-blue-800 p-2 rounded-xl shrink-0">
          <CloudLightning className="size-6 text-blue-200" />
        </div>
        <div className="flex-1 space-y-1">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-lg tracking-tight flex items-center gap-2 uppercase">
              <AlertTriangle className="size-5 text-red-400" />
              {t("title")}
            </h3>
            <span className="text-xs font-medium bg-blue-800 px-2 py-0.5 rounded-full text-blue-200 uppercase tracking-wider">
              {alert.event}
            </span>
          </div>
          <p className="text-sm text-blue-100 font-medium leading-relaxed">
            {alert.description}. <span className="font-bold">{t("staySafe")}</span>
          </p>
          <div className="pt-2 flex items-center gap-2 text-xs font-bold text-blue-300">
             <Info className="size-4" />
             {t("consideration")}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
