import re

with open('components/map/HeatmapLayer.tsx', 'r') as f:
    content = f.read()

content = content.replace('const [EventHandler, setEventHandler] = useState<Record<string, unknown> | null>(null);', 'const [EventHandler, setEventHandler] = useState<any>(null);')

with open('components/map/HeatmapLayer.tsx', 'w') as f:
    f.write(content)
