import re

with open('components/map/PulseMarker.tsx', 'r') as f:
    content = f.read()

content = content.replace('const [RL, setRL] = useState<{} | null>(null);', 'const [RL, setRL] = useState<any>(null);')
content = content.replace('const [RL, setRL] = useState<Record<string, unknown> | null>(null);', 'const [RL, setRL] = useState<any>(null);')
# Actually RL is imported earlier in the file, let's just check what's there
