import re
import os

with open('components/map/HeatmapLayer.tsx', 'r') as f:
    content = f.read()

content = content.replace('            // @ts-expect-error leaflet heat\n            const heatLayer = L.heatLayer(points, {', '            // @ts-expect-error leaflet heat plugin extends L\n            const heatLayer = L.heatLayer(points, {')
content = content.replace('const [L, setL] = useState<Record<string, unknown> | null>(null);', 'const [L, setL] = useState<any>(null);')

with open('components/map/HeatmapLayer.tsx', 'w') as f:
    f.write(content)

with open('components/map/MapContainer.tsx', 'r') as f:
    content = f.read()

content = content.replace('click(e: { latlng: { lat: number, lng: number } }) {', 'click(e: any) {')
content = content.replace('const [mapInstance, setMapInstance] = useState<unknown>(null);', 'const [mapInstance, setMapInstance] = useState<any>(null);')
content = content.replace('const map = (useMapEvents as any)({', 'const map = useMapEvents({')
content = content.replace('const [useMapEvents, setUseMapEvents] = useState<unknown>(null);', 'const [useMapEvents, setUseMapEvents] = useState<any>(null);')

with open('components/map/MapContainer.tsx', 'w') as f:
    f.write(content)

with open('components/map/PulseMarker.tsx', 'r') as f:
    content = f.read()
content = content.replace('const [L, setL] = useState<Record<string, unknown> | null>(null);', 'const [L, setL] = useState<any>(null);')
content = content.replace('const L: Record<string, unknown> | null = useMemo(() => {', 'const L: any = useMemo(() => {')
with open('components/map/PulseMarker.tsx', 'w') as f:
    f.write(content)
