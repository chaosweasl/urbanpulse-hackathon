# 🗺️ UrbanPulse — Development Roadmap

> **This document separates the Hackathon tasks so we don't step on each other's toes.**
>
> - **Backend Tasks:** Database tables, AI logic, WebSockets, API logic.
> - **Frontend Tasks:** UI React components, Tailwind styling, page layouts, forms.

---

## Phase 1: Foundation & Layouts

### Backend

- [ ] Setup Supabase project (Auth, Database, Storage)
- [ ] Create base tables: `users`, `pulses`, `resources`, `pets`
- [ ] Setup Row Level Security (RLS) policies
- [ ] Setup `.env.local` variables and distribute them

### Frontend

- [ ] Create the main app Shell/Layout (Sidebar, Mobile Navbar, Topbar)
- [ ] Create basic empty pages for routing: `/feed`, `/map`, `/resources`, `/messages`, `/pets`, `/profile`
- [ ] Add dark mode toggle and Shadcn theme setup

---

## Phase 2: Core Feature — The Neighborhood Dashboard (Real-Time Feed)

### Backend

- [ ] Create `GET /api/pulses` API route with PostGIS `ST_DWithin` radius filtering
- [ ] Setup Supabase Realtime WebSocket subscription logic for pulses
- [ ] Integrate OpenWeatherMap API for severe weather alerts

### Frontend

- [ ] Create `PulseCard` UI component (Title, Urgency Badge, Distance, Time ago)
- [ ] Create `PulseFeed` component that maps an array of pulses to UI cards
- [ ] Build the "Create Pulse" form using Shadcn `Dialog`, `Input`, `Textarea`
- [ ] Build the Leaflet.js interactive map (`MapContainer`, `PulseMarker`)
- [ ] Connect the feed to the WebSocket hook to show new pulses instantly

---

## Phase 3: Skill & Resource Library

### Backend

- [ ] Create CRUD API routes for `resources` and `skills`
- [ ] Create API route for calculating and updating "Trust Scores"

### Frontend

- [ ] Build the `/resources` page layout with search and filter tabs
- [ ] Create `ResourceCard` UI for tools (drills, ladders) and skills
- [ ] Build the "Trust Score" UI badge component
- [ ] Build the Profile edit form for users to add their skills

---

## Phase 4: Smart Matching & Messaging

### Backend

- [ ] Implement the "Hero Alert" matching algorithm (match Needs with local Skills)
- [ ] Setup `messages` and `conversations` database tables
- [ ] Create Realtime WebSocket for direct messaging

### Frontend

- [ ] Build Notifications UI (`NotificationBell`, `HeroAlert` popup)
- [ ] Build the Inbox component (`ConversationList`)
- [ ] Build the Chat UI (`MessageBubble`, `MessageInput`)

---

## Phase 5: Verification & Bonus Features

### Backend

- [ ] Integrate AI Pet matching logic (image similarity comparison)
- [ ] Build the Auto-Validation logic (3+ confirms = verified info)
- [ ] Build Admin Server routes

### Frontend

- [ ] Build the `/pets` Lost & Found dashboard
- [ ] Create the `PetImageUpload` form and `PetMatchResults` UI
- [ ] Build the Admin Moderation table UI (`FlaggedContentTable`)

---

## Phase 6: Polish & Demo

- [ ] **Both:** Test the mobile responsiveness of every screen
- [ ] **Both:** Record the 3-minute demo video
- [ ] **Backend:** Ensure caching and graceful degradation work
- [ ] **Frontend:** Add loading skeletons and empty states to all pages
