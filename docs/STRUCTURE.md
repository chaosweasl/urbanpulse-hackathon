# 📁 Structura Proiectului — Unde merge fiecare fișier

> **Regulă de aur:** Dacă nu ești sigur dacă ar trebui să editezi un fișier, **nu o face.** Întreabă mai întâi pe grupul echipei.

---

## Imaginea de Ansamblu

```
urbanpulse-hackathon/
├── app/                    ← 🟢 Pagini și rute (aici vei lucra cel mai mult)
│   ├── globals.css         ← 🟡 Stiluri globale (întreabă înainte să modifici)
│   ├── layout.tsx          ← 🔴 Layout-ul principal (NU ATINGE)
│   ├── page.tsx            ← 🟢 Pagina principală (Home)
│   └── favicon.ico         ← Iconița din tab-ul browserului
│
├── components/             ← 🟢 Piese de UI refolosibile (Componente)
│   └── ui/                 ← 🔴 Componente shadcn (generate automat, NU EDITA)
│       ├── button.tsx
│       ├── card.tsx
│       └── input.tsx
│
├── lib/                    ← 🔴 Funcții utilitare (NU ATINGE)
│   └── utils.ts            ← Ajutorul cn() pentru combinarea claselor CSS
│
├── utils/                  ← 🔴 Utilitare Backend (NU ATINGE)
│   └── supabase/
│       ├── client.ts       ← Client Supabase pentru browser
│       └── server.ts       ← Client Supabase pentru server
│
├── public/                 ← 🟢 Fișiere statice (imagini, iconițe, etc.)
├── docs/                   ← 📖 Ești aici!
├── proxy.ts                ← 🔴 Middleware de autentificare (NU ATINGE)
│
├── package.json            ← 🔴 Dependențele proiectului (NU ATINGE)
├── pnpm-lock.yaml          ← 🔴 Fișier de blocare (NU ATINGE)
├── tsconfig.json           ← 🔴 Configurare TypeScript (NU ATINGE)
├── next.config.ts          ← 🔴 Configurare Next.js (NU ATINGE)
├── postcss.config.mjs      ← 🔴 Configurare PostCSS (NU ATINGE)
├── eslint.config.mjs       ← 🔴 Configurare Linting (NU ATINGE)
├── components.json         ← 🔴 Configurare shadcn (NU ATINGE)
├── .env.local              ← 🔴 Chei secrete (NU ATINGE, NU PUNE PE GITHUB)
└── .gitignore              ← 🔴 Lista de ignorare Git (NU ATINGE)
```

### Legendă

| Emoji | Semnificație |
|-------|---------|
| 🟢 | **Sigur de editat** — aici vei lucra tu |
| 🟡 | **Editează cu precauție** — întreabă liderul echipei dacă nu ești sigur |
| 🔴 | **NU ATINGE** — liderul echipei gestionează asta |

---

## Unde Vei Lucra Propriu-zis

### 1. `app/` — Paginile și rutele tale

Aici trăiesc toate paginile aplicației. Next.js folosește **rutare bazată pe fișiere (file-based routing)**, ceea ce înseamnă că:

> **Structura folderelor = structura URL-urilor (linkurilor).**

| Tu creezi fișierul...           | ...și el devine linkul acesta |
|-----------------------------------|---------------------------|
| `app/page.tsx`                    | `/` (pagina principală)       |
| `app/dashboard/page.tsx`         | `/dashboard`              |
| `app/profile/page.tsx`           | `/profile`                |
| `app/dashboard/alerts/page.tsx`  | `/dashboard/alerts`       |

**Reguli:**
- Fiecare folder de rută are nevoie de un fișier numit **exact** `page.tsx` — aceasta este pagina vizibilă.
- Fișierul **trebuie** să exporte o componentă React ca export principal (`default export`).
- Numele fișierului trebuie să fie **obligatoriu cu litere mici**: `page.tsx` (nu `Page.tsx`).

**Exemplu:** Crearea unei pagini noi la `/dashboard`:

1. Creează folderul: `app/dashboard/`
2. Creează fișierul: `app/dashboard/page.tsx`
3. Scrie asta înăuntru:

```tsx
export default function DashboardPage() {
  return (
    <div>
      <h1>Panou de Control (Dashboard)</h1>
      <p>Aceasta este pagina de dashboard.</p>
    </div>
  )
}
```

4. Intră pe `http://localhost:3000/dashboard` — pagina ta este live!

#### Fișiere Speciale în `app/`

| Fișier | Ce face | Să îl atingi? |
|------|-------------|---------------------|
| `page.tsx` | Conținutul paginii pentru acea rută | ✅ Da |
| `layout.tsx` | Învelește toate paginile (navbar, footer, etc.) | ⚠️ Întreabă prima dată |
| `loading.tsx` | Se afișează cât timp pagina se încarcă | ✅ Da (creează-l dacă e nevoie) |
| `error.tsx` | Se afișează dacă ceva crapă | ✅ Da (creează-l dacă e nevoie) |
| `not-found.tsx` | Pagina custom 404 (nu a fost găsit) | ✅ Da (creează-l dacă e nevoie) |

#### Grupuri de Rute (Foldere cu Paranteze)

S-ar putea să vezi foldere precum `(dashboard)` cu paranteze. Acestea sunt **grupuri de rute** — ne permit să organizăm fișierele fără a afecta URL-ul:

```
app/(dashboard)/feed/page.tsx    →  URL este /feed    (NU /dashboard/feed)
app/(dashboard)/map/page.tsx     →  URL este /map     (NU /dashboard/map)
```

Folderul cu paranteze devine invizibil în link. Este doar pentru a organiza codul pe departamente.

### 2. `components/` — Piesele de constructie UI (UI building blocks)

Aici vor sta **componentele tale custom**. Gândește-te la componente ca la niște piese LEGO refolosibile.

```
components/
├── ui/          ← 🔴 generate automat de shadcn (NU EDITA direct aici)
│   ├── button.tsx
│   ├── card.tsx
│   └── input.tsx
│
├── PulseCard.tsx       ← 🟢 Componenta ta custom (exemplu)
├── Navbar.tsx          ← 🟢 Componenta ta custom (exemplu)
└── WeatherAlert.tsx    ← 🟢 Componenta ta custom (exemplu)
```

**Reguli:**
- **Nu edita niciodată fișiere din interiorul `components/ui/`** — acestea sunt generate de shadcn. Dacă le editezi și noi le reinstalăm (la vreun update), schimbările tale se vor șterge automat.
- Creează-ți propriile componente **direct în folderul `components/`** (nu în `ui/`).
- Folosește PascalCase, adică fiecare literă mare, pentru a numi un fișier componentă: `PulseCard.tsx`, nu `pulse-card.tsx` sau `pulsecard.tsx`.

### 3. `public/` — Fișiere Statice

Pune poze, imagini vectoriale, logo-uri și alte materiale statice aici. Când le folosești în cod, pui un `/` la început:

```tsx
<img src="/poza-mea.png" alt="Descriere" />
```

---

## Fișiere Care NU Sunt Problema Ta

Acestea sunt gestionate de liderul echipei. Nu trebuie să le înțelegi, doar să nu le atingi:

| Fișier/Folder | Ce este acesta? | De ce există? |
|---|---|---|
| `utils/supabase/` | Cod conexiune baza de date | Conectează aplicatia la o baza de date in cloud |
| `proxy.ts` | Middleware Autentificare | Oprește utilizatorii nelogați |
| `lib/utils.ts` | Funcția `cn()` | Combină clase (Tailwind CSS) intre ele (tu vei FOLOSI acest utils, nu il editezi) |
| `package.json` | Lista de dependinte | Ce am instalat din npm (react, supabase etc) |
| `pnpm-lock.yaml` | Lock-ul deps-urilor | Îngheață codul exact la o versiune pentru noi toți |
| `tsconfig.json` | Setările de Typescript | Spune compilatorului cum să analizeze codul |
| `next.config.ts` | Setările de Next.JS | Setările de server etc |
| `components.json` | Configurări ShadCN | Unde ShadCN bagă fișiere |
| `.env.local` | Variabile secrete | Cheile si API-urile secrete (nu la pus pe github!) |

---

## Scurtătura de Import `@/` 

Vei vedea importuri precum:

```tsx
import { Button } from "@/components/ui/button"
```

Acel `@/` este o scurtătură care înseamnă "din root-ul proiectului". Așadar `@/components/ui/button` înseamnă de fapt că te duce în `urbanpulse-hackathon/components/ui/button.tsx`. 

Această configurare este făcută la `tsconfig.json` — nu trebuie să o atingi, ci doar să o folosești.

**Importuri frecvente pe care le vei folosi:**

```tsx
// shadcn components (UI)
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"

// Componentele tale (ce ai facut tu in components)
import { PulseCard } from "@/components/PulseCard"  

// Functionalitatea `cn()` ce imbina CSS-ul tau in Tailwind
import { cn } from "@/lib/utils"
```

---

**Următorul pas:** Citește [WORKFLOW.md](./WORKFLOW.md) pentru a învăța cum să scrii cod, să folosești GitHub Desktop și să adaugi componente shadcn.

<br><br>
  <hr>
<br><br>

# 📁 Project Structure — What Goes Where (English)

> **Rule of thumb:** If you're not sure whether you should edit a file, **don't.** Ask in the group chat first.

---

## The Big Picture

```
urbanpulse-hackathon/
├── app/                    ← 🟢 Pages & routes (you'll work here most)
│   ├── globals.css         ← 🟡 Global styles (ask before editing)
│   ├── layout.tsx          ← 🔴 Root layout (DON'T TOUCH)
│   ├── page.tsx            ← 🟢 The home page
│   └── favicon.ico         ← The browser tab icon
│
├── components/             ← 🟢 Reusable UI pieces
│   └── ui/                 ← 🔴 shadcn components (auto-generated, DON'T EDIT)
│       ├── button.tsx
│       ├── card.tsx
│       └── input.tsx
│
├── lib/                    ← 🔴 Utility functions (DON'T TOUCH)
│   └── utils.ts            ← The cn() helper for combining CSS classes
│
├── utils/                  ← 🔴 Backend utilities (DON'T TOUCH)
│   └── supabase/
│       ├── client.ts       ← Browser-side Supabase client
│       └── server.ts       ← Server-side Supabase client
│
├── public/                 ← 🟢 Static files (images, icons, etc.)
├── docs/                   ← 📖 You are here!
├── proxy.ts                ← 🔴 Auth middleware (DON'T TOUCH)
│
├── package.json            ← 🔴 Project dependencies (DON'T TOUCH)
├── pnpm-lock.yaml          ← 🔴 Lock file (DON'T TOUCH)
├── tsconfig.json           ← 🔴 TypeScript config (DON'T TOUCH)
├── next.config.ts          ← 🔴 Next.js config (DON'T TOUCH)
├── postcss.config.mjs      ← 🔴 PostCSS config (DON'T TOUCH)
├── eslint.config.mjs       ← 🔴 Linting config (DON'T TOUCH)
├── components.json         ← 🔴 shadcn config (DON'T TOUCH)
├── .env.local              ← 🔴 Secret keys (DON'T TOUCH, DON'T COMMIT)
└── .gitignore              ← 🔴 Git ignore list (DON'T TOUCH)
```

### Legend

| Emoji | Meaning |
|-------|---------|
| 🟢 | **Safe to edit** — this is where your work goes |
| 🟡 | **Edit with caution** — ask the team lead if unsure |
| 🔴 | **DON'T TOUCH** — the team lead manages these |

---

## Where You'll Actually Work

### 1. `app/` — Your pages and routes

This is where all the pages of the app live. Next.js uses **file-based routing**, which means:

> **The folder structure = the URL structure.**

| You create this file...           | ...and it becomes this URL |
|-----------------------------------|---------------------------|
| `app/page.tsx`                    | `/` (the home page)       |
| `app/dashboard/page.tsx`         | `/dashboard`              |
| `app/profile/page.tsx`           | `/profile`                |
| `app/dashboard/alerts/page.tsx`  | `/dashboard/alerts`       |

**Rules:**
- Every route folder needs a file called `page.tsx` — that's the actual page
- The file **must** export a React component as the default export
- The filename must be exactly `page.tsx` (lowercase, not `Page.tsx`)

**Example:** Creating a new `/dashboard` page:

1. Create the folder: `app/dashboard/`
2. Create the file: `app/dashboard/page.tsx`
3. Write this inside:

```tsx
export default function DashboardPage() {
  return (
    <div>
      <h1>Dashboard</h1>
      <p>This is the dashboard page.</p>
    </div>
  )
}
```

4. Go to `http://localhost:3000/dashboard` — your page is live!

#### Special Files in `app/`

| File | What it does | Should you touch it? |
|------|-------------|---------------------|
| `page.tsx` | The page content for that route | ✅ Yes |
| `layout.tsx` | Wraps all pages (navbar, footer, etc.) | ⚠️ Ask first |
| `loading.tsx` | Shown while the page is loading | ✅ Yes (create if needed) |
| `error.tsx` | Shown if something crashes | ✅ Yes (create if needed) |
| `not-found.tsx` | Custom 404 page | ✅ Yes (create if needed) |

#### Route Groups (Parentheses Folders)

You might see folders like `(dashboard)` with parentheses. These are **route groups** — they let us organize files without affecting the URL:

```
app/(dashboard)/feed/page.tsx    →  URL is /feed    (NOT /dashboard/feed)
app/(dashboard)/map/page.tsx     →  URL is /map     (NOT /dashboard/map)
```

The parentheses folder is invisible in the URL. It's just for organization.

### 2. `components/` — Reusable UI building blocks

This is where **your custom components** live. Think of components as reusable LEGO pieces.

```
components/
├── ui/          ← 🔴 shadcn auto-generated (DON'T EDIT these directly)
│   ├── button.tsx
│   ├── card.tsx
│   └── input.tsx
│
├── PulseCard.tsx       ← 🟢 Your custom component (example)
├── Navbar.tsx          ← 🟢 Your custom component (example)
└── WeatherAlert.tsx    ← 🟢 Your custom component (example)
```

**Rules:**
- **Never edit files inside `components/ui/`** — these are generated by shadcn. If you edit them and we reinstall, your changes will be lost
- Create your own components **directly in `components/`** (not inside `ui/`)
- Use PascalCase for component filenames: `PulseCard.tsx`, not `pulse-card.tsx`

### 3. `public/` — Static files

Put images, icons, and other static files here. Reference them with a leading `/`:

```tsx
<img src="/my-image.png" alt="Description" />
```

---

## Files That Are NOT Your Problem

These are managed by the team lead. You don't need to understand them, just don't touch them:

| File/Folder | What it is | Why it exists |
|---|---|---|
| `utils/supabase/` | Database connection code | Connects the app to our Supabase database |
| `proxy.ts` | Auth middleware | Handles authentication cookies |
| `lib/utils.ts` | The `cn()` function | Merges Tailwind classes (you'll USE it, not edit it) |
| `package.json` | Dependency list | Lists all npm packages we use |
| `pnpm-lock.yaml` | Dependency lock file | Ensures everyone has exact same versions |
| `tsconfig.json` | TypeScript settings | Tells TypeScript how to compile our code |
| `next.config.ts` | Next.js settings | App-level configuration |
| `components.json` | shadcn configuration | Tells shadcn where to put components |
| `.env.local` | Secret environment variables | API keys and connection strings |

---

## The `@/` Import Shortcut

You'll see imports like:

```tsx
import { Button } from "@/components/ui/button"
```

The `@/` is a shortcut that means "the project root". So `@/components/ui/button` means `urbanpulse-hackathon/components/ui/button.tsx`.

This is configured in `tsconfig.json` — you don't need to touch it, just use it.

**Common imports you'll use:**

```tsx
// shadcn components
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"

// Your own components
import { PulseCard } from "@/components/PulseCard"  

// The cn() utility for combining CSS classes
import { cn } from "@/lib/utils"
```

---

**Next:** Read [WORKFLOW.md](./WORKFLOW.md) to learn how to write code, use GitHub Desktop, and add shadcn components.