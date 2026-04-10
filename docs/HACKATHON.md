# UrbanPulse - Hackathon Reviewer Guide (EN + RO)

This document is the final judge runbook.
Acest document este ghidul final pentru jurizare.

## 1. Quick Start / Pornire Rapida

### EN
1. Add required env in .env.local:
   - NEXT_PUBLIC_SUPABASE_URL
   - NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY
2. Install and run:
   - pnpm install
   - pnpm dev
3. Open http://localhost:3000
4. Optional but recommended before final scoring:
   - pnpm lint
   - pnpm build

### RO
1. Adauga variabilele obligatorii in .env.local:
   - NEXT_PUBLIC_SUPABASE_URL
   - NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY
2. Instaleaza si ruleaza:
   - pnpm install
   - pnpm dev
3. Deschide http://localhost:3000
4. Optional dar recomandat inainte de punctaj final:
   - pnpm lint
   - pnpm build

## 2. Submission Constraints (Explicit) / Constrangeri de Submission (Explicit)

### EN
- Email confirmation flow is implemented, but outbound confirmation email is not configured in this submission environment.
- AI pet enrichment is implemented, but ANTHROPIC_API_KEY is not configured in this submission environment.
- Map provider supports Mapbox via env switch, with OpenStreetMap fallback when key/provider is missing.

### RO
- Fluxul de confirmare email este implementat, dar emailul de confirmare outbound nu este configurat in acest mediu de submission.
- Enrichment AI pentru pets este implementat, dar ANTHROPIC_API_KEY nu este configurat in acest mediu.
- Providerul hartii suporta Mapbox prin variabile de mediu, cu fallback OpenStreetMap daca lipseste cheia/providerul.

## 3. End-to-End Judge Checklist / Checklist End-to-End pentru Juriu

Use this in order. For each step, route + expected result + implementation path are provided.
Foloseste pasii in ordine. Pentru fiecare pas ai ruta + rezultat asteptat + implementare.

1. Auth: register and login
- Route: /register and /login
- Expect: account creation/login works with validation and rate limits
- Files: app/api/auth/register/route.ts, app/api/auth/login/route.ts

2. Create pulse
- Route: /feed -> Share a pulse
- Expect: pulse appears in feed and map
- Files: app/(dashboard)/feed/page.tsx, app/api/pulses/route.ts

3. Auto hero matching on pulse creation
- Route: /feed (after posting)
- Expect: matching runs automatically and hero notifications are generated
- Files: app/api/pulses/route.ts, lib/matching.ts, app/api/notifications/route.ts

4. Quiet-hours + distance respected in matching
- Route: /profile + /feed
- Expect: users in quiet hours are excluded from hero matching
- Files: components/profile/QuietHoursSettings.tsx, lib/matching.ts

5. Pulse verification trigger
- Route: /feed/[pulseId]
- Expect: after >=3 confirmations pulse auto-verifies
- Files: app/api/pulses/[pulseId]/confirm/route.ts, schema.sql (handle_pulse_confirmation)

6. Severe weather and pinned safety check-in
- Route: /feed
- Expect: severe weather alert creates/reuses pinned Safety Check-in pulse and shows top row in feed
- Files: components/feed/WeatherAlert.tsx, app/api/pulses/safety-checkin/route.ts, app/(dashboard)/feed/page.tsx

7. Realtime feed behavior
- Route: /feed
- Expect: feed updates automatically on pulse insert/update/delete
- Files: hooks/use-realtime.ts, app/(dashboard)/feed/page.tsx

8. Resource sharing + verified borrow gate
- Route: /resources -> Borrow
- Expect: physical item borrow requires Verified Neighbor, skill requests remain open
- Files: app/api/interactions/route.ts, schema.sql

9. Messaging
- Route: /messages and /messages/[conversationId]
- Expect: private conversations with membership-scoped access
- Files: app/api/conversations/route.ts, app/api/messages/route.ts, app/api/messages/[conversationId]/route.ts

10. Profile management + delete my data
- Route: /profile
- Expect: profile edits, quiet-hours updates, and account data deletion action are available
- Files: app/(dashboard)/profile/page.tsx, app/api/users/me/route.ts

11. Map visualization and provider
- Route: /map
- Expect: interactive map loads; supports mapbox via env and OSM fallback
- Env for Mapbox mode: NEXT_PUBLIC_MAP_PROVIDER=mapbox and NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN
- Files: app/(dashboard)/map/page.tsx, components/map/MapContainer.tsx

12. Moderation + admin tools
- Route: /admin/dashboard
- Expect: flagged content review and user moderation controls
- Files: app/api/moderation/route.ts, app/api/moderation/[reportId]/route.ts, app/api/admin/stats/route.ts, app/api/admin/users/route.ts

## 4. Requirement Coverage Matrix / Matrice Acoperire Cerinte

| Requirement (EN / RO) | Verify in Product | Main Paths |
| --- | --- | --- |
| Dynamic feed + urgency / Feed dinamic + urgenta | /feed | app/(dashboard)/feed/page.tsx, app/api/pulses/route.ts |
| Realtime updates / Actualizari realtime | /feed, /messages | hooks/use-realtime.ts, app/(dashboard)/feed/page.tsx |
| Notification engine / Motor notificari | bell + hero alerts | app/api/notifications/route.ts, app/api/matching/route.ts |
| Interactive map (Mapbox/OSM) / Harta interactiva | /map | components/map/MapContainer.tsx |
| Weather + safety check-in / Meteo + safety check-in | /feed | components/feed/WeatherAlert.tsx, app/api/pulses/safety-checkin/route.ts |
| Resource collaboration / Colaborare resurse | /resources, /interactions | app/api/resources/route.ts, app/api/interactions/route.ts |
| Smart matching / Potrivire inteligenta | create pulse and profile settings | app/api/pulses/route.ts, lib/matching.ts |
| Verification and moderation / Verificare si moderare | /feed/[pulseId], /admin/dashboard | schema.sql, app/api/moderation/** |
| Account/profile management / Management cont si profil | /profile | app/api/users/me/route.ts, components/profile/** |
| Data privacy + RBAC / Confidentialitate + RBAC | all protected APIs | schema.sql (RLS policies), utils/supabase/server.ts |

## 5. How Core Logic Works / Cum Functioneaza Logica de Baza

### EN
- Pulse creation inserts geospatial pulse row and immediately runs hero matching against nearby profiles.
- Matching filters by availability, quiet-hours window, and skill overlap.
- Severe weather alert triggers safety-check-in creation (or reuse) and pins the pulse.
- Feed prioritizes pinned pulses and listens for realtime DB changes.
- Interaction creation enforces verification for physical item lending.
- Profile delete endpoint removes profile-owned app data and signs out current session.

### RO
- Crearea unui pulse insereaza un rand geospatial si ruleaza imediat hero matching pe profilele apropiate.
- Matching-ul filtreaza dupa disponibilitate, interval quiet-hours si overlap de skill-uri.
- Alerta meteo severa declanseaza crearea (sau reutilizarea) unui safety-check-in pinned.
- Feed-ul prioritizeaza pulse-urile pinned si asculta modificarile realtime din DB.
- Crearea unei interactiuni impune verificare pentru imprumutul de obiecte fizice.
- Endpoint-ul de stergere profil elimina datele aplicatiei detinute de profil si face sign-out.

## 6. Scalability Hooks / Hook-uri pentru Scalabilitate

### EN
- PostGIS + geo RPC for proximity queries.
- RLS policy design for per-user access boundaries.
- Optional external APIs (Anthropic, OpenWeather, Mapbox) with graceful fallback.
- Modular API routes for future queue/worker migration.

### RO
- PostGIS + RPC geo pentru query-uri de proximitate.
- Politici RLS pentru limite clare de acces per utilizator.
- API-uri externe optionale (Anthropic, OpenWeather, Mapbox) cu fallback robust.
- Route-uri API modulare pentru migrare ulterioara catre queue/worker.

## 7. Final Jury Notes / Note Finale pentru Juriu

### EN
- The project is production-shaped and hackathon-focused: complete core flows, explicit constraints, and clear extension paths.
- For strict evaluation, use the checklist in section 3 as the scoring pass.

### RO
- Proiectul este orientat productie si hackathon: fluxuri complete, constrangeri explicite, si cai clare de extensie.
- Pentru evaluare stricta, foloseste checklist-ul din sectiunea 3 ca pas de scoring.
