"use client";

import { useEffect, useState } from "react";
import L from "leaflet";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { PulseWithAuthor, Resource } from "@/types";

interface PulseMarkerProps {
  pulse: PulseWithAuthor;
}

// Using OKLCH-based colors that match the theme
const getCategoryColor = (category: string) => {
  switch (category) {
    case "emergency": return "#ff4d4d"; // Vibrant Red
    case "skill": return "#00f2ff";     // Pulse Cyan
    case "item": return "#00ff88";      // Pulse Green
    default: return "#94a3b8";
  }
};

const getUrgencySize = (urgency: string) => {
  switch (urgency) {
    case "low": return 14;
    case "medium": return 18;
    case "high": return 24;
    case "critical": return 30;
    default: return 18;
  }
};

export default function PulseMarker({ pulse }: PulseMarkerProps) {
  const [RL, setRL] = useState<any>(null);

  useEffect(() => {
    import("react-leaflet").then((mod) => {
      setRL(mod);
    });
  }, []);

  if (!RL) return null;
  const { Marker, Popup } = RL;

  const size = getUrgencySize(pulse.urgency);
  const color = getCategoryColor(pulse.category);

  const icon = L.divIcon({
    className: "custom-pulse-marker",
    html: `<div class="relative flex items-center justify-center">
      <div class="absolute inline-flex h-full w-full animate-ping rounded-full opacity-40" style="background-color: ${color}"></div>
      <div class="relative inline-flex rounded-full shadow-[0_0_15px_rgba(0,0,0,0.5)]" style="width: ${size}px; height: ${size}px; background-color: ${color}; border: 2.5px solid #050B14;"></div>
    </div>`,
    iconSize: [size * 2, size * 2],
    iconAnchor: [size, size],
  });

  return (
    <Marker position={[pulse.location.lat, pulse.location.lng]} icon={icon}>
      <Popup className="pulse-popup">
        <div className="p-2 min-w-[220px] bg-background text-foreground border-none">
          <div className="flex items-center justify-between mb-3">
            <Badge
              variant={pulse.urgency === "critical" ? "destructive" : "secondary"}
              className="capitalize text-[9px] font-black tracking-widest px-2 py-0.5 rounded-md"
            >
              {pulse.urgency}
            </Badge>
            <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-tighter">{pulse.category}</span>
          </div>
          <h3 className="font-black text-base mb-1.5 leading-tight tracking-tight">{pulse.title}</h3>
          <p className="text-xs text-muted-foreground line-clamp-2 mb-4 leading-relaxed">
            {pulse.description}
          </p>
          <div className="flex items-center gap-2.5 mb-4 p-2 rounded-xl bg-muted/30 border border-border/50">
            <div className="w-6 h-6 rounded-full bg-primary/20 flex-shrink-0 flex items-center justify-center text-[10px] font-bold text-primary">
              {pulse.author.username.slice(0,1).toUpperCase()}
            </div>
            <span className="text-[11px] font-bold truncate">@{pulse.author.username}</span>
          </div>
          <Button asChild size="sm" className="w-full h-9 text-xs font-black rounded-xl">
            <Link href={`/feed/${pulse.id}`}>View Post</Link>
          </Button>
        </div>
      </Popup>
    </Marker>
  );
}

interface ResourceMarkerProps {
  resource: Resource & { owner: Record<string, unknown> };
}

export function ResourceMarker({ resource }: ResourceMarkerProps) {
  const [RL, setRL] = useState<any>(null);

  useEffect(() => {
    import("react-leaflet").then((mod) => {
      setRL(mod);
    });
  }, []);

  if (!RL || !resource.location) return null;
  const { Marker, Popup } = RL;

  const color = resource.type === "skill" ? "#a855f7" : "#f97316"; // Purple vs Orange
  const size = 14;

  const icon = L.divIcon({
    className: "custom-resource-marker",
    html: `<div class="relative flex items-center justify-center">
      <div class="relative inline-flex rounded-full shadow-[0_0_10px_rgba(0,0,0,0.3)]" style="width: ${size}px; height: ${size}px; background-color: ${color}; border: 2px solid #050B14;"></div>
    </div>`,
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
  });

  return (
    <Marker position={[resource.location.lat, resource.location.lng]} icon={icon}>
      <Popup className="resource-popup">
        <div className="p-2 min-w-[200px] bg-background text-foreground border-none">
          <div className="flex items-center justify-between mb-3">
            <Badge variant="outline" className="capitalize text-[9px] font-black tracking-widest px-2 py-0.5 rounded-md border-primary/30">
              {resource.type}
            </Badge>
            <span className="text-[10px] font-bold text-primary uppercase">{resource.status}</span>
          </div>
          <h3 className="font-black text-sm mb-1.5 leading-tight tracking-tight">{resource.name}</h3>
          <p className="text-xs text-muted-foreground line-clamp-2 mb-4 leading-relaxed">
            {resource.description}
          </p>
          <Button asChild size="sm" className="w-full h-9 text-xs font-black rounded-xl" variant="secondary">
            <Link href={`/resources/${resource.id}`}>Borrow / Request</Link>
          </Button>
        </div>
      </Popup>
    </Marker>
  );
}
