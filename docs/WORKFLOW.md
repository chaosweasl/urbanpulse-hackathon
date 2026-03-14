# 🔄 Ghid de Lucru — Cum scrii cod, cum folosești GitHub Desktop și cum adaugi componente

> **Citește asta după [SETUP.md](./SETUP.md) și [STRUCTURE.md](./STRUCTURE.md).**

---

## Cuprins

1. [Ciclul Tău Zilnic de Lucru](#1-ciclul-tău-zilnic-de-lucru)
2. [Esențialul despre Git (cu GitHub Desktop)](#2-esențialul-despre-git-cu-github-desktop)
3. [Cum scrii Componente React (Curs rapid de JSX/TSX)](#3-cum-scrii-componente-react-curs-rapid-de-jsxtsx)
4. [Stilizare cu Tailwind CSS](#4-stilizare-cu-tailwind-css)
5. [Cum folosești Componentele shadcn](#5-cum-folosești-componentele-shadcn)
6. [Cum adaugi noi Componente shadcn](#6-cum-adaugi-noi-componente-shadcn)
7. [Iconițe (Hugeicons)](#7-iconițe-hugeicons)
8. [Client vs. Server Components (IMPORTANT)](#8-client-vs-server-components-important)
9. [Rețete și Șabloane Utile](#9-rețete-și-șabloane-utile)
10. [Resurse de Învățare](#10-resurse-de-învățare)

---

## 1. Ciclul Tău Zilnic de Lucru

De fiecare dată când te așezi să scrii cod, urmează pașii aceștia în ordine:

1. **Ia ultimul cod:** Deschide GitHub Desktop și apasă `Fetch origin` (apoi `Pull` dacă apare).
2. **Instalează ce e nou:** Deschide terminalul în Antigravity și rulează `pnpm install` (în caz că cineva a adăugat pachete noi).
3. **Pornește serverul:** Rulează `pnpm dev` în consolă.
4. **Lucrează:** Editează fișiere, salvează (Ctrl+S / Cmd+S). Browserul se va actualiza automat.
5. **Salvează pe GitHub:** Mergi în GitHub Desktop, adaugă un titlu descriptiv, dă Commit și apoi Push.

---

## 2. Esențialul despre Git (cu GitHub Desktop)

Git ține minte fiecare modificare pe care ai făcut-o. GitHub Desktop este aplicația care face acest sistem (Git) foarte ușor de folosit cu butoane, în loc de comenzi în terminal.

### Cum salvezi și trimiți munca ta (Commit & Push)

1. Deschide **GitHub Desktop**. În stânga vei vedea o listă cu fișierele pe care le-ai modificat.
2. Bifează fișierele pe care vrei să le salvezi (de obicei pe toate).
3. În colțul din stânga-jos, există o căsuță **Summary (required)**. Aici scrii DOAR **CE** ai făcut (ex: "Am adăugat pagina de profil"). Scrie clar, nu scrie "chestii noi".
4. Apasă butonul albastru **Commit to...**. Acum modificările tale sunt salvate "local" (doar pe calculatorul tău).
5. Mai sus, va apărea un buton albastru **Push origin**. Apasă-l pentru a trimite totul pe cloud-ul GitHub, astfel încât și ceilalți să poată prelua codul tău.

### Cum lucrezi pe Propriul Tău "Branch"

Pentru a nu ne încurca unul pe altul când lucrăm la același fișier, se folosesc "branch-uri" (ramuri). Gândește-te la asta ca la o copie a codului tău izolată de restul. Când termini, codul se va "lipi" la loc (vezi Pull Request mai jos).

1. În **GitHub Desktop**, dă click pe secțiunea de sus-mijloc unde scrie **Current Branch** (de obicei scrie `main`).
2. Dă click pe butonul **New Branch**.
3. Pune-i un nume, de exemplu `numele-tau/ce-faci-acum` (ex: `andrei/layout-dashboard`).
4. Dă click pe **Create Branch** și apoi pe **Publish Branch** ca să o urci pe server.
5. Lucrează liniștit, dând commit-uri.

La final, odată ce ai dat Push la tot, mergi pe site-ul de la GitHub, caută butonul **Compare & pull request** ca să ceri liderului echipei să unească munca ta cu a celorlalți în `main`.

---

## 3. Cum scrii Componente React (Curs rapid de JSX/TSX)

Dacă știi bazele programării, React va fi simplu. Principala diferență este că scrii cod HTML *în interiorul* JavaScript-ului.

**Așa se scrie în HTML standard:**
```html
<div class="container">
  <h1>Aici e HTML</h1>
</div>
```

**Așa se scrie în React (TSX):**
```tsx
<div className="container">
  <h1>Aici e React</h1>
</div>
```

> ⚠️ Prima regulă: **Cuvântul HTML `class` devine OBLIGATORIU `className` în React.**

### Crearea unei Componente

O componentă React e doar o funcție de Javascript/Typescript care returnează HTML (JSX):

```tsx
// components/WelcomeBanner.tsx

export default function WelcomeBanner() {
  return (
    <div className="p-4 bg-blue-100 rounded-lg">
      <h2 className="text-xl font-bold">Bine ai venit pe UrbanPulse!</h2>
      <p>Cartierul tău, conectat.</p>
    </div>
  )
}
```

Reguli cheie:
- **Numele funcției TREBUIE OBLIGATORIU să înceapă cu Literă Mare** (`WelcomeBanner`, NU `welcomeBanner`).
- **Poți returna doar UN SINGUR element de bază root.** Dacă ai mai multe elemente la același nivel, învelește-le într-un `<div>` sau `<> ... </>` (fragment gol).
- **Folosește `export default`** la funcție ca să poată fi importată de alte fișiere.

### Cum folosești Componenta ta

E ca și cum ai crea propriul tău tag HTML:

```tsx
// app/page.tsx

import WelcomeBanner from "@/components/WelcomeBanner"

export default function HomePage() {
  return (
    <div>
      <WelcomeBanner />  {/* <-- Așa folosești componenta */}
      <p>Alte chestii aici.</p>
    </div>
  )
}
```

### Props-uri (Parametrii unei Componente)

Props-urile (*proprietăți*) sunt ca parametrii dintr-o funcție standard, prin care trimiți date mai jos către o componentă:

```tsx
// components/PulseCard.tsx

type PulseCardProps = {
  title: string
  urgency: "low" | "medium" | "high"
  description: string
}

export default function PulseCard({ title, urgency, description }: PulseCardProps) {
  return (
    <div className="p-4 border rounded-lg">
      <h3 className="font-bold">{title}</h3>
      <span className="text-sm text-gray-500">{urgency}</span>
      <p>{description}</p>
    </div>
  )
}
```

Dacă o folosești în alt fișier, îi dai valori așa:

```tsx
<PulseCard 
  title="Câine Pierdut" 
  urgency="high" 
  description="Golden retriever salvat de un vecin azi." 
/>
```

### JavaScript "injectat" în interiorul HTML (JSX)

Orice vrei să scrii "cod logic" direct în HTML, îi pui acolade `{}`:

```tsx
export default function Greeting() {
  const name = "Andrei"
  const isOnline = true

  return (
    <div>
      {/* Acesta este un comentariu în React JSX */}
      <h1>Salut, {name}!</h1>
      
      {/* Afișare condiționată (Dacă X este adevărat afișează Y) */}
      {isOnline && <span className="text-green-500">● Online</span>}
      
      {/* Operator temerar If/Else */}
      <p>{isOnline ? "Bine ai revenit!" : "Ești deconectat"}</p>
    </div>
  )
}
```

### Liste și Loop-uri (cum afișezi un for)

În React nu ai comanda de `for`, te folosești de `.map()`:

```tsx
const notificari = ["A căzut curentul", "Pisică pierdută", "Chefal la grătar diseară"]

return (
  <ul>
    {notificari.map((alerta, index) => (
      <li key={index}>{alerta}</li>
    ))}
  </ul>
)
```

> **⚠️ Întotdeauna pune atributul `key`** când faci un map / liste. Dă-i un ID unic din baza de date al elementului, dacă nu ai, pune măcar indexul din array.

### State (Cum faci elementele interactive)

Aici intrăm în codul interactiv. Așa salvezi date temporar (memoria internă a interfeței):

```tsx
"use client"  // ← OBLIGATORIU pentru butoane și state (citește Secțiunea 8!)

import { useState } from "react"

export default function Counter() {
  const [count, setCount] = useState(0) // count = var; setCount = setVar

  return (
    <div>
      <p>Scor: {count}</p>
      {/* Când apăs, apelează setterul și adună ++ */}
      <button onClick={() => setCount(count + 1)}> 
        Adaugă Punct
      </button>
    </div>
  )
}
```

---

## 4. Stilizare cu Tailwind CSS

Folosim **Tailwind CSS**. Asta înseamnă că nu mai scriem sute de fișiere de `.css` separate și le importăm. Efectiv vom trece design-ul prin `className`.

### Modul de funcționare

| Comanda standard din CSS | Clasa din Tailwind | Cum pui în HTML / React |
|---|---|---|
| `padding: 16px` | `p-4` | `<div className="p-4">` |
| `margin: 8px` | `m-2` | `<div className="m-2">` |
| `font-size: 20px` | `text-xl` | `<p className="text-xl">` |
| `font-weight: bold` | `font-bold` | `<p className="font-bold">` |
| `color: red` | `text-red-500` | `<p className="text-red-500">` |
| `background: blue` | `bg-blue-500` | `<div className="bg-blue-500">` |
| `border-radius: 8px` | `rounded-lg` | `<div className="rounded-lg">` |
| `display: flex` | `flex` | `<div className="flex">` |
| `gap: 8px` | `gap-2` | `<div className="flex gap-2">` |
| `width: 100%` | `w-full` | `<div className="w-full">` |

### Spațierea 

Fiecare bucățică normală din Tailwind e un multiplu de 4px:
- `p-1` = 4px
- `p-2` = 8px
- `p-3` = 12px
- `p-4` = 16px ...

### Direcții de Margini și Padding

Când vrei în anumite locuri specifice să pui spațiere:
- `pt-4` = padding DOAR sus (top = t)
- `pb-4` = padding DOAR jos (bottom = b)
- `pl-4` / `pr-4` = stânga (left) și dreapta (right)
- `px-4` = padding pe ambele verticale (pe stânga și dreapta deci pe baxa X)
- `py-4` = padding DOAR sus și jos (axa Y).

Același lucru se aplică pe `margin`: `mb-4`, `mt-4`, `my-4`, `mx-auto` (se centrează pe mijloc).

### Flexbox (Baza pentru aranjarea elementelor)

Pentru a pune elementele orizontal / vertical, vei folosi tot clasele Tailwind `flex`:

```tsx
{/* Rând orizontal spațiat (pe x) */}
<div className="flex gap-4">
  <div>Element 1</div>
  <div>Element 2</div>
</div>

{/* Coloană (vertical pe y) */}
<div className="flex flex-col gap-4">
  <div>Element 1</div>
  <div>Element 2</div>
</div>

{/* Pe centru absolut */}
<div className="flex items-center justify-center">
  <div>Sunt pe mijloc!</div>
</div>
```

### Design Responsive (Adaptarea la telefoane / tablete)

Tailwind e "Mobile First". Adică dacă scrii doar `p-4`, padding-ul acesta stă peste tot (și pc și telefon).
Vei pune Prefixuri pentru a modifica codul când lățimea ecranului trece de un număr:
- `sm:` (Telefon / Tabletă Mică)
- `md:` (Tabletă Mare)
- `lg:` / `xl:` (Laptop și PC)

```tsx
{/* 1 coloană pe telefon. Dar pui md: (tableta+) să se facă de 2, la laptop de 3 coloane */}
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
  <div>Card 1</div>
  <div>Card 2</div>
  <div>Card 3</div>
</div>

{/* Buton vizibil doar pe laptop în sus (pe tel nu se randează deloc ptc e hidden implicit) */}
<div className="hidden lg:block">Ascuns mereu, până apare laptopul</div>
```

### Culorile Temei

Avem setate o grămadă de variabile dinamice ca să bată cu Dark Mode/Light Mode. NU FOLOSI CULORI STATICE (ex `bg-gray-100` / `text-gray-900`) DACĂ POȚI EVITA:

```tsx
{/* Culori Aprobate ✅: */}
<div className="bg-background text-foreground">
<div className="bg-primary text-primary-foreground">
<div className="bg-muted text-muted-foreground">
<div className="bg-card text-card-foreground">
<div className="border border-border">
<div className="bg-destructive text-white">
```

### Funcția utilitară `cn()`

Dacă vrei să activezi ceva de Tailwind condiționat la apăsare, combină listele printr-un helper (o să ai nevoie de ea, va reveni):

```tsx
import { cn } from "@/lib/utils"

<div className={cn(
  "p-4 rounded-lg",                              // se aplică mereu oricum ar fi
  isActive && "bg-primary text-primary-foreground", // dacă varțiația din State (isActive) e true, ii adaugăm clasele
  isUrgent ? "border-red-500" : "border-border"     // Dacă vrea urgent punem roșu, dacă nu doar border chior
)}>
```

---

## 5. Cum folosești Componentele shadcn

Nu stăm noi să construim de la zero butoane sau animații perfecte. Folosim ShadCN UI. Ai grijă mereu să te uiți pe site-ul lor ca să pui codul copy-paste.
Docs: [ui.shadcn.com](https://ui.shadcn.com/docs/components)

Avem instalate 3 standard: Buton, Input, Card. 

```tsx
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

export default function SearchBar() {
  return (
    <div className="flex gap-2">
      <Input placeholder="Caută pulse-uri..." />
      <Button variant="destructive">Dă-i Search!</Button>
    </div>
  )
}
```

---

## 6. Cum adaugi noi Componente shadcn

Dacă vrei o căsuță Dropdown / Select bar / un Dialog, trebuie instalate fiecare:

1. Deschide terminalul Antigravity. Asigură-te că serverul (pnpm dev) e oprit (sau deschide un terminal nou)
2. Rulează comanda de install adăugând numele componentei. Exemplu:

```bash
pnpm dlx shadcn@latest add dialog
pnpm dlx shadcn@latest add select
pnpm dlx shadcn@latest add textarea
pnpm dlx shadcn@latest add sonner
```

Dacă te întreabă să le dea "overwrite" -> scrie `y` și apasă enter, e ca un mini-update la ele. Apoi ele vor fi gata băgate și exportate de tine în `components/ui`. Apoi doar intri la [shadcn docs](https://ui.shadcn.com/docs/components) și de acolo iei copy și paste ca să știi exact cum să le apelezi de la ei din site.

---

## 7. Iconițe (Hugeicons)

Folosim suita [Hugeicons](https://hugeicons.com).

1. Caută ce vrei pe site. Găsește o iconiță și bagă ochiul pe numele ei, apoi adaugă mereu `FreeIcon` la sfârșitul numelui oficial. E un sistem free al lor.

```tsx
import { Home01FreeIcon, Search01FreeIcon } from "@hugeicons/core-free-icons"
import { HugeIcon } from "@hugeicons/react"

export default function MyComponent() {
  return (
    <div className="flex items-center gap-2">
      {/* 24 e un numar bun de vizibilitate px */}
      <HugeIcon icon={Home01FreeIcon} size={24} /> 
      <span>Acasă</span>
    </div>
  )
}
```

---

## 8. Client vs. Server Components (IMPORTANT)

Cea mai mare sursă de erori într-un proiect de web modern ca Next.js. Ai mare grijă cum le alegi:

### 🌐 Server Components (DEFAULT)
Dacă faci doar o pagină sau un component dintr-un fișier complet nou `.tsx`, **E PE SERVER (RSC = React Server Component) DIN START.** Gândește-te că ea rulează DOAR ÎN SPATE la Google Cloud (Nu pe PC-ul utilizatorului, ca în cazul aplicațiilor native). Ele nu au butoane ciudate sau `onclick`. Pot extrage direct logica din Baza de Date, deci zero load times.

Nu pot face deloc `useState`, nu au Clickuri sau orice presupune un Eveniment dintr-un Mous/Tastatura în ele!

### 💻 Client Components (INTERACTIVE)
Sunt cele pe care le folosim pentru logică în Front-End / Animații de Stare. La un astfel de component de interacțiune, OBLIGATORIU trebuie la linia nr. 1 în tot fișierul, chiar deasupra tuturor import-urilor să scrii textul dublu-ghilimele:

```tsx
"use client"  // ← E fix la prima linie! El face din component un front-end Client rule

import { useState } from "react"
//...
```

**De Reținut:** Încearcă să nu faci *toate paginile* ca fiind cu `"use client"`. O idee inteligentă este să ții Pagina / Pagina Părinte generală curată de tagul cu client, și să extragi doar ce vrei să fie interactiv de user tot timpul sub forma de alt "Mini Client Component" de unul singur. Adică "ține server-ul pt textul paginii, ține clientul mic pentru fix bucățica ce se clikcează".

Erori precum *"useState is not a function"* sau *"Event handlers cannot be passed to Server Components"* înseamnă direct că **TU AI UITAT SĂ ADĂUGĂ TAGUL `"use client"` LA ÎNCEPUTUL FIȘIERULUI! :)**

---

## 9. Rețete și Șabloane Utile

Aici vom plasa cele mai cunoscute form-uri, cu logică în ele. Revizuiește-le când ai timp sau ai nevoie să dai copy/paste să faci un formular pentru logare sau etc, totul pentru hackathon va fi în Engleză ca doc-string, iar rețetele vor fi mai jos:

> Vezi rețetele direct în versiunea englezească a paginii mai jos. (scroll)

---

## 10. Resurse de Învățare

> 📚 **Am mutat toate tutorialele, referințele și explicațiile video-urilor în [LEARNING.md](./LEARNING.md).**
> Citește acel document dacă ești la prima interacțiune cu acest tech stack!

> **💡 Scurt Ghid TypeScript:** <br>
*   `const nume: string = "Andrei"` -> Variabilă constantă (nu se poate reatribui).
*   `let cnt: number = 0` -> Variabilă normală (se poate reatribui).
*   Obiecte: `type Obj = {id: string; ...}`. Proprietățile opționale au un semn de întrebare: `type Val = { val_bun?: number }`.

Spor la construit aplicația! Aruncă un ochi la Engleză sau dacă ești nesigur de alte coduri! 😎

<br><br>
  <hr>
<br><br>

# 🔄 Workflow Guide — Writing Code, Using GitHub Desktop, and Adding Components (English)

> **Read this after [SETUP.md](./SETUP.md) and [STRUCTURE.md](./STRUCTURE.md).**

---

## Table of Contents

1. [Your Day-to-Day Development Loop](#1-your-day-to-day-development-loop-eng)
2. [Git Essentials (Using GitHub Desktop)](#2-git-essentials-using-github-desktop-eng)
3. [Writing React Components (JSX/TSX Crash Course)](#3-writing-react-components-jsxtsx-crash-course-eng)
4. [Styling with Tailwind CSS](#4-styling-with-tailwind-css-eng)
5. [Using shadcn Components](#5-using-shadcn-components-eng)
6. [Adding New shadcn Components](#6-adding-new-shadcn-components-eng)
7. [Using Icons (Hugeicons)](#7-using-icons-hugeicons-eng)
8. [Client vs. Server Components (IMPORTANT)](#8-client-vs-server-components-important-eng)
9. [Common Patterns & Recipes](#9-common-patterns--recipes-eng)
10. [Learning Resources](#10-learning-resources-eng)

---

## 1. Your Day-to-Day Development Loop <a name="1-your-day-to-day-development-loop-eng"></a>

Every time you sit down to code, follow this order:

1. **Get the latest code:** Open GitHub Desktop and click `Fetch origin` (then `Pull` if it appears).
2. **Install updates:** Open the Antigravity terminal and run `pnpm install` (just in case new packages were added).
3. **Start the server:** Run `pnpm dev` in the terminal.
4. **Make changes:** Edit files, save, see live updates in the browser.
5. **Save and push:** Go to GitHub Desktop, write a commit message, Commit, and Push.

---

## 2. Git Essentials (Using GitHub Desktop) <a name="2-git-essentials-using-github-desktop-eng"></a>

Git tracks every change to every file. GitHub Desktop provides a visual interface for Git instead of confusing terminal commands.

### Saving Your Work (Commit & Push)

1. Open **GitHub Desktop**. On the left, you'll see a list of files you changed.
2. Ensure the files you want to save are checked.
3. In the bottom-left, there's a **Summary (required)** box. Write clearly **what** you did (e.g., "Added dashboard layout"). Don't just write "updates".
4. Click the blue **Commit to...** button. Your changes are now saved "locally" to your computer.
5. Click the blue **Push origin** button at the top to send your changes to the cloud so everyone else can get them.

### Working on Branches

To avoid breaking the main application while someone else is working on it, work on branches:

1. In **GitHub Desktop**, click where it says **Current Branch** (usually `main`) at the top.
2. Click **New Branch**.
3. Name it something descriptive like `alex/dashboard-layout`.
4. Click **Create Branch**, then **Publish Branch** to upload it to the server.
5. Code and commit as usual.

When done, open GitHub in your browser and click "Compare & pull request" to ask the team lead to merge your work back into `main`.

---

## 3. Writing React Components (JSX/TSX Crash Course) <a name="3-writing-react-components-jsxtsx-crash-course-eng"></a>

If you know basic programming, React will feel familiar. Here's the key difference:

**HTML:**
```html
<div class="container">
  <h1>Hello</h1>
</div>
```

**React (TSX):**
```tsx
<div className="container">
  <h1>Hello</h1>
</div>
```

That's the first rule: **use `className` instead of `class`.**

### Creating a Component

A React component is just a function that returns JSX (HTML-like syntax):

```tsx
// components/WelcomeBanner.tsx

export default function WelcomeBanner() {
  return (
    <div className="p-4 bg-blue-100 rounded-lg">
      <h2 className="text-xl font-bold">Welcome to UrbanPulse!</h2>
      <p>Your neighborhood, connected.</p>
    </div>
  )
}
```

Key rules:
- **The function name must start with a capital letter** (`WelcomeBanner`, not `welcomeBanner`)
- **You can only return ONE root element.** If you need multiple, wrap them in a `<div>` or use `<>...</>` (a "fragment")
- **Export it** so other files can use it

### Using Components

Once you create a component, import and use it like an HTML tag:

```tsx
// app/page.tsx

import WelcomeBanner from "@/components/WelcomeBanner"

export default function HomePage() {
  return (
    <div>
      <WelcomeBanner />
      <p>Other content here</p>
    </div>
  )
}
```

### Props (Passing Data to Components)

Props are like HTML attributes but for your components:

```tsx
// components/PulseCard.tsx

type PulseCardProps = {
  title: string
  urgency: "low" | "medium" | "high"
  description: string
}

export default function PulseCard({ title, urgency, description }: PulseCardProps) {
  return (
    <div className="p-4 border rounded-lg">
      <h3 className="font-bold">{title}</h3>
      <span className="text-sm text-gray-500">{urgency}</span>
      <p>{description}</p>
    </div>
  )
}
```

Using it:

```tsx
<PulseCard 
  title="Lost Dog" 
  urgency="high" 
  description="Golden retriever seen near the park" 
/>
```

### JavaScript Inside JSX

Use curly braces `{}` to drop JavaScript into your JSX:

```tsx
export default function Greeting() {
  const name = "Alex"
  const isOnline = true

  return (
    <div>
      {/* This is a comment in JSX */}
      <h1>Hello, {name}!</h1>
      
      {/* Conditional rendering */}
      {isOnline && <span className="text-green-500">● Online</span>}
      
      {/* Ternary (if/else) */}
      <p>{isOnline ? "Welcome back!" : "You're offline"}</p>
    </div>
  )
}
```

### Lists and Loops

To render a list, use `.map()`:

```tsx
const alerts = ["Power outage", "Lost pet", "Community event"]

return (
  <ul>
    {alerts.map((alert, index) => (
      <li key={index}>{alert}</li>
    ))}
  </ul>
)
```

> **⚠️ Always include a `key` prop** when rendering lists. Use a unique ID if available, or `index` as a fallback.

### State (Making Things Interactive)

State is how you make components remember things and react to user input:

```tsx
"use client"  // ← REQUIRED for any component that uses state (see Section 8)

import { useState } from "react"

export default function Counter() {
  const [count, setCount] = useState(0)

  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={() => setCount(count + 1)}>
        Increment
      </button>
    </div>
  )
}
```

Key rules:
- `useState` returns `[currentValue, setterFunction]`
- **Never** modify state directly (`count = 5` ❌). Always use the setter (`setCount(5)` ✅)
- When a state value changes, React automatically re-renders the component

---

## 4. Styling with Tailwind CSS <a name="4-styling-with-tailwind-css-eng"></a>

We use **Tailwind CSS** for styling. Instead of writing CSS files, you apply styles directly as class names.

### The Basics

| CSS Property | Tailwind Class | Example |
|---|---|---|
| `padding: 16px` | `p-4` | `<div className="p-4">` |
| `margin: 8px` | `m-2` | `<div className="m-2">` |
| `font-size: 20px` | `text-xl` | `<p className="text-xl">` |
| `font-weight: bold` | `font-bold` | `<p className="font-bold">` |
| `color: red` | `text-red-500` | `<p className="text-red-500">` |
| `background: blue` | `bg-blue-500` | `<div className="bg-blue-500">` |
| `border-radius: 8px` | `rounded-lg` | `<div className="rounded-lg">` |
| `display: flex` | `flex` | `<div className="flex">` |
| `gap: 8px` | `gap-2` | `<div className="flex gap-2">` |
| `width: 100%` | `w-full` | `<div className="w-full">` |

### Spacing Scale

Tailwind uses a number scale for spacing. Each unit = 4px:

| Class | Pixels |
|-------|--------|
| `p-1` | 4px |
| `p-2` | 8px |
| `p-3` | 12px |
| `p-4` | 16px |
| `p-6` | 24px |
| `p-8` | 32px |

This works for `m-` (margin), `p-` (padding), `gap-`, `w-`, `h-`, etc.

### Direction-Specific Spacing

| Class | Meaning |
|-------|---------|
| `pt-4` | padding-top |
| `pb-4` | padding-bottom |
| `pl-4` | padding-left |
| `pr-4` | padding-right |
| `px-4` | padding left + right |
| `py-4` | padding top + bottom |

Same pattern for margins: `mt-4`, `mb-4`, `mx-auto`, etc.

### Flexbox (Layouts)

Most layouts use flexbox. Here are the essentials:

```tsx
{/* Horizontal row with gap */}
<div className="flex gap-4">
  <div>Item 1</div>
  <div>Item 2</div>
</div>

{/* Vertical column */}
<div className="flex flex-col gap-4">
  <div>Item 1</div>
  <div>Item 2</div>
</div>

{/* Center everything */}
<div className="flex items-center justify-center">
  <div>I'm centered!</div>
</div>

{/* Space items apart */}
<div className="flex justify-between">
  <div>Left</div>
  <div>Right</div>
</div>
```

### Grid Layouts

For grid layouts:

```tsx
{/* Two equal columns */}
<div className="grid grid-cols-2 gap-4">
  <div>Column 1</div>
  <div>Column 2</div>
</div>

{/* Three columns */}
<div className="grid grid-cols-3 gap-4">
  <div>Col 1</div>
  <div>Col 2</div>
  <div>Col 3</div>
</div>
```

### Responsive Design

Tailwind has breakpoint prefixes. Classes without a prefix apply to **all** screen sizes. Prefixed classes apply at that size **and larger**:

| Prefix | Min width | Rough meaning |
|--------|----------|--------------|
| (none) | 0px | Mobile (default) |
| `sm:` | 640px | Large phones |
| `md:` | 768px | Tablets |
| `lg:` | 1024px | Laptops |
| `xl:` | 1280px | Desktops |

**Example — mobile-first responsive layout:**

```tsx
{/* 1 column on mobile, 2 on tablet, 3 on desktop */}
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
  <div>Card 1</div>
  <div>Card 2</div>
  <div>Card 3</div>
</div>
```

### Using Theme Colors

Our project has theme colors defined in `globals.css`. Use them instead of raw colors:

```tsx
{/* ✅ Use theme colors */}
<div className="bg-background text-foreground">
<div className="bg-primary text-primary-foreground">
<div className="bg-muted text-muted-foreground">
<div className="bg-card text-card-foreground">
<div className="border border-border">
<div className="bg-destructive text-white">

{/* ❌ Avoid raw colors when possible */}
<div className="bg-gray-100 text-gray-900">
```

### The `cn()` Helper

When you need to combine classes or make them conditional, use our `cn()` helper:

```tsx
import { cn } from "@/lib/utils"

<div className={cn(
  "p-4 rounded-lg",                              // always applied
  isActive && "bg-primary text-primary-foreground", // applied if isActive is true
  isUrgent ? "border-red-500" : "border-border"     // conditional
)}>
```

### Where to Learn More

- **Full class reference:** [https://tailwindcss.com/docs](https://tailwindcss.com/docs)
- **Search for any CSS property:** Just Google `tailwind [css property]`, e.g., "tailwind box shadow"

---

## 5. Using shadcn Components <a name="5-using-shadcn-components-eng"></a>

shadcn is our **UI component library**. It provides pre-built, beautiful components like buttons, cards, inputs, dialogs, etc.

### What's Already Installed

We currently have these components ready to use:

| Component | Import | Docs |
|-----------|--------|------|
| Button | `import { Button } from "@/components/ui/button"` | [shadcn/button](https://ui.shadcn.com/docs/components/button) |
| Card | `import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card"` | [shadcn/card](https://ui.shadcn.com/docs/components/card) |
| Input | `import { Input } from "@/components/ui/input"` | [shadcn/input](https://ui.shadcn.com/docs/components/input) |

### Example: Using a Button

```tsx
import { Button } from "@/components/ui/button"

export default function MyPage() {
  return (
    <div className="p-8 flex gap-4">
      {/* Default button */}
      <Button>Click Me</Button>

      {/* Variants */}
      <Button variant="outline">Outline</Button>
      <Button variant="secondary">Secondary</Button>
      <Button variant="ghost">Ghost</Button>
      <Button variant="destructive">Delete</Button>
      <Button variant="link">Link Style</Button>

      {/* Sizes */}
      <Button size="sm">Small</Button>
      <Button size="lg">Large</Button>
    </div>
  )
}
```

### Example: Using a Card

```tsx
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export default function PulseCard() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>🔧 Need: Drill for 30 minutes</CardTitle>
        <CardDescription>Posted by Ahmed • 200m away • 5 min ago</CardDescription>
      </CardHeader>
      <CardContent>
        <p>I need to hang some shelves. Anyone have a drill I can borrow for half an hour?</p>
        <div className="mt-4 flex gap-2">
          <Button>I Can Help!</Button>
          <Button variant="outline">Message</Button>
        </div>
      </CardContent>
    </Card>
  )
}
```

### Example: Using an Input

```tsx
import { Input } from "@/components/ui/input"

export default function SearchBar() {
  return (
    <div className="flex gap-2">
      <Input placeholder="Search pulses..." />
      <Button>Search</Button>
    </div>
  )
}
```

---

## 6. Adding New shadcn Components <a name="6-adding-new-shadcn-components-eng"></a>

Need a component that isn't installed yet (e.g., `Dialog`, `Select`, `Tabs`, `Avatar`)? Here's how to add it:

### Step 1: Find the Component

Browse all available components at [https://ui.shadcn.com/docs/components](https://ui.shadcn.com/docs/components)

### Step 2: Install It

Run this command in your Antigravity terminal (make sure the dev server is stopped first, or use a new terminal tab):

```bash
pnpm dlx shadcn@latest add <component-name>
```

**Examples:**

```bash
# Add a dialog (modal popup)
pnpm dlx shadcn@latest add dialog

# Add a dropdown menu
pnpm dlx shadcn@latest add dropdown-menu

# Add tabs
pnpm dlx shadcn@latest add tabs

# Add multiple at once
pnpm dlx shadcn@latest add dialog dropdown-menu tabs avatar badge
```

> **⚠️ If it asks you to overwrite files**, type `y` and press Enter — it's updating to the latest version.

### Step 3: Use It

The component file will appear in `components/ui/`. Import and use it:

```tsx
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"

export default function MyComponent() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>Open Dialog</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Are you sure?</DialogTitle>
        </DialogHeader>
        <p>This action cannot be undone.</p>
      </DialogContent>
    </Dialog>
  )
}
```

### Step 4: Check the Docs

Every component has examples on the shadcn site. **Always check the docs page** for the component you're using — it shows all the props and variants:

👉 [https://ui.shadcn.com/docs/components](https://ui.shadcn.com/docs/components)

### Common Components You'll Probably Need

| Component | What it's for | Install command |
|-----------|--------------|----------------|
| `dialog` | Modal popups | `pnpm dlx shadcn@latest add dialog` |
| `select` | Dropdown selects | `pnpm dlx shadcn@latest add select` |
| `tabs` | Tab navigation | `pnpm dlx shadcn@latest add tabs` |
| `badge` | Status labels | `pnpm dlx shadcn@latest add badge` |
| `avatar` | User profile pics | `pnpm dlx shadcn@latest add avatar` |
| `textarea` | Multi-line input | `pnpm dlx shadcn@latest add textarea` |
| `dropdown-menu` | Right-click / action menus | `pnpm dlx shadcn@latest add dropdown-menu` |
| `toast` / `sonner` | Notification popups | `pnpm dlx shadcn@latest add sonner` |
| `separator` | Visual line divider | `pnpm dlx shadcn@latest add separator` |
| `skeleton` | Loading placeholders | `pnpm dlx shadcn@latest add skeleton` |
| `tooltip` | Hover tooltips | `pnpm dlx shadcn@latest add tooltip` |
| `switch` | Toggle switch | `pnpm dlx shadcn@latest add switch` |
| `sheet` | Slide-out panel | `pnpm dlx shadcn@latest add sheet` |

---

## 7. Using Icons (Hugeicons) <a name="7-using-icons-hugeicons-eng"></a>

Our project uses **Hugeicons** for icons. Here's how to use them:

### Finding Icons

Browse available icons at [https://hugeicons.com](https://hugeicons.com)

### Using an Icon

```tsx
import { Home01FreeIcon } from "@hugeicons/core-free-icons"
import { HugeIcon } from "@hugeicons/react"

export default function MyComponent() {
  return (
    <div className="flex items-center gap-2">
      <HugeIcon icon={Home01FreeIcon} size={24} />
      <span>Home</span>
    </div>
  )
}
```

### Common Icons

```tsx
import { 
  Home01FreeIcon,
  Search01FreeIcon,
  Notification01FreeIcon,
  UserFreeIcon,
  Settings01FreeIcon,
  Add01FreeIcon,
  Delete01FreeIcon,
  Edit01FreeIcon,
  Location01FreeIcon,
  MessageFreeIcon
} from "@hugeicons/core-free-icons"
```

> **💡 Tip:** The free icon names all end with `FreeIcon`. Search the Hugeicons website and append `FreeIcon` to the icon name.

---

## 8. Client vs. Server Components <a name="8-client-vs-server-components-important-eng"></a>

This is a **critical concept** in Next.js. Get this wrong and you'll get confusing errors.

### Server Components (the default)

By default, every component in the `app/` folder is a **Server Component**. It runs on the server, not in the browser.

**Server Components CAN:**
- Fetch data directly (no loading states needed)
- Access the database
- Keep secrets safe

**Server Components CANNOT:**
- Use `useState`, `useEffect`, or any React hooks
- Use `onClick`, `onChange`, or any event handlers
- Use browser APIs (like `window` or `localStorage`)

### Client Components

If you need interactivity (clicks, state, forms), add `"use client"` at the very top of your file:

```tsx
"use client"  // ← This line makes it a Client Component

import { useState } from "react"

export default function Counter() {
  const [count, setCount] = useState(0)

  return (
    <button onClick={() => setCount(count + 1)}>
      Clicked {count} times
    </button>
  )
}
```

### When to Use Which

| Scenario | Component Type | Need `"use client"`? |
|----------|---------------|---------------------|
| Static page layout | Server | No |
| Page that just displays data | Server | No |
| Button that does something on click | **Client** | **Yes** |
| Form with inputs | **Client** | **Yes** |
| Anything with `useState` or `useEffect` | **Client** | **Yes** |
| Anything with `onClick`, `onChange`, etc. | **Client** | **Yes** |

### Common Error

If you see this error:

```
Error: useState is not a function
```

or

```
Error: Event handlers cannot be passed to Client Component props
```

You forgot to add `"use client"` at the top of your file!

### Pro Pattern: Keep Client Components Small

A good pattern is to keep your *page* as a Server Component and only make the *interactive pieces* Client Components:

```tsx
// app/dashboard/page.tsx (Server Component — NO "use client")
import { PulseFeed } from "@/components/PulseFeed"

export default function DashboardPage() {
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>
      <PulseFeed />  {/* This is a client component */}
    </div>
  )
}
```

```tsx
// components/PulseFeed.tsx (Client Component — has interactivity)
"use client"

import { useState } from "react"

export function PulseFeed() {
  const [filter, setFilter] = useState("all")
  // ... interactive logic
}
```

---

## 9. Common Patterns & Recipes <a name="9-common-patterns--recipes-eng"></a>

### Recipe: A Complete Page

```tsx
// app/dashboard/page.tsx

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export default function DashboardPage() {
  return (
    <main className="min-h-screen bg-background">
      {/* Top section */}
      <div className="px-6 py-8 max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
        <p className="text-muted-foreground mt-1">Your neighborhood at a glance.</p>
      </div>

      {/* Content grid */}
      <div className="px-6 max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Active Pulses</CardTitle>
          </CardHeader>
          <CardContent>
            <p>No active pulses nearby.</p>
            <Button className="mt-4">Create a Pulse</Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Weather Alert</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Clear skies. No active weather warnings.</p>
          </CardContent>
        </Card>
      </div>
    </main>
  )
}
```

### Recipe: A Form

```tsx
"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"

export default function CreatePulseForm() {
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()  // Prevents the page from reloading
    console.log("Submitted:", { title, description })
    // TODO: Send to backend
  }

  return (
    <Card className="max-w-md">
      <CardHeader>
        <CardTitle>Create a Pulse</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="text-sm font-medium mb-1 block">Title</label>
            <Input 
              value={title} 
              onChange={(e) => setTitle(e.target.value)}
              placeholder="What do you need?"
            />
          </div>
          <div>
            <label className="text-sm font-medium mb-1 block">Description</label>
            <Input 
              value={description} 
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Give some details..."
            />
          </div>
          <Button type="submit">Post Pulse</Button>
        </form>
      </CardContent>
    </Card>
  )
}
```

### Recipe: A List of Items

```tsx
import { Card, CardContent } from "@/components/ui/card"

type Pulse = {
  id: string
  title: string
  type: "need" | "offer" | "alert"
  distance: string
}

const mockPulses: Pulse[] = [
  { id: "1", title: "Need a drill for 30 min", type: "need", distance: "200m" },
  { id: "2", title: "Offering free tomatoes", type: "offer", distance: "50m" },
  { id: "3", title: "Power outage on 5th St", type: "alert", distance: "100m" },
]

export default function PulseList() {
  return (
    <div className="flex flex-col gap-4">
      {mockPulses.map((pulse) => (
        <Card key={pulse.id}>
          <CardContent className="flex justify-between items-center pt-6">
            <div>
              <h3 className="font-medium">{pulse.title}</h3>
              <span className="text-sm text-muted-foreground">{pulse.distance} away</span>
            </div>
            <span className="text-xs uppercase font-semibold bg-muted px-2 py-1 rounded">
              {pulse.type}
            </span>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
```

### Recipe: Conditional Styling Based on Type

```tsx
import { cn } from "@/lib/utils"

type BadgeProps = {
  type: "need" | "offer" | "alert"
}

export function PulseBadge({ type }: BadgeProps) {
  return (
    <span className={cn(
      "text-xs font-semibold px-2.5 py-0.5 rounded-full",
      type === "need" && "bg-blue-100 text-blue-800",
      type === "offer" && "bg-green-100 text-green-800",
      type === "alert" && "bg-red-100 text-red-800",
    )}>
      {type.toUpperCase()}
    </span>
  )
}
```

---

## 10. Learning Resources <a name="10-learning-resources-eng"></a>

> 📚 **We've moved all the tutorials, crash courses, and documentation links to [LEARNING.md](./LEARNING.md).**
> Start there if you are completely new to React, Next.js, and Tailwind CSS!

### TypeScript Survival Guide 

TypeScript is simply JavaScript with types:

```tsx
// Variables
const name: string = "Alex"    // const = can't reassign
let count: number = 0          // let = can reassign

// Functions
function add(a: number, b: number): number {
  return a + b
}

// Arrays
const items: string[] = ["a", "b", "c"]

// Objects
type User = {
  id: string
  name: string
  skills: string[]
  isVerified: boolean
}

// Optional properties
type Profile = {
  bio?: string           // the ? means this is optional
  rating: number
}

// Union types
type Status = "online" | "offline" | "away"
```

> **💡 Pro tip:** If TypeScript is giving you a confusing error, try hovering over the red squiggly line in Antigravity — it often tells you exactly what type it expected vs. what you gave it.

---

**You've got this! Start with the [React Quick Start](https://react.dev/learn), then start building.** When in doubt, check the shadcn docs or ask in the group chat. 🚀
