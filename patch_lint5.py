import re
import os

with open('components/map/HeatmapLayer.tsx', 'r') as f:
    content = f.read()

content = content.replace('          // @ts-expect-error leaflet types\n          import("leaflet.heat").then(() => {', '          import("leaflet.heat").then(() => {')

with open('components/map/HeatmapLayer.tsx', 'w') as f:
    f.write(content)
