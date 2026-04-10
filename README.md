# UrbanPulse

UrbanPulse is a neighborhood coordination app for crisis alerts, resource sharing, trusted interactions, and direct messaging.

## Quick Setup (EN)

1. Install Node.js LTS (22+) and pnpm.
2. Create .env.local in the project root.
3. Add required variables:
   - NEXT_PUBLIC_SUPABASE_URL
   - NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY
4. Install dependencies: pnpm install
5. Run locally: pnpm dev
6. Open: http://localhost:3000

## Setup Rapid (RO)

1. Instaleaza Node.js LTS (22+) si pnpm.
2. Creeaza fisierul .env.local in radacina proiectului.
3. Adauga variabilele obligatorii:
   - NEXT_PUBLIC_SUPABASE_URL
   - NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY
4. Instaleaza dependintele: pnpm install
5. Ruleaza local: pnpm dev
6. Deschide: http://localhost:3000

## Optional Integrations / Integrari Optionale

- OPENWEATHERMAP_API_KEY (weather alerts)
- ANTHROPIC_API_KEY (AI pet photo enrichment)
- NEXT_PUBLIC_MAP_PROVIDER=mapbox (optional map provider switch)
- NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN (required if provider is mapbox)

If optional keys are missing, core product flows still work.
Daca lipsesc cheile optionale, fluxurile principale ale produsului functioneaza in continuare.

## Next.js Request Pipeline / Flux Request Next.js

- EN: This project uses `proxy.ts` for request/session gating. The `middleware.ts` convention is deprecated in current Next.js and is intentionally not used.
- RO: Acest proiect foloseste `proxy.ts` pentru filtrarea request/session. Conventia `middleware.ts` este deprecated in Next.js curent si nu este folosita intentional.

## Scripts

- pnpm dev
- pnpm build
- pnpm start
- pnpm lint

## Reviewer Docs

- Hackathon guide: docs/HACKATHON.md
- Database + RLS + triggers: schema.sql
