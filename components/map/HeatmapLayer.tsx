"use client";

import { useEffect } from "react";
import { useMap } from "react-leaflet";
import L from "leaflet";
// Importing leaflet.heat here is safe IF the component is only imported dynamically with ssr: false
import "leaflet.heat";

interface HeatmapLayerProps {
  points: [number, number, number][]; // [lat, lng, intensity]
}

export default function HeatmapLayer({ points }: HeatmapLayerProps) {
  const map = useMap();

  useEffect(() => {
    if (!map || !points.length) return;

    // @ts-ignore - leaflet.heat is not in the leaflet types
    const heatLayer = L.heatLayer(points, {
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
    });

    heatLayer.addTo(map);

    return () => {
      map.removeLayer(heatLayer);
    };
  }, [map, points]);

  return null;
}
