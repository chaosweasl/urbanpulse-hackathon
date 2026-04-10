"use client";

import { useState, useEffect, useCallback, useMemo, useRef } from "react";
import dynamic from "next/dynamic";
import "leaflet/dist/leaflet.css";
import { useLocation } from "@/hooks/use-location";
import { PulseWithAuthor, Resource } from "@/types";
import { useRealtime } from "@/hooks/use-realtime";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Target } from "lucide-react";
import { useMap, useMapEvents } from "react-leaflet";

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
  useMapEvents({
    moveend(event) {
      const center = event.target.getCenter();
      onMoveEnd(center.lat, center.lng);
    },
  });

  return null;
}

function MapRefCapture({ onReady }: { onReady: (map: any) => void }) {
  const map = useMap();

  useEffect(() => {
    onReady(map);
  }, [map, onReady]);

  return null;
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
  const { latitude, longitude, loading: locationLoading, error: locationError } = useLocation();
  const [pulses, setPulses] = useState<PulseWithAuthor[]>([]);
  const [resources, setResources] = useState<(Resource & { owner: any })[]>([]);
  const [mapInstance, setMapInstance] = useState<any>(null);
  const [currentCenter, setCurrentCenter] = useState<{ lat: number; lng: number } | null>(null);
  const [manualLat, setManualLat] = useState("");
  const [manualLng, setManualLng] = useState("");
  const [manualLocationError, setManualLocationError] = useState<string | null>(null);
  const hasAutoCentered = useRef(false);

  const fetchPulses = useCallback(async (lat: number, lng: number) => {
    try {
      const res = await fetch(`/api/pulses?lat=${lat}&lng=${lng}&radius=10000&per_page=100`);
      const json = await res.json();
      if (json.success && json.data) {
        setPulses(json.data);
      }
    } catch (error) {
      console.error("Failed to fetch pulses:", error);
    }
  }, []);

  const fetchResources = useCallback(async () => {
    try {
      const res = await fetch(`/api/resources?per_page=100`);
      const json = await res.json();
      if (json.success && json.data) {
        setResources(json.data);
      }
    } catch (error) {
      console.error("Failed to fetch resources:", error);
    }
  }, []);

  useEffect(() => {
    let cancelled = false;

    const loadMapData = async () => {
      const lat = latitude ?? currentCenter?.lat ?? 44.4268;
      const lng = longitude ?? currentCenter?.lng ?? 26.1025;

      await Promise.all([fetchPulses(lat, lng), fetchResources()]);

      if (cancelled) {
        return;
      }
    };

    void loadMapData();

    return () => {
      cancelled = true;
    };
  }, [latitude, longitude, currentCenter, fetchPulses, fetchResources]);

  // Auto-center on user when location is first found
  useEffect(() => {
    if (latitude !== null && longitude !== null && mapInstance && !hasAutoCentered.current) {
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
    if (mapInstance && latitude !== null && longitude !== null) {
      mapInstance.flyTo([latitude, longitude], 15);
    }
  };

  const applyManualLocation = () => {
    const nextLat = Number(manualLat.trim());
    const nextLng = Number(manualLng.trim());

    if (!Number.isFinite(nextLat) || !Number.isFinite(nextLng)) {
      setManualLocationError("Please enter valid numeric coordinates.");
      return;
    }

    if (nextLat < -90 || nextLat > 90 || nextLng < -180 || nextLng > 180) {
      setManualLocationError("Latitude must be between -90 and 90, longitude between -180 and 180.");
      return;
    }

    setManualLocationError(null);
    setCurrentCenter({ lat: nextLat, lng: nextLng });

    if (mapInstance) {
      mapInstance.setView([nextLat, nextLng], 13);
    }
  };

  const initialCenter: [number, number] = useMemo(() => [latitude ?? 44.4268, longitude ?? 26.1025], [latitude, longitude]);
  const showManualLocationPrompt = !locationLoading && latitude === null && longitude === null && currentCenter === null;

  return (
    <div className="relative h-[360px] w-full overflow-hidden rounded-lg border border-white/8 bg-zinc-900 sm:h-[460px] lg:h-[600px]">
      {locationLoading && (
        <div className="absolute inset-0 z-[1000] flex items-center justify-center bg-background/50">
          <div className="flex flex-col items-center gap-2 rounded-lg border border-white/8 bg-zinc-900 p-4">
            <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent"></div>
            <p className="text-xs font-medium">Finding your location...</p>
          </div>
        </div>
      )}

      {showManualLocationPrompt && (
        <div className="absolute left-4 top-4 z-[900] w-[320px] rounded-lg border border-white/8 bg-zinc-900 p-4">
          <p className="text-xs uppercase tracking-widest text-zinc-500">Set Location</p>
          <p className="mt-2 text-xs font-medium text-muted-foreground">
            {locationError || "Location access is unavailable. Enter coordinates to continue."}
          </p>
          <div className="mt-3 grid grid-cols-2 gap-2">
            <Input
              value={manualLat}
              onChange={(event) => setManualLat(event.target.value)}
              placeholder="Latitude"
              className="h-9"
            />
            <Input
              value={manualLng}
              onChange={(event) => setManualLng(event.target.value)}
              placeholder="Longitude"
              className="h-9"
            />
          </div>
          {manualLocationError && (
            <p className="mt-2 text-xs font-semibold text-destructive">{manualLocationError}</p>
          )}
          <Button onClick={applyManualLocation} className="mt-3 h-9 w-full rounded-lg font-bold">
            Use Coordinates
          </Button>
        </div>
      )}

      <Map
        center={initialCenter}
        zoom={13}
        className="h-full w-full"
        zoomControl={false}
      >
        <MapRefCapture onReady={setMapInstance} />
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
        className="absolute top-4 right-4 z-[400]"
        onClick={flyToUser}
        disabled={latitude === null || longitude === null}
      >
        <Target size={20} />
      </Button>
    </div>
  );
}
