"use client";

export default function MapPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold">Neighborhood Map</h1>
      <p className="text-muted-foreground">
        View pulses and resources on the map.
      </p>
      {/* TODO: <MapContainer /> with Leaflet.js */}
      {/* TODO: <PulseMarker /> for each nearby pulse */}
      {/* TODO: <HeatmapLayer /> for density visualization */}
    </div>
  );
}
