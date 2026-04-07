"use client";

import { useEffect, useState } from "react";
import L from "leaflet";

interface HeatmapLayerProps {
  points: [number, number, number][]; // [lat, lng, intensity]
}

export default function HeatmapLayer({ points }: HeatmapLayerProps) {
  const [EventHandler, setEventHandler] = useState<any>(null);

  useEffect(() => {
    // Only import react-leaflet on the client
    import("react-leaflet").then((mod) => {
      const { useMap } = mod;

      const HeatLayerComponent = () => {
        const map = useMap();
        useEffect(() => {
          if (!map || !points.length) return;

          // Dynamically import leaflet.heat
          // @ts-ignore
          import("leaflet.heat").then(() => {
            // @ts-ignore
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
          });
        }, [map, points]);
        return null;
      };

      setEventHandler(() => HeatLayerComponent);
    });
  }, [points]);

  return EventHandler ? <EventHandler /> : null;
}
