import re
import os

def replace_any(filepath):
    with open(filepath, 'r') as f:
        content = f.read()
    content = content.replace(': any', ': Record<string, unknown>')
    content = content.replace('<any>', '<Record<string, unknown>>')
    content = content.replace('as any', 'as Record<string, unknown>')
    with open(filepath, 'w') as f:
        f.write(content)

replace_any('components/map/HeatmapLayer.tsx')
replace_any('components/map/MapContainer.tsx')
replace_any('components/map/PulseMarker.tsx')

with open('components/profile/QuietHoursSettings.tsx', 'r') as f:
    content = f.read()
content = content.replace("you're", "you&apos;re")
content = content.replace("neighbors'", "neighbors&apos;")
content = content.replace("It's", "It&apos;s")
content = content.replace("We'll", "We&apos;ll")
content = content.replace("let's", "let&apos;s")
with open('components/profile/QuietHoursSettings.tsx', 'w') as f:
    f.write(content)
