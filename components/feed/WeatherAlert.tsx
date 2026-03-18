"use client";

import { useEffect, useState } from "react";
import { useLocation } from "@/hooks/use-location";
import { AlertCircleIcon, CloudAlertIcon, InformationCircleIcon } from "@hugeicons/react";
import { Card, CardContent } from "@/components/ui/card";

interface WeatherAlertData {
  event: string;
  description: string;
  start: number;
  end: number;
}

export function WeatherAlert() {
  const { latitude, longitude, loading: locationLoading } = useLocation();
  const [alert, setAlert] = useState<WeatherAlertData | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (locationLoading || !latitude || !longitude) return;

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

  if (loading || !alert) return null;

  return (
    <Card className="bg-blue-900 text-white border-none shadow-lg overflow-hidden animate-in fade-in slide-in-from-top-4 duration-500">
      <CardContent className="p-4 flex items-start gap-4">
        <div className="bg-blue-800 p-2 rounded-xl shrink-0">
          <CloudAlertIcon className="size-6 text-blue-200" />
        </div>
        <div className="flex-1 space-y-1">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-lg tracking-tight flex items-center gap-2 uppercase">
              <AlertCircleIcon className="size-5 text-red-400" />
              Severe Weather Alert
            </h3>
            <span className="text-xs font-medium bg-blue-800 px-2 py-0.5 rounded-full text-blue-200 uppercase tracking-wider">
              {alert.event}
            </span>
          </div>
          <p className="text-sm text-blue-100 font-medium leading-relaxed">
            {alert.description}. <span className="font-bold">Please stay safe, take necessary precautions, and look out for your neighbors.</span>
          </p>
          <div className="pt-2 flex items-center gap-2 text-xs font-bold text-blue-300">
             <InformationCircleIcon className="size-4" />
             Take this into consideration for your planned activities.
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
