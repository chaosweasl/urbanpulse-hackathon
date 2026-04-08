import re
import os

with open('components/map/HeatmapLayer.tsx', 'r') as f:
    content = f.read()

content = content.replace('            // @ts-expect-error leaflet types\n            const heatLayer = L.heatLayer(points, {', '            const heatLayer = (L as any).heatLayer(points, {')
content = content.replace('            // @ts-expect-error leaflet types\n            const heatLayer = L.heatLayer(points, {', '            const heatLayer = (L as any).heatLayer(points, {')

with open('components/map/HeatmapLayer.tsx', 'w') as f:
    f.write(content)
