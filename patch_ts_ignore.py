import re

with open('components/map/HeatmapLayer.tsx', 'r') as f:
    content = f.read()

content = content.replace('            // @ts-expect-error leaflet heat plugin extends L\n            const heatLayer = L.heatLayer(points, {', '            // @ts-ignore leaflet heat plugin extends L\n            const heatLayer = L.heatLayer(points, {')

with open('components/map/HeatmapLayer.tsx', 'w') as f:
    f.write(content)
