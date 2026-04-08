import re
import os

# HeatmapLayer.tsx
with open('components/map/HeatmapLayer.tsx', 'r') as f:
    content = f.read()
content = content.replace('const [L, setL] = useState<unknown>(null);', 'const [L, setL] = useState<Record<string, unknown> | null>(null);')
content = content.replace('// @ts-expect-error', '// @ts-expect-error leaflet types')
with open('components/map/HeatmapLayer.tsx', 'w') as f:
    f.write(content)

# MapContainer.tsx
with open('components/map/MapContainer.tsx', 'r') as f:
    content = f.read()
content = content.replace('click(e: any) {', 'click(e: { latlng: { lat: number, lng: number } }) {')
content = content.replace('// @ts-expect-error', '// @ts-expect-error leaflet event')
with open('components/map/MapContainer.tsx', 'w') as f:
    f.write(content)

# PulseMarker.tsx
with open('components/map/PulseMarker.tsx', 'r') as f:
    content = f.read()
content = content.replace('const [L, setL] = useState<unknown>(null);', 'const [L, setL] = useState<Record<string, unknown> | null>(null);')
content = content.replace('  const L: any = useMemo(() => {', '  const L: Record<string, unknown> | null = useMemo(() => {')
with open('components/map/PulseMarker.tsx', 'w') as f:
    f.write(content)

# QuietHoursSettings.tsx
with open('components/profile/QuietHoursSettings.tsx', 'r') as f:
    content = f.read()
content = content.replace("you're", "you&apos;re")
content = content.replace("neighbors'", "neighbors&apos;")
with open('components/profile/QuietHoursSettings.tsx', 'w') as f:
    f.write(content)
