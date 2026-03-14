# 📖 Dicționar (Glossary) — Termeni pe care îi vei auzi

> Un loc rapid pentru jargonul web-dev care apare în timpul dezvoltării. Caută rapid cu Ctrl+F.

---

| Termen | Ce Înseamnă |
|------|--------------|
| **Antigravity** | Editorul nostru de cod (IDE-ul). Aici scriem tot proiectul |
| **API** | Application Programming Interface (Interfață) — metoda prin care Front-End-ul cere date de la Back-End |
| **Client Component** | O componentă React ce rulează DOAR în browserul omului. E vitală ca să meargă click-urile și animațiile. Tre să aibă OBLIGATORIU `"use client"` sus de tot pe rândul 1! |
| **Componentă** | O piesă de LEGO (UI) pe care o poți refolosi. Ca o funcție care returnează cod HTML gata făcut. |
| **CSS** | Styling-ul paginii. Se folosește Tailwind în loc de a scrie CSS pur. |
| **Dependențe / Pachete** | Colecții de cod (librării externe) pe care le folosim (instalate cu `pnpm install`) |
| **Dev Server** | Server-ul local `pnpm dev` care rulează în consolă și dă Refresh la Pagină când salvezi. |
| **Variabile de Mediu (.env)** | Parole, Link-uri Secrete, API Key-uri. NU SE PUN NICIODATĂ PE GITHUB (doar în fișierul `.env.local`). |
| **ESLint** | O unealtă din Antigravity care pune o subliniere roșie sau galbenă când există probleme în cod. |
| **Front-End** | Partea vizibilă de către clientul final în Browser (ex: React, Tailwind) |
| **Back-End** | Partea de Server care gestionează Securitatea, Baza de Date și API-urile. |
| **Git / GitHub Desktop** | Git e sistemul ce salvează istoricul fișierelor. Desktop e programul visual pentru a face Commit și Push. |
| **Hook (ex. useState)** | Funcții React speciale (încep mereu cu "useX"). Merg DOAR în **Client Components**. |
| **JSX / TSX** | Așa se cheamă HTML-ul scris în interiorul limbajului de Javascript/Typescript. |
| **Layout** | Piesa părinte care stă mereu pe ecran (de exemplu un meniu sus și un footer jos). |
| **Next.js** | Un "Framework" (Sistem) peste React, care se ocupă cu Rutele de Pagină (`/link`), Server Rendering (Viteză). |
| **Node.js** | Motorul care ridică "Dev Server"-ul și te lasă să aprinzi consola pe propriul tău calculator. |
| **pnpm** | Unelte de descărcat de pe internet Dependențe pe care alte firme le-au pus la liber de folosit. |
| **PR (Pull Request)** | Acțiunea prin care ceri liderului să unească munca de pe Branch-ul tău înapoi în proiectul mare (Main). |
| **Props** | Variabile pe care le trimiți "în jos" către componentele fiice pentru a le schimba datele din interior. |
| **React** | Modul de a scrie Interfețe în anul 202X. Totul devine din pagini statice, Componente Refolosibile care se reîncarcă. |
| **Rute (Routes)** | Folderele pe care le faci tu în fișierul `/app` și dictează unde aterizează userul în linkul site-ului. |
| **Server Component** | Piesă React ce este procesată la București pe server, înainte să plece spre PC-ul clientului. (Viteza Maxima). **Implicită (Default) în NextJS.** |
| **shadcn** | Librărie de componente gata făcute (Butoane, Meniuri). Se instalează direct din consolă. |
| **State** | O metodă (folosind `useState`) prin care o componentă "ține minte" date și devine interactivă. |
| **Supabase** | Platforma Back-End folosită de proiect. Gestionează Autentificarea, Baza de Date și Notificările. |
| **Tailwind CSS** | Un framework de tip utility-first. Pui clase precum `className="p-4 bg-red-500"` pentru styling direct în HTML. |
| **Terminal / Consolă** | Fereastra neagră cu text alb din Antigravity unde dai comenzi gen `pnpm dev`. |
| **TypeScript (TS)** | Cum se scrie JavaScipt dar FĂRĂ ERORI NEVAZUTE (te obligă să pui tipuri la variabile `text: string`). Filele se termină mereu în `.tsx` pe Frontend. |
| **Vercel** | Platforma Cloud de Hosting pe Internet unde Liderul Urcă Proiectul Live la Public. |

---

**Sfat:** Dacă o să auzi lucruri pe care nu le găsești aici pe lista asta, dă-i un Google repede sau țipă pe grup.

<br><br>
  <hr>
<br><br>

# 📖 Glossary — Terms You'll Hear (English)

> Quick reference for jargon that comes up during development. Ctrl+F to search.

---

| Term | What It Means |
|------|--------------|
| **Antigravity** | Our code editor. This is where we write all the code |
| **API** | Application Programming Interface — a way for the frontend to talk to the backend (e.g., "fetch data from the API") |
| **Client Component** | A React component that runs in the browser. Required for interactivity (`useState`, `onClick`). Marked with `"use client"` at the top |
| **Component** | A reusable piece of UI. Like a function that returns HTML |
| **CSS** | Cascading Style Sheets — how things are styled. Tailwind is used instead of writing raw CSS |
| **Dependencies** | External libraries the project uses (listed in `package.json`). Installed via `pnpm install` |
| **Dev Server** | The local server that runs your app during development (`pnpm dev`). Auto-reloads when you save files |
| **Environment Variables** | Secret config values stored in `.env.local`. Never committed to Git |
| **ESLint** | A tool that checks your code for mistakes and style issues. Shows warnings/errors in Antigravity |
| **Frontend** | The part of the app users see and interact with (HTML, CSS, JavaScript in the browser) |
| **Backend** | The part of the app that runs on the server (API routes, database queries). |
| **Git / GitHub Desktop** | Git tracks every change. Desktop is the UI where you click to Commit and Push code |
| **Hook** | A special React function (starts with `use`, like `useState`, `useEffect`). Only works in Client Components |
| **Hot Reload** | When you save a file and the browser automatically updates without you refreshing. Handled by the dev server |
| **JSX / TSX** | HTML-like syntax inside JavaScript/TypeScript files. `TSX` = TypeScript + JSX |
| **Layout** | A wrapper component that surrounds pages (e.g., a navbar that appears on every page) |
| **Middleware** | Code that runs between the user's request and the response. Our `proxy.ts` is middleware |
| **Next.js** | The React framework used by the project. Adds routing, server rendering, and other features on top of React |
| **Node.js** | The runtime that lets JavaScript run outside a browser. Required to run the dev server |
| **npm / pnpm** | Package managers. `pnpm` is used to download and manage dependencies |
| **Package** | A library/module published on npm. E.g., `react`, `@supabase/supabase-js` |
| **Page** | In Next.js, a `page.tsx` file that maps to a URL route |
| **pnpm** | The project's package manager. Like npm but faster and stricter. Commands start with `pnpm` |
| **PR (Pull Request)** | A GitHub feature that lets teammates review your code before it's merged into `main` |
| **Props** | Properties passed to a component, like HTML attributes. E.g., `<Button variant="outline">` |
| **React** | The JavaScript library used for building UI. Everything is components |
| **Route** | A URL path in the app, e.g., `/dashboard` or `/profile`. Defined by folder structure in `app/` |
| **Route Group** | A folder name in parentheses like `(dashboard)` that organizes files without affecting the URL |
| **RSC** | React Server Components — components that render on the server (the default in Next.js) |
| **Server Component** | A component that runs on the server (default). Cannot use hooks or event handlers |
| **shadcn** | the project's UI component library. Provides pre-styled components (Button, Card, Dialog, etc.) |
| **State** | Data that a component "remembers" between renders. Managed with `useState` |
| **Supabase** | The project's backend-as-a-service. Provides database, auth, and real-time features. |
| **Tailwind CSS** | A CSS framework that uses utility classes instead of writing CSS. E.g., `className="p-4 text-xl"` |
| **Terminal** | The command-line interface where you run commands like `pnpm dev` |
| **TypeScript (TS)** | JavaScript with types. Catches errors before runtime. Files end in `.ts` or `.tsx` |
| **Vercel** | The platform where our app is deployed (hosted on the internet) |

---

**Tip:** If someone says a term not on this list, Google `"<term> web development"` or ask in the group chat.
