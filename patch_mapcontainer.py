import re

with open('components/map/MapContainer.tsx', 'r') as f:
    content = f.read()

content = content.replace('const map = (useMapEvents as Record<string, unknown>)({', 'const map = (useMapEvents as any)({')
content = content.replace('const [resources, setResources] = useState<(Resource & { owner: Record<string, unknown> })[]>([]);', 'const [resources, setResources] = useState<(Resource & { owner: any })[]>([]);')
content = content.replace('const map = useMapEvents({', 'const map = (useMapEvents as any)({')

with open('components/map/MapContainer.tsx', 'w') as f:
    f.write(content)
