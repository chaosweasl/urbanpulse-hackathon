# 📁 Structura Proiectului — Unde merge fiecare fișier

> **Regulă de aur:** Dacă nu ești sigur dacă ar trebui să editezi un fișier, **nu o face.** Întreabă mai întâi pe grupul echipei.

---

## Imaginea de Ansamblu

```
urbanpulse-hackathon/
├── app/                    ← 🟢 Pagini și rute (Aici e UI-ul)
│   ├── (auth)/             ← Pagini de logare/inregistrare
│   ├── (dashboard)/        ← Pagini din aplicația principală
│   ├── (admin)/            ← Panoul de administrare
│   └── api/                ← Backend API (Comunicarea cu baza de date)
│
├── components/             ← 🟢 Piese de UI refolosibile (împărțite pe funcționalități)
│   ├── ui/                 ← 🔴 Componente shadcn (generate automat, NU EDITA)
│   ├── layout/             ← Navbar, Sidebar
│   ├── feed/               ← Componentele feed-ului
│   ├── map/                ← Componentele hărții
│   └── ...alte funcții
│
├── hooks/                  ← 🟢 Funcții React personalizate (use-auth, use-realtime)
├── lib/                    ← 🟢 Utilitare generale (validări, locație)
├── types/                  ← 🟢 Definiții Typescript (un singur fișier: index.ts)
│
├── utils/                  ← 🔴 Utilitare Backend (NU ATINGE)
│   └── supabase/           ← Client Supabase
│
├── schema.sql              ← 🟡 Schema completă a bazei de date Supabase
├── public/                 ← 🟢 Fișiere statice (imagini, iconițe, etc.)
├── docs/                   ← 📖 Ești aici!
└── .antigravity            ← 📚 Fisier cu descrierea logicii proiectului
```

### Legendă

| Emoji | Semnificație                                                   |
| ----- | -------------------------------------------------------------- |
| 🟢    | **Sigur de editat** — aici vei lucra tu cel mai mult           |
| 🟡    | **Editează cu precauție** — întreabă echipa dacă nu ești sigur |
| 🔴    | **NU ATINGE** — echipa gestionează asta                        |

---

## Unde Vei Lucra Propriu-zis

### 1. `app/` — Paginile UI și rutele API

Aici trăiesc toate paginile și backend-ul aplicației. Next.js folosește **rutare bazată pe fișiere (file-based routing)**, ceea ce înseamnă că:

> **Structura folderelor = structura URL-urilor (linkurilor).**

| Tu editezi fișierul...             | ...și el modifică linkul/rută aceasta |
| ---------------------------------- | ------------------------------------- |
| `app/(auth)/login/page.tsx`        | `/login`                              |
| `app/(dashboard)/feed/page.tsx`    | `/feed`                               |
| `app/(dashboard)/profile/page.tsx` | `/profile`                            |
| `app/api/pulses/route.ts`          | `API: GET/POST la /api/pulses`        |

**Reguli:**

- Folderele cu paranteze, ex: `(dashboard)`, sunt "Grupuri de rute". Ele sunt **invizibile** în adresa finală (ajută doar la organizare).
- Paginile pentru clienți folosesc fișiere numite `page.tsx` (ex: `app/feed/page.tsx`).
- Endpointurile API folosesc fișiere numite `route.ts` (ex: `app/api/users/route.ts`).

### 2. `components/` — Piesele de constructie UI (UI building blocks)

Aici vor sta **componentele tale custom**. Le-am despărțit frumos în foldere specifice pentru a nu face haos:

```
components/
├── ui/          ← 🔴 generate automat de shadcn (NU EDITA direct aici)
│
├── layout/      ← 🟢 Bara de sus, bara din stânga, footer-ul
├── feed/        ← 🟢 Cardul unui pulse, bara de search din feed
├── map/         ← 🟢 Harta și pinii hărții
├── profile/     ← 🟢 Lista de skill-uri, scorul de încredere
├── messages/    ← 🟢 Mesajele de chat
├── pets/        ← 🟢 Găsește un animal (meciuri AI)
├── admin/       ← 🟢 Tabelul cu decizii de moderare
└── shared/      ← 🟢 Componente care par de ajutor în multe locuri, ex: o fereastră de confirmare
```

**Reguli:**

- **Nu edita niciodată fișiere din interiorul `components/ui/`** — acestea sunt generate de shadcn. Dacă le editezi și noi le reinstalăm (la vreun update), schimbările tale se vor șterge automat.
- Pune o componentă doar **în folderul relevant** acțiunii sale.

### 3. `types/`, `hooks/`, și `lib/`

Dacă ai nevoie de o funcție de ajutor, un hook de React ce face un request, sau cauți tipurile datelor TypeScript - acestea sunt folderele:

- **`types/`**: Un singur fișier `index.ts` cu toate definițiile TS (`Pulse`, `Profile`, `Resource`, `Interaction`, `PetReport`, etc.).
- **`hooks/`**: Când vrei să chemi date, precum locația sau contul utilizatorului (ex: `useAuth()`).
- **`lib/`**: Metode comune, gen formatatoare, sistemul Haversine de calculare kilometri, sau proxy pentru vremii.

---

<br><br>

  <hr>
<br><br>

# 📁 Project Structure — What Goes Where (English)

> **Rule of thumb:** If you're not sure whether you should edit a file, **don't.** Ask in the group chat first.

---

## The Big Picture

```
urbanpulse-hackathon/
├── app/                    ← 🟢 Pages & routes (Frontend + Backend)
│   ├── (auth)/             ← Auth pages (login, register)
│   ├── (dashboard)/        ← Main app pages
│   ├── (admin)/            ← Admin dashboard view
│   └── api/                ← Backend API routes
│
├── components/             ← 🟢 Reusable UI pieces (Grouped by feature)
│   ├── ui/                 ← 🔴 shadcn components (auto-generated, DON'T EDIT)
│   ├── layout/             ← Navbar, Sidebar
│   ├── feed/               ← Feed specific components
│   ├── map/                ← Web map tools
│   └── ...other features
│
├── hooks/                  ← 🟢 Custom React hooks
├── lib/                    ← 🟢 Shared utilities (validation, geolocation)
├── types/                  ← 🟢 Shared TypeScript definitions (single index.ts)
│
├── utils/                  ← 🔴 Backend utilities (DON'T TOUCH)
│   └── supabase/           ← Browser and server clients
│
├── schema.sql              ← 🟡 Complete Supabase database schema
├── public/                 ← 🟢 Static files (images, icons, etc.)
├── docs/                   ← 📖 You are here!
└── .antigravity            ← 📚 Description of project logic & rules
```

### Legend

| Emoji | Meaning                                         |
| ----- | ----------------------------------------------- |
| 🟢    | **Safe to edit** — this is where your work goes |
| 🟡    | **Edit with caution** — ask the team if unsure  |
| 🔴    | **DON'T TOUCH** — the team manages these        |

---

## Where You'll Actually Work

### 1. `app/` — Your pages and routes

This is where all the pages of the app live. Next.js uses **file-based routing**, which means:

> **The folder structure = the URL structure.**

| You create this file...            | ...and it becomes this URL     |
| ---------------------------------- | ------------------------------ |
| `app/(auth)/login/page.tsx`        | `/login`                       |
| `app/(dashboard)/feed/page.tsx`    | `/feed`                        |
| `app/(dashboard)/profile/page.tsx` | `/profile`                     |
| `app/api/pulses/route.ts`          | `API: GET/POST at /api/pulses` |

**Rules:**

- Folders with parentheses, e.g., `(dashboard)`, are **Route Groups**. They are **invisible** in the final URL. They only exist to help organize code.
- User-facing view code goes in `page.tsx` files.
- Backend API logic code goes in `route.ts` files.

### 2. `components/` — Reusable UI building blocks

This is where **your custom components** live. We've split them into domain-specific folders to keep things clean:

```
components/
├── ui/          ← 🔴 shadcn auto-generated (DON'T EDIT these directly)
│
├── layout/      ← 🟢 Topbar, Sidebar, Footer wrappers
├── feed/        ← 🟢 Pulse cards, feed filters
├── map/         ← 🟢 Map markers, leaflet wrapper
├── profile/     ← 🟢 Trust score badges, skill tag editors
├── messages/    ← 🟢 Chat bubbles, conversation lists
├── pets/        ← 🟢 AI pet match interface
├── admin/       ← 🟢 Flagged content moderation tables
└── shared/      ← 🟢 Universal helpers like "Confirm Dialog" or empty state UI
```

**Rules:**

- **Never edit files inside `components/ui/`** — these are generated by shadcn. If you edit them and we reinstall, your changes will be lost.
- Place custom components in the appropriate **feature domain folder**.

### 3. `types/`, `hooks/`, and `lib/`

When you need helper functions, data fetching hooks, or TS Definitions, look here:

- **`types/`**: A single `index.ts` file with all TypeScript definitions (`Pulse`, `Profile`, `Resource`, `Interaction`, `PetReport`, etc.).
- **`hooks/`**: Custom React hooks (`useLocation`, `useRealtime`, etc).
- **`lib/`**: General reusable functions (e.g. `geo.ts` for haversine distances, `validators.ts` for Zod schemas).

---

**Next:** Read [WORKFLOW.md](./WORKFLOW.md) to learn how to write code, use GitHub Desktop, and add shadcn components.
