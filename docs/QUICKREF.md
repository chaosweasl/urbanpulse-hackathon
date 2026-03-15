# ⚡ Referință Rapidă (Cheat Sheet) — Comenzi și Șabloane copy-paste

> Pagină rapidă cu de toate. Ține-o deschisă mereu!

---

## Comenzi Terminal

```bash
# Pornirea server-ului local (teste)
pnpm dev

# Instalare pachete noi (rulează după git pull dac-a mai pus cnv pe github)
pnpm install

# Adăugarea unui component "shadcn"
pnpm dlx shadcn@latest add button

# Adăugare la pachet multiplu (tot în terminal Antigravity oprit / newtab)
pnpm dlx shadcn@latest add dialog select tabs badge avatar textarea
```

---

## GitHub Desktop Workflow

(Pentru cod share-uit și commit-uit)

- **Aducere cod de sus:** Apasă `Fetch origin` -> `Pull` de sus
- **Salvarea muncii tale pachet:** Bifezi stânga tot -> Scrii ce ai lucrat la _Summary_ -> Apeși albastru `Commit to...`
- **Trimiterea muncii:** Apeși `Push origin`

---

## Șabloane Fișiere

### O Pagină Nouă

Creează `app/ruta-mea/page.tsx`:

```tsx
export default function MyPage() {
  return (
    <main className="min-h-screen p-6 max-w-5xl mx-auto">
      <h1 className="text-3xl font-bold">Titlu Pagină Nouă</h1>
      {/* conținutul tău */}
    </main>
  );
}
```

### O Componentă Nouă (Statică — Fără Interactivitate / RSC)

Creează `components/ComponentaMea.tsx`:

```tsx
type PropsComponentMea = {
  titlu: string;
};

export default function ComponentaMea({ titlu }: PropsComponentMea) {
  return <div className="p-4 rounded-lg border">{titlu}</div>;
}
```

### O Componentă Nouă (Interactivă / Client cu State)

Creează `components/ComponenteInteractiva.tsx`:

```tsx
"use client"; // MEGA IMPORTANT AICI!

import { useState } from "react";

export default function ComponenteInteractiva() {
  const [valoare, setValoare] = useState("");

  return (
    <input
      value={valoare}
      onChange={(e) => setValoare(e.target.value)}
      className="border p-2 rounded"
    />
  );
}
```

---

## Navigare și API (Important!)

### Navigare (Fără Refresh la Pagină)

Niciodată nu folosi `<a href="...">` pentru că strică site-ul. Folosește `<Link>` din Next.js:

```tsx
import Link from "next/link";

export default function Meniu() {
  return (
    <Link href="/feed" className="text-blue-500">
      Mergi la Feed
    </Link>
  );
}
```

### Chemarea API-ului tău (Fetch) cu React State

```tsx
"use client";
import { useState, useEffect } from "react";

export default function ListaDate() {
  const [date, setDate] = useState([]);

  // Se cheamă o singură dată la afișarea paginii
  useEffect(() => {
    async function iaDatele() {
      const raspuns = await fetch("/api/pulses"); // ruta facuta de backend
      const json = await raspuns.json();
      if (json.success) setDate(json.data);
    }
    iaDatele();
  }, []);

  return <div>{date.length} chestii găsite</div>;
}
```

---

## Importuri De Știut (Cheat Sheet)

```tsx
// Shadcn
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";

// Funcția `cn()` de combinat React cu clase
import { cn } from "@/lib/utils";

// Hover / use hooks de la React (merg DOAR in Client Components OBLIGATORIU!)
import { useState, useEffect } from "react";

// Iconite! De gasit pe: hugeicons.com (Apoi lipesti FreeIcon langa el in text)
import { Home01FreeIcon } from "@hugeicons/core-free-icons";
import { HugeIcon } from "@hugeicons/react";
```

---

## Tailwind CSS Cheat Sheet

### Spațiere (1 unit = 4px mereu)

`p-1`=4px · `p-2`=8px · `p-4`=16px · `p-6`=24px · `p-8`=32px

### Direcții de Padding/Magnii

`px-X` = orizontal · `py-Y` = vertical · `pt(Sus) / pb(Jos) / pl(Stanga) / pr(Dreapta)`

### Așezare flex / grid

```css
flex                    → Rând Orizontal stg->dr
flex flex-col           → Coloană Verticală sus->jos
flex items-center       → Axează-le Vertical Central
flex justify-between    → Împinge stg/dr elementele (Bagi spatiu intre ele)
flex justify-center     → Axează Orizontal Central
grid grid-cols-2 gap-4  → Un Matrix (Grid) Fix de 2 Coloane per rând!
```

### Responsive Design (Mobila Prima oara!)

```css
grid-cols-1 md:grid-cols-2 lg:grid-cols-3
hidden md:block         → Ascuns pe Mobile, Vizibil pe Tableta.
text-sm md:text-base    → Fixeaza Textul sa nu se sparga (Mic e mic pe mobil, mare pe mare MD)
```

### Culori Tematice din Proiect (CSS Variables)

```css
bg-background / text-foreground      → fundal baza / culoare font text standard (Se mută light/dark automat)
bg-card / text-card-foreground       → fundalurile cutiilor mici albe/negre
bg-primary / text-primary-foreground → butoane principale call-to-action
bg-muted / text-muted-foreground     → text care e secundar si usor palid.
bg-destructive                       → Culoare Roșie Pericol de DELETE/WARN.
border-border                        → Culoarea Default a Contururilor de cutii / card-uri!
```

---

## Variante Butoane (Așa se scriu tagurile Button)

```tsx
<Button>Default</Button>
<Button variant="outline">Un contur gol</Button>
<Button variant="secondary">Culoare Alternativă / Secundar</Button>
<Button variant="ghost">Ca Linkul, dar se aprinde doar la Hover</Button>
<Button variant="destructive">Stergeți Asta Acum!</Button>
<Button variant="link">Sunt un hyperlink in inima mea</Button>
<Button size="sm">Sunt foarte mica, ca o pilula</Button>
<Button size="lg">Iar eu de 64 pixeli!</Button>
```

---

## Alte Modele Frecvente

### Funcționare "Dacă E Adevarat apusă Class A"

```tsx
// Punem functia cn la string class name!
<div className={cn("css-std p-4", trueAsaEste && "rosu bg-white text-lg")} />
```

### Condițional din Randare! "Dacă nu M-O INCĂRCAT... atunci... arată LoadingText"

```tsx
{
  seIncarcaMeniu && <p>Un moment frate...</p>;
}
{
  aiPrimitBaniEroarePeTeava ? (
    <p>Mincinosule, Eroare</p>
  ) : (
    <p>Toate bune, ai banu in cont!</p>
  );
}
```

### Randează Arrayuri Lungi

```tsx
// Map, the true hero
{
  obiecteCartiPoezii.map((carte) => <Card key={carte.id}>{carte.nume}</Card>);
}
```

### Oprirea Default Form-ului

```tsx
<form onSubmit={(e) => { e.preventDefault(); /* ... */ }}>
```

<br><br>

  <hr>
<br><br>

# ⚡ Quick Reference — Copy-Paste Commands & Patterns (English)

> One-page cheat sheet. Bookmark this file.

---

## Terminal Commands

```bash
# Start the dev server
pnpm dev

# Install dependencies (run after a git pull)
pnpm install

# Add a shadcn component
pnpm dlx shadcn@latest add button
pnpm dlx shadcn@latest add dialog select tabs badge avatar textarea
```

---

## GitHub Desktop Workflow

- **Get Code:** `Fetch origin` -> `Pull`
- **Save Code:** Check files on left -> Write description in Summary -> Click `Commit to...`
- **Push Code:** Click `Push origin`

---

## File Templates

### New Page

Create `app/your-route/page.tsx`:

```tsx
export default function YourPage() {
  return (
    <main className="min-h-screen p-6 max-w-5xl mx-auto">
      <h1 className="text-3xl font-bold">Page Title</h1>
      {/* your content */}
    </main>
  );
}
```

### New Component (Static — No Interactivity)

Create `components/YourComponent.tsx`:

```tsx
type YourComponentProps = {
  title: string;
};

export default function YourComponent({ title }: YourComponentProps) {
  return <div className="p-4 rounded-lg border">{title}</div>;
}
```

### New Component (Interactive — With State)

Create `components/YourComponent.tsx`:

```tsx
"use client";

import { useState } from "react";

export default function YourComponent() {
  const [value, setValue] = useState("");

  return (
    <input
      value={value}
      onChange={(e) => setValue(e.target.value)}
      className="border p-2 rounded"
    />
  );
}
```

---

## Navigation & API (Critical!)

### Navigation (No Page Reloads)

Never use `<a href="...">` for internal links. It causes full page reloads. Use `<Link>`:

```tsx
import Link from "next/link";

export default function Menu() {
  return (
    <Link href="/feed" className="text-blue-500">
      Go to Feed
    </Link>
  );
}
```

### Calling your API (Fetch) in React

```tsx
"use client";
import { useState, useEffect } from "react";

export default function DataList() {
  const [data, setData] = useState([]);

  // Runs once when the component mounts
  useEffect(() => {
    async function fetchData() {
      const res = await fetch("/api/pulses"); // endpoint built by backend lead
      const json = await res.json();
      if (json.success) setData(json.data);
    }
    fetchData();
  }, []);

  return <div>Found {data.length} items.</div>;
}
```

---

## Import Cheat Sheet

```tsx
// shadcn components
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";

// Class merging utility
import { cn } from "@/lib/utils";

// React hooks (Client Components ONLY)
import { useState, useEffect } from "react";

// Icons
import { Home01FreeIcon } from "@hugeicons/core-free-icons";
import { HugeIcon } from "@hugeicons/react";
```

---

## Tailwind Cheat Sheet

### Spacing (each unit = 4px)

`p-1`=4px · `p-2`=8px · `p-4`=16px · `p-6`=24px · `p-8`=32px

### Direction

`px-`=horizontal · `py`=vertical · `pt/pb/pl/pr`=single side

### Layout

```
flex                    → horizontal row
flex flex-col           → vertical column
flex items-center       → vertically center
flex justify-between    → push items apart
flex justify-center     → horizontally center
grid grid-cols-2 gap-4  → 2-column grid
```

### Responsive (mobile-first)

```
grid-cols-1 md:grid-cols-2 lg:grid-cols-3
hidden md:block         → hidden on mobile, visible on tablet+
text-sm md:text-base    → smaller text on mobile
```

### Theme Colors

```
bg-background / text-foreground     → page background
bg-card / text-card-foreground      → card background
bg-primary / text-primary-foreground → accent buttons
bg-muted / text-muted-foreground    → subtle/secondary text
bg-destructive                      → danger/delete
border-border                       → borders
```

---

## Button Variants

```tsx
<Button>Default</Button>
<Button variant="outline">Outline</Button>
<Button variant="secondary">Secondary</Button>
<Button variant="ghost">Ghost</Button>
<Button variant="destructive">Delete</Button>
<Button variant="link">Link</Button>
<Button size="sm">Small</Button>
<Button size="lg">Large</Button>
```

---

## Common Patterns

### Conditional class

```tsx
<div className={cn("base-class", isActive && "active-class")} />
```

### Conditional rendering

```tsx
{
  isLoading && <p>Loading...</p>;
}
{
  error ? <p>Error!</p> : <p>Success!</p>;
}
```

### List rendering

```tsx
{
  items.map((item) => <Card key={item.id}>{item.name}</Card>);
}
```

### Form handling

```tsx
<form onSubmit={(e) => { e.preventDefault(); /* handle */ }}>
```
