"use client";

import { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet.heat";
import { useMap } from "react-leaflet";

interface HeatmapLayerProps {
  points: [number, number, number][]; // [lat, lng, intensity]
}

const HEATMAP_OPTIONS: L.HeatMapOptions = {
  radius: 25,
  blur: 15,
  maxZoom: 17,
  gradient: {
    0.4: "blue",
    0.6: "cyan",
    0.7: "lime",
    0.8: "yellow",
    1.0: "red",
  },
};

export default function HeatmapLayer({ points }: HeatmapLayerProps) {
  const map = useMap();
  const heatLayerRef = useRef<L.HeatLayer | null>(null);

  useEffect(() => {
    if (heatLayerRef.current) {
      map.removeLayer(heatLayerRef.current);
      heatLayerRef.current = null;
    }

    if (points.length === 0) {
      return;
    }

    const nextLayer = L.heatLayer(points, HEATMAP_OPTIONS);
    nextLayer.addTo(map);
    heatLayerRef.current = nextLayer;

    return () => {
      if (heatLayerRef.current) {
        map.removeLayer(heatLayerRef.current);
        heatLayerRef.current = null;
      }
    };
  }, [map, points]);

  return null;
}
