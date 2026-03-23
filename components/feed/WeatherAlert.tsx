"use client";

import { useEffect, useState } from "react";
import type { WeatherData } from "@/types";
import { AlertCircle, CloudRain, Thermometer, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { useTranslations } from "next-intl";

export function WeatherAlert() {
  const t = useTranslations("HomePage");
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    async function fetchWeather() {
      try {
        const res = await fetch("/api/weather");
        const json = await res.json();
        if (json.success) setWeather(json.data);
      } catch (error) {
        console.error("Failed to fetch weather:", error);
      }
    }
    fetchWeather();
  }, []);

  if (!weather || !visible) return null;

  const hasAlert = weather.alerts && weather.alerts.length > 0;

  return (
    <div
      className={cn(
        "relative w-full rounded-2xl p-4 mb-6 border transition-all animate-in fade-in slide-in-from-top-2",
        hasAlert
          ? "bg-destructive/10 border-destructive/20 text-destructive"
          : "bg-primary/5 border-primary/10 text-primary"
      )}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex gap-3">
          <div className="mt-1">
            {hasAlert ? <AlertCircle className="size-5" /> : <CloudRain className="size-5" />}
          </div>
          <div>
            <p className="font-bold leading-none mb-1">
              {hasAlert ? weather.alerts[0].event : t("title")}
            </p>
            <p className="text-sm opacity-90">
              {hasAlert ? weather.alerts[0].description : `${weather.temperature}°C • ${weather.description}`}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4 text-xs font-medium shrink-0">
          <div className="hidden sm:flex items-center gap-1">
            <Thermometer size={14} />
            {weather.temperature}°C
          </div>
          <button
            onClick={() => setVisible(false)}
            className="p-1 hover:bg-black/5 rounded-full transition-colors"
          >
            <X size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
