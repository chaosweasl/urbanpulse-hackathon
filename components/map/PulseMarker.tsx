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

const getCategoryColor = (category: string) => {
  switch (category) {
    case "emergency": return "bg-red-500";
    case "skill": return "bg-blue-500";
    case "item": return "bg-green-500";
    default: return "bg-gray-500";
  }
};

const getUrgencySize = (urgency: string) => {
  switch (urgency) {
    case "low": return 12;
    case "medium": return 16;
    case "high": return 20;
    case "critical": return 24;
    default: return 16;
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
      <div class="absolute inline-flex h-full w-full animate-ping rounded-full ${color} opacity-75"></div>
      <div class="relative inline-flex rounded-full ${color}" style="width: ${size}px; height: ${size}px; border: 2px solid white;"></div>
    </div>`,
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
  });

  return (
    <Marker position={[pulse.location.lat, pulse.location.lng]} icon={icon}>
      <Popup className="pulse-popup">
        <div className="p-1 max-w-[200px]">
          <div className="flex items-center justify-between mb-2">
            <Badge variant={pulse.urgency === "critical" ? "destructive" : "secondary"} className="capitalize text-[10px]">
              {pulse.urgency}
            </Badge>
            <span className="text-[10px] text-muted-foreground">{pulse.category}</span>
          </div>
          <h3 className="font-bold text-sm mb-1 leading-tight">{pulse.title}</h3>
          <p className="text-xs text-muted-foreground line-clamp-2 mb-3">
            {pulse.description}
          </p>
          <div className="flex items-center gap-2 mb-3">
            <div className="w-5 h-5 rounded-full bg-muted flex-shrink-0" />
            <span className="text-[10px] font-medium truncate">@{pulse.author.username}</span>
          </div>
          <Button asChild size="sm" className="w-full h-8 text-xs">
            <Link href={`/feed/${pulse.id}`}>View / Help</Link>
          </Button>
        </div>
      </Popup>
    </Marker>
  );
}

interface ResourceMarkerProps {
  resource: Resource & { owner: any };
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

  const color = resource.type === "skill" ? "bg-purple-500" : "bg-orange-500";
  const size = 14;

  const icon = L.divIcon({
    className: "custom-resource-marker",
    html: `<div class="relative flex items-center justify-center">
      <div class="relative inline-flex rounded-full ${color}" style="width: ${size}px; height: ${size}px; border: 2px solid white;"></div>
    </div>`,
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
  });

  return (
    <Marker position={[resource.location.lat, resource.location.lng]} icon={icon}>
      <Popup>
        <div className="p-1 max-w-[200px]">
          <div className="flex items-center justify-between mb-2">
            <Badge variant="outline" className="capitalize text-[10px]">
              {resource.type}
            </Badge>
            <span className="text-[10px] text-muted-foreground">{resource.status}</span>
          </div>
          <h3 className="font-bold text-sm mb-1 leading-tight">{resource.name}</h3>
          <p className="text-xs text-muted-foreground line-clamp-2 mb-3">
            {resource.description}
          </p>
          <Button asChild size="sm" className="w-full h-8 text-xs" variant="secondary">
            <Link href={`/resources/${resource.id}`}>Borrow / Request</Link>
          </Button>
        </div>
      </Popup>
    </Marker>
  );
}
