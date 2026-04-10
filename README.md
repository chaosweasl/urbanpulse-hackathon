# UrbanPulse

UrbanPulse is a hackathon-ready neighborhood coordination app. It turns passive local communication into an active support network for alerts, lending, matching, and private conversations.

The app is built with Next.js App Router, Supabase Auth and Postgres, Leaflet maps, Tailwind CSS, and shadcn/ui. It is structured to feel like a real product rather than a demo shell: live updates, location-aware filtering, AI-assisted pet matching, moderation tools, and dark-theme-safe UI across the main flows.

## What the app does

- Real-time neighborhood feed for emergency, skill, and item posts.
- Interactive map with pulse markers, heatmap support, and location-based discovery.
- Private messaging between neighbors.
- Resource library for tools and skills.
- Lost and found pet reports with AI-assisted matching.
- Admin moderation for flagged content and user management.

## How the repo is organized

The repo follows the Next.js App Router structure:

- `app/` contains pages and API routes.
- `components/` contains reusable feature components.
- `hooks/` contains client-side data and state helpers.
- `lib/` contains shared utilities, validators, and matching logic.
- `utils/supabase/` contains the Supabase browser, server, and middleware clients.
- `types/` contains shared TypeScript types.
- `docs/` contains supporting guides and notes.

Feature pages live under route groups such as `(auth)`, `(dashboard)`, and `(admin)`. API routes live under `app/api/` and power the frontend through standard JSON responses.

## Core stack

- Next.js 16
- React 19
- TypeScript
- Tailwind CSS v4
- shadcn/ui v4
- Supabase
- Leaflet
- next-intl

## Running locally

```bash
pnpm install
pnpm dev
```

Then open http://localhost:3000.

## Environment variables

Create a `.env.local` file with these values:

```env
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=...
ANTHROPIC_API_KEY=...         # Server-side only — AI pet photo analysis
OPENWEATHERMAP_API_KEY=...    # Server-side only
```

`ANTHROPIC_API_KEY` powers the pet image analysis flow. `OPENWEATHERMAP_API_KEY` powers weather alerts. The Supabase variables are required for auth, data access, and realtime updates.

## Available scripts

- `pnpm dev` starts the development server.
- `pnpm build` creates a production build.
- `pnpm start` runs the production server.
- `pnpm lint` runs ESLint.

## Notes for reviewers

- The app uses Supabase SSR helpers for session management through `middleware.ts` and server/client helpers.
- Theme consistency matters: the main product surfaces are designed to work in both light and dark modes.
- `components/ui/` is shadcn-generated and intentionally left untouched.
- The removed gallery page was a design sandbox, not part of the final product surface.

## File map

- `app/` page routes and APIs
- `components/` feature UI
- `hooks/` reusable React hooks
- `lib/` business logic and validation
- `types/` shared types
- `utils/supabase/` SSR clients and middleware

UrbanPulse is meant to be evaluated as a cohesive product: live community coordination, not a collection of disconnected components. The codebase reflects that by keeping feature logic close to its route, routing all data through Supabase-backed APIs, and using shared UI patterns across the main flows.
