# 🗺️ UrbanPulse — Planul de Dezvoltare (Roadmap)

> **Acest document separă task-urile de Hackathon ca să nu ne călcăm pe picioare.**
>
> - **Task-uri Backend:** Tabele de baze de date, logică AI, WebSocket-uri, API-uri.
> - **Task-uri Frontend:** Componente React, stilizare Tailwind, layout-uri pagini, formulare.

---

## Faza 1: Fundația & Layout-uri

### Backend

- [ ] Configurare proiect Supabase (Auth, Database, Storage)
- [ ] Rulează `schema.sql` pentru a crea toate tabelele (`profiles`, `pulses`, `pulse_confirmations`, `resources`, `interactions`, `conversations`, `conversation_members`, `messages`, `notifications`, `pets`, `pet_matches`, `reports`)
- [ ] Verifică dacă politicile RLS și trigger-urile sunt active
- [ ] Configurează variabilele `.env.local` și distribuie-le echipei

### Frontend

- [ ] Creează Shell-ul / Layout-ul principal al aplicației (Sidebar, Navbar mobil, Topbar)
- [ ] Creează paginile goale de bază pentru routing: `/feed`, `/map`, `/resources`, `/messages`, `/pets`, `/profile`
- [ ] Adaugă buton dark/light mode și configurează tema Shadcn
- [ ] Configurează i18n (internaționalizare) pentru Română 🇷🇴 și Engleză 🇬🇧 — folosește `next-intl` sau similar
- [ ] Creează componenta de schimbare limbă (switch RO / EN în navbar)

---

## Faza 2: Feature Principal — Dashboard-ul de Cartier (Feed în Timp Real)

### Backend

- [ ] Creează ruta API `GET /api/pulses` cu filtrare PostGIS `ST_DWithin` pe raza de căutare
- [ ] Configurează logica de abonare Supabase Realtime (WebSocket) pentru pulse-uri
- [ ] Integrează API-ul OpenWeatherMap pentru alerte meteo severe

### Frontend

- [ ] Creează componenta UI `PulseCard` (Titlu, Badge Urgență, Distanță, Timp scurs)
- [ ] Creează componenta `PulseFeed` care mapează un array de pulse-uri pe carduri UI
- [ ] Construiește formularul "Creează Pulse" folosind Shadcn `Dialog`, `Input`, `Textarea`
- [ ] Construiește harta interactivă Leaflet.js (`MapContainer`, `PulseMarker`)
- [ ] Conectează feed-ul la hook-ul WebSocket pentru a arăta pulse-uri noi instant

---

## Faza 3: Biblioteca de Abilități și Resurse

### Backend

- [ ] Creează rute CRUD API pentru `resources` (filtru pe `type`: item vs skill)
- [ ] Creează rute CRUD API pentru `interactions` (fluxul de împrumut/ajutor)
- [ ] Verifică dacă trigger-ul de trust score se activează la completarea interacțiunii

### Frontend

- [ ] Construiește layout-ul paginii `/resources` cu search și filtre (tab-uri)
- [ ] Creează `ResourceCard` UI pentru unelte (bormasini, scări) și abilități
- [ ] Construiește componenta badge UI "Trust Score" (scor de încredere)
- [ ] Construiește formularul de editare Profil pentru a adăuga abilități

---

## Faza 4: Potrivire Inteligentă & Mesagerie

### Backend

- [ ] Implementează algoritmul "Hero Alert" (potrivește Nevoile cu Abilitățile locale)
- [ ] Creează rute API pentru `conversations`, `conversation_members` și `messages` (tabelele există deja în schema)
- [ ] Creează WebSocket Realtime pentru mesageria directă

### Frontend

- [ ] Construiește UI-ul de Notificări (`NotificationBell`, popup `HeroAlert`)
- [ ] Construiește componenta Inbox (`ConversationList`)
- [ ] Construiește UI-ul de Chat (`MessageBubble`, `MessageInput`)

---

## Faza 5: Verificare & Features Bonus

### Backend

- [ ] Integrează logica de potrivire AI pentru animale (comparare similitudine imagini)
- [ ] Construiește logica de Auto-Validare (3+ confirmări = informație verificată)
- [ ] Construiește rutele server Admin

### Frontend

- [ ] Construiește dashboard-ul `/pets` Lost & Found (Animale Pierdute & Găsite)
- [ ] Creează formularul `PetImageUpload` și UI-ul `PetMatchResults`
- [ ] Construiește tabelul UI de moderare Admin (`ReportTable`)

---

## Faza 6: Finisare & Demo

- [ ] **Ambele:** Testează responsivitatea pe mobil pentru fiecare ecran
- [ ] **Ambele:** Înregistrează video-ul demo de 3 minute
- [ ] **Backend:** Asigură-te că caching-ul și degradarea grațioasă funcționează
- [ ] **Frontend:** Adaugă schelete de încărcare (loading skeletons) și stări goale (empty states) pe toate paginile
- [ ] **Frontend:** Verifică dark/light mode pe fiecare pagină (fără culori hardcodate)
- [ ] **Frontend:** Verifică că tot textul vizibil pentru utilizator are traduceri atât în RO cât și în EN

<br><br>
  <hr>
<br><br>

# 🗺️ UrbanPulse — Development Roadmap

> **This document separates the Hackathon tasks so we don't step on each other's toes.**
>
> - **Backend Tasks:** Database tables, AI logic, WebSockets, API logic.
> - **Frontend Tasks:** UI React components, Tailwind styling, page layouts, forms.

---

## Phase 1: Foundation & Layouts

### Backend

- [ ] Setup Supabase project (Auth, Database, Storage)
- [ ] Run `schema.sql` to create all tables (`profiles`, `pulses`, `pulse_confirmations`, `resources`, `interactions`, `conversations`, `conversation_members`, `messages`, `notifications`, `pets`, `pet_matches`, `reports`)
- [ ] Verify RLS policies and triggers are active
- [ ] Setup `.env.local` variables and distribute them

### Frontend

- [ ] Create the main app Shell/Layout (Sidebar, Mobile Navbar, Topbar)
- [ ] Create basic empty pages for routing: `/feed`, `/map`, `/resources`, `/messages`, `/pets`, `/profile`
- [ ] Add dark/light mode toggle and Shadcn theme setup
- [ ] Setup i18n (internationalization) for Romanian 🇷🇴 and English 🇬🇧 — use `next-intl` or similar
- [ ] Create language toggle component (RO / EN switch in navbar)

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

- [ ] Create CRUD API routes for `resources` (filter by `type`: item vs skill)
- [ ] Create CRUD API routes for `interactions` (borrow/lend flow)
- [ ] Verify trust score trigger fires on interaction completion

### Frontend

- [ ] Build the `/resources` page layout with search and filter tabs
- [ ] Create `ResourceCard` UI for tools (drills, ladders) and skills
- [ ] Build the "Trust Score" UI badge component
- [ ] Build the Profile edit form for users to add their skills

---

## Phase 4: Smart Matching & Messaging

### Backend

- [ ] Implement the "Hero Alert" matching algorithm (match Needs with local Skills)
- [ ] Create API routes for `conversations`, `conversation_members`, and `messages` (tables exist in schema)
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
- [ ] Build the Admin Moderation table UI (`ReportTable`)

---

## Phase 6: Polish & Demo

- [ ] **Both:** Test the mobile responsiveness of every screen
- [ ] **Both:** Record the 3-minute demo video
- [ ] **Backend:** Ensure caching and graceful degradation work
- [ ] **Frontend:** Add loading skeletons and empty states to all pages
- [ ] **Frontend:** Verify dark/light mode works on every page (no hardcoded colors)
- [ ] **Frontend:** Verify all user-facing text has both RO and EN translations
