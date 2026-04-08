import re
import os

with open('components/map/HeatmapLayer.tsx', 'r') as f:
    content = f.read()

content = content.replace('            const heatLayer = (L as Record<string, unknown>).heatLayer(points, {', '            // @ts-expect-error leaflet heat\n            const heatLayer = L.heatLayer(points, {')

with open('components/map/HeatmapLayer.tsx', 'w') as f:
    f.write(content)
