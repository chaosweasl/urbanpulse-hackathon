"use client";

import { useState, useEffect, useCallback, useMemo, useRef } from "react";
import dynamic from "next/dynamic";
import "leaflet/dist/leaflet.css";
import { useLocation } from "@/hooks/use-location";
import { PulseWithAuthor, Resource } from "@/types";
import { useRealtime } from "@/hooks/use-realtime";
import { Button } from "@/components/ui/button";
import { Target } from "lucide-react";

// Leaflet components MUST be dynamically imported with ssr: false
const Map = dynamic(
  () => import("react-leaflet").then((mod) => mod.MapContainer),
  { ssr: false }
);
const TileLayer = dynamic(
  () => import("react-leaflet").then((mod) => mod.TileLayer),
  { ssr: false }
);
const ZoomControl = dynamic(
  () => import("react-leaflet").then((mod) => mod.ZoomControl),
  { ssr: false }
);

// Our custom sub-components also use Leaflet, so they MUST be dynamic
const HeatmapLayer = dynamic(() => import("./HeatmapLayer"), { ssr: false });
const PulseMarker = dynamic(() => import("./PulseMarker"), { ssr: false });
const ResourceMarker = dynamic(
  () => import("./PulseMarker").then((mod) => mod.ResourceMarker),
  { ssr: false }
);

function MapEventHandler({ onMoveEnd }: { onMoveEnd: (lat: number, lng: number) => void }) {
  const [useMapEvents, setUseMapEvents] = useState<any>(null);

  useEffect(() => {
    import("react-leaflet").then((mod) => {
      setUseMapEvents(() => mod.useMapEvents);
    });
  }, []);

  const EventHandler = () => {
    if (!useMapEvents) return null;
    const map = useMapEvents({
      moveend: () => {
        const center = map.getCenter();
        onMoveEnd(center.lat, center.lng);
      },
    });
    return null;
  };

  return <EventHandler />;
}

interface MapContainerProps {
  filters?: {
    category?: string;
    urgency?: string;
    showResources?: boolean;
    showHeatmap?: boolean;
  };
}

export function MapContainer({ filters }: MapContainerProps) {
  const { latitude, longitude, loading: locationLoading } = useLocation();
  const [pulses, setPulses] = useState<PulseWithAuthor[]>([]);
  const [resources, setResources] = useState<(Resource & { owner: any })[]>([]);
  const [mapInstance, setMapInstance] = useState<any>(null);
  const [currentCenter, setCurrentCenter] = useState<{ lat: number; lng: number } | null>(null);
  const hasAutoCentered = useRef(false);

  const fetchPulses = useCallback(async (lat: number, lng: number) => {
    try {
      const res = await fetch(`/api/pulses?lat=${lat}&lng=${lng}&radius=10000&per_page=100`);
      const json = await res.json();
      if (json.success && json.data?.items) {
        setPulses(json.data.items);
      }
    } catch (error) {
      console.error("Failed to fetch pulses:", error);
    }
  }, []);

  const fetchResources = useCallback(async () => {
    try {
      const res = await fetch(`/api/resources?per_page=100`);
      const json = await res.json();
      if (json.success && json.data?.items) {
        setResources(json.data.items);
      }
    } catch (error) {
      console.error("Failed to fetch resources:", error);
    }
  }, []);

  useEffect(() => {
    const lat = latitude || currentCenter?.lat || 44.4268;
    const lng = longitude || currentCenter?.lng || 26.1025;

    fetchPulses(lat, lng);
    fetchResources();
  }, [latitude, longitude, currentCenter, fetchPulses, fetchResources]);

  // Auto-center on user when location is first found
  useEffect(() => {
    if (latitude && longitude && mapInstance && !hasAutoCentered.current) {
      mapInstance.setView([latitude, longitude], 13);
      hasAutoCentered.current = true;
    }
  }, [latitude, longitude, mapInstance]);

  // Handle real-time updates
  useRealtime<PulseWithAuthor>("pulses", "*", (newPulse) => {
    setPulses((prev) => {
      const exists = prev.find((p) => p.id === newPulse.id);
      if (exists) {
        return prev.map((p) => (p.id === newPulse.id ? { ...p, ...newPulse } : p));
      }
      return [newPulse, ...prev];
    });
  });

  const heatmapPoints = useMemo(() => {
    return pulses.map((p) => {
      let intensity = 0.5;
      switch (p.urgency) {
        case "critical": intensity = 1.0; break;
        case "high": intensity = 0.8; break;
        case "medium": intensity = 0.5; break;
        case "low": intensity = 0.3; break;
      }
      return [p.location.lat, p.location.lng, intensity] as [number, number, number];
    });
  }, [pulses]);

  const filteredPulses = useMemo(() => {
    return pulses.filter((p) => {
      if (filters?.category && p.category !== filters.category) return false;
      if (filters?.urgency && p.urgency !== filters.urgency) return false;
      return true;
    });
  }, [pulses, filters]);

  const flyToUser = () => {
    if (mapInstance && latitude && longitude) {
      mapInstance.flyTo([latitude, longitude], 15);
    }
  };

  const initialCenter: [number, number] = useMemo(() => [latitude || 44.4268, longitude || 26.1025], [latitude, longitude]);

  return (
    <div className="relative h-[600px] w-full rounded-lg border overflow-hidden">
      {locationLoading && (
        <div className="absolute inset-0 z-[1000] bg-background/50 backdrop-blur-sm flex items-center justify-center">
          <div className="flex flex-col items-center gap-2 bg-background p-4 rounded-lg shadow-lg border">
            <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent"></div>
            <p className="text-xs font-medium">Finding your location...</p>
          </div>
        </div>
      )}
      <Map
        center={initialCenter}
        zoom={13}
        className="h-full w-full"
        zoomControl={false}
        // @ts-ignore
        whenReady={(e) => setMapInstance(e.target)}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <ZoomControl position="bottomright" />
        <MapEventHandler onMoveEnd={(lat, lng) => setCurrentCenter({ lat, lng })} />

        {filters?.showHeatmap && <HeatmapLayer points={heatmapPoints} />}

        {filteredPulses.map((pulse) => (
          <PulseMarker key={pulse.id} pulse={pulse} />
        ))}

        {filters?.showResources && resources.map((resource) => (
          <ResourceMarker key={resource.id} resource={resource} />
        ))}
      </Map>

      <Button
        variant="secondary"
        size="icon"
        className="absolute top-4 right-4 z-[400] shadow-md"
        onClick={flyToUser}
      >
        <Target size={20} />
      </Button>
    </div>
  );
}
