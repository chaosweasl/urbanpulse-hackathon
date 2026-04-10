# UrbanPulse - Hackathon Reviewer Guide

This document is for hackathon jurors and technical reviewers.

It explains:
- What is implemented
- Where each scored requirement exists in the product/codebase
- How key flows work end to end
- What is intentionally not configured in this submission environment

## 1. Quick Review Start

### Run locally
1. Install dependencies: `pnpm install`
2. Start app: `pnpm dev`
3. Open: `http://localhost:3000`

### Required environment
For full app usage, set in `.env.local`:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`

Optional integrations:
- `OPENWEATHERMAP_API_KEY`
- `ANTHROPIC_API_KEY`

## 2. Important Reviewer Notes (Explicit Constraints)

### Email signup status
Email signup UI and API are implemented:
- UI: `app/(auth)/register/page.tsx`
- API: `app/api/auth/register/route.ts`

In the submitted hackathon environment, outbound email confirmation is not configured.
This is intentional for demo speed and deployment simplicity.

Enterprise/scalable path is ready:
- Keep current API contract
- Enable Supabase Auth email confirmation + SMTP provider
- Reuse the same registration route and auth trigger flow

### AI pet model key status
AI pet photo analysis integration is implemented as a best-effort optional layer in:
- `app/api/pets/route.ts`

In the submitted environment, `ANTHROPIC_API_KEY` is not set.
When missing, the app still works: pet reports and matching continue through deterministic matching logic and `pet_matches` records.

Enterprise/scalable path is ready:
- Set `ANTHROPIC_API_KEY`
- Keep non-blocking AI enrichment behavior
- Add async queue/worker for high volume

## 3. 5-Minute Product Walkthrough

1. Register/Login: `/register`, `/login`
2. Post a Pulse: `/feed` -> create post
3. Verify pulse auto-logic: confirm same pulse with >=3 users
4. Browse map and filters: `/map`
5. Open resources + request flow: `/resources` -> create interaction
6. Open messaging flow: `/messages`
7. Review profile + trust + quiet hours: `/profile`
8. Review lost/found pets + matching UI: `/pets`
9. Admin moderation and user management: `/admin/dashboard`

## 4. Requirement-to-Implementation Map (100 pts)

### Dashboard and Real-Time Connectivity

| Requirement | Where to verify in app | Implementation paths |
| --- | --- | --- |
| Dynamic feed (Emergency/Skill/Item + urgency) | `/feed` | `app/(dashboard)/feed/page.tsx`, `components/feed/PulseCard.tsx`, `app/api/pulses/route.ts` |
| Live updates without refresh | Feed/messages/notifications | `hooks/use-realtime.ts`, `hooks/use-notifications.ts`, realtime tables noted in `schema.sql` |
| Notification engine (hero alerts, messages, interaction events) | Bell + hero alerts + message badges | `app/api/notifications/route.ts`, `app/api/matching/route.ts`, `components/notifications/HeroAlert.tsx`, `schema.sql` (`create_notification`) |
| Interactive visualization map | `/map` | `app/(dashboard)/map/page.tsx`, `components/map/MapContainer.tsx`, `components/map/PulseMarker.tsx`, `app/api/pulses/route.ts` |
| Weather alert integration | Feed weather section | `components/feed/WeatherAlert.tsx`, `app/api/weather/route.ts`, `lib/weather.ts` |

### Skill/Resource Library and Collaboration

| Requirement | Where to verify in app | Implementation paths |
| --- | --- | --- |
| Location filtering/radius query | Feed/map/resource retrieval | `app/api/pulses/route.ts`, `schema.sql` (`nearby_pulses`, PostGIS indexes) |
| Direct communication | `/messages`, `/messages/[conversationId]` | `app/api/conversations/route.ts`, `app/api/messages/route.ts`, `app/api/messages/[conversationId]/route.ts` |
| Localization + profile neighborhood settings | language switch + profile settings | `messages/en.json`, `messages/ro.json`, `components/layout/LanguageSwitcher.tsx`, `components/profile/QuietHoursSettings.tsx` |
| Account/profile management | `/profile` | `components/profile/EditProfileForm.tsx`, `components/profile/SkillTagList.tsx`, `app/api/users/me/route.ts` |
| Reliability/trust score logic | Profile trust updates after interactions | `components/profile/TrustScore.tsx`, `app/api/interactions/[interactionId]/route.ts`, `schema.sql` (`handle_interaction_completed`) |

### Smart Request Matching

| Requirement | Where to verify in app | Implementation paths |
| --- | --- | --- |
| Nearby skill-based hero matching | Trigger from pulse actions | `app/api/matching/route.ts`, `lib/matching.ts`, `schema.sql` (`nearby_profiles`) |
| Quiet hours / distance limits | Profile settings and matching inputs | `components/profile/QuietHoursSettings.tsx`, `lib/matching.ts`, `profiles` fields in `schema.sql` |

### Verification and Moderation

| Requirement | Where to verify in app | Implementation paths |
| --- | --- | --- |
| Secure auth and sessions | `/login`, `/register`, protected pages | `app/api/auth/login/route.ts`, `app/api/auth/register/route.ts`, `utils/supabase/server.ts`, `proxy.ts` |
| Input validation | All create/update APIs | `lib/validators.ts`, API route usage across `app/api/**/route.ts` |
| Auto verification at 3 confirmations | Pulse confirm and verified badge | `schema.sql` (`handle_pulse_confirmation` trigger), `app/api/pulses/[pulseId]/confirm/route.ts` |
| Admin dashboard and report resolution | `/admin/dashboard` | `app/(admin)/dashboard/page.tsx`, `app/api/moderation/route.ts`, `app/api/moderation/[reportId]/route.ts`, `app/api/admin/*` |
| Data privacy + RBAC via RLS | Scoped reads/writes per owner/member/admin | `schema.sql` (RLS policies for profiles, messages, interactions, reports, etc.) |

## 5. Bonus Features and Scalability Hooks

### AI Guardian for Lost Pets
- Lost/found report flow: `app/(dashboard)/pets/page.tsx`, `app/(dashboard)/pets/[petId]/page.tsx`
- Matching UI: `components/pets/PetMatchResults.tsx`
- Matching API: `app/api/pets/match/route.ts`
- AI enrichment (optional, non-blocking): `app/api/pets/route.ts`

### Scalability and resilience
- PostGIS + indexed geo queries in `schema.sql`
- Security-definer helper for conversation-member RLS stability in `schema.sql` (`is_conversation_member`)
- Graceful degradation for weather when API key absent in `lib/weather.ts`
- Optional external AI key in `app/api/pets/route.ts` with safe fallback behavior

## 6. Architecture Overview

### Frontend
- Next.js App Router pages in `app/`
- Shared feature components in `components/`
- Realtime and domain hooks in `hooks/`

### Backend
- API routes in `app/api/**/route.ts`
- Shared server helpers in `lib/api-helpers.ts`
- Input schemas in `lib/validators.ts`

### Data and security
- Full relational schema, triggers, RLS, RPC helpers in `schema.sql`
- Supabase SSR/browser clients in `utils/supabase/`

## 7. Core User Flows (How It Works)

### Pulse flow
1. User creates pulse (`POST /api/pulses`)
2. Feed/map consume pulse data (`GET /api/pulses`)
3. Neighbors confirm pulse (`pulse_confirmations`)
4. Trigger auto-verifies pulse at threshold (`handle_pulse_confirmation`)

### Resource and trust flow
1. User lists resource (`POST /api/resources`)
2. Another user requests it (`POST /api/interactions`)
3. Lifecycle updates (`PATCH /api/interactions/[interactionId]`)
4. Completion trigger recalculates provider trust (`handle_interaction_completed`)

### Messaging flow
1. Conversation creation (`POST /api/conversations`)
2. Message send/retrieve (`/api/messages`, `/api/messages/[conversationId]`)
3. Conversation-member scoped access via RLS helper (`is_conversation_member`)

### Pet flow
1. User posts lost/found report (`POST /api/pets`)
2. Deterministic matching creates `pet_matches`
3. Optional AI tags are added only if external key is available

## 8. What Reviewers Should Evaluate

- End-to-end feature completeness across feed, map, resources, messaging, profile, moderation
- Security posture (RLS + admin checks + validation)
- UX cohesion and responsive behavior across dashboard routes
- Graceful handling of missing optional integrations

## 9. Additional Reference Docs

- Local setup details: `docs/SETUP.md`
- General project overview: `README.md`
- Database schema and policies: `schema.sql`

---

If you need a live guided demo sequence, start with `/feed` and follow the walkthrough in section 3.
