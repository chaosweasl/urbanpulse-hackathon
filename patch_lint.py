import re
import os

# Navbar.tsx
with open('components/layout/Navbar.tsx', 'r') as f:
    content = f.read()
content = content.replace('const [user, setUser] = useState<any>(null);', 'const [user, setUser] = useState<import("@supabase/supabase-js").User | null>(null);')
with open('components/layout/Navbar.tsx', 'w') as f:
    f.write(content)

# MapContainer.tsx
with open('components/map/MapContainer.tsx', 'r') as f:
    content = f.read()
content = content.replace('const [useMapEvents, setUseMapEvents] = useState<any>(null);', 'const [useMapEvents, setUseMapEvents] = useState<unknown>(null);')
content = content.replace('const map = useMapEvents({', 'const map = (useMapEvents as any)({')
content = content.replace('const [resources, setResources] = useState<(Resource & { owner: any })[]>([]);', 'const [resources, setResources] = useState<(Resource & { owner: Record<string, unknown> })[]>([]);')
content = content.replace('const [mapInstance, setMapInstance] = useState<any>(null);', 'const [mapInstance, setMapInstance] = useState<unknown>(null);')
content = content.replace('// @ts-ignore', '// @ts-expect-error')
with open('components/map/MapContainer.tsx', 'w') as f:
    f.write(content)

# HeatmapLayer.tsx
with open('components/map/HeatmapLayer.tsx', 'r') as f:
    content = f.read()
content = content.replace('const [L, setL] = useState<any>(null);', 'const [L, setL] = useState<unknown>(null);')
content = content.replace('// @ts-ignore', '// @ts-expect-error')
with open('components/map/HeatmapLayer.tsx', 'w') as f:
    f.write(content)

# PulseMarker.tsx
with open('components/map/PulseMarker.tsx', 'r') as f:
    content = f.read()
content = content.replace('const [L, setL] = useState<any>(null);', 'const [L, setL] = useState<unknown>(null);')
content = content.replace('<any>', '<unknown>')
with open('components/map/PulseMarker.tsx', 'w') as f:
    f.write(content)

# QuietHoursSettings.tsx
with open('components/profile/QuietHoursSettings.tsx', 'r') as f:
    content = f.read()
content = content.replace("doesn't", "doesn&apos;t")
content = content.replace("can't", "can&apos;t")
with open('components/profile/QuietHoursSettings.tsx', 'w') as f:
    f.write(content)
