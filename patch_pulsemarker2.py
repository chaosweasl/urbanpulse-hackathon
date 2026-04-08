import re

with open('components/map/PulseMarker.tsx', 'r') as f:
    content = f.read()

content = content.replace('const [RL, setRL] = useState<unknown>(null);', 'const [RL, setRL] = useState<any>(null);')
content = content.replace('const [L, setL] = useState<unknown>(null);', 'const [L, setL] = useState<any>(null);')

with open('components/map/PulseMarker.tsx', 'w') as f:
    f.write(content)
