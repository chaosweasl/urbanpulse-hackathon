# 🏙️ UrbanPulse — Platformă de Conectivitate a Cartierului

O aplicație comunitară hiper-locală care transformă vecinii într-o rețea de sprijin activă și rezilientă.

**Tehnologii:** Next.js 16 · React 19 · TypeScript · Tailwind CSS v4 · shadcn/ui v4 · Supabase · Vercel

---

## 📖 Documentația Echipei

Ești nou în proiect? Citește ghidurile acestea **în ordine**:

| #   | Document                                 | Ce vei învăța din el                                     |
| --- | ---------------------------------------- | -------------------------------------------------------- |
| 1   | [Setup Guide](./docs/SETUP.md)           | Cum instalezi programele și cum pornești aplicația       |
| 2   | [Project Structure](./docs/STRUCTURE.md) | Ce fișiere să editezi, de care să nu te atingi           |
| 3   | [Workflow Guide](./docs/WORKFLOW.md)     | GitHub Desktop, React, Tailwind, shadcn — totul pe scurt |
| 4   | [Quick Reference](./docs/QUICKREF.md)    | Fișier de copiat comenzi pentru munca de zi cu zi        |
| 5   | [Glossary](./docs/GLOSSARY.md)           | Termeni de programare web explicați pe înțeles           |
| 6   | [Extensions](./docs/EXTENSIONS.md)       | Extensii recomandate pentru Antigravity / PDF viewer     |
| 7   | [Learning Resources](./docs/LEARNING.md) | Tutoriale scurte (video+text) pentru web dev             |
| 8   | [Roadmap](./docs/ROADMAP.md)             | Planul de lucru împărțit pe Backend / Frontend           |

---

## 🚀 Pornire Rapidă

```bash
# 1. Clonează (descarcă) repo-ul prin GitHub Desktop
# Vezi [docs/SETUP.md] pasul 2

# 2. Instalează pachetele
pnpm install

# 3. Setează variabilele de mediu
# Cere liderului fișierul .env.local

# 4. Pornește serverul
pnpm dev
```

Deschide [http://localhost:3000](http://localhost:3000) ca să vezi aplicația.

---

## 📁 Structura Proiectului

```
app/          → Rute și pagini (Aici e UI-ul)
  api/        → Backend API (Comunicarea cu baza de date)
components/   → Componente UI refolosibile (împărțite pe funcționalități)
  ui/         → Generate automat de shadcn (nu edita)
hooks/        → Funcții React personalizate
lib/          → Utilitare generale (validări, locație)
types/        → Definiții Typescript
utils/        → Setări Supabase (nu edita)
public/       → Imagini și iconițe statice
docs/         → Documentația echipei tale
```

Vezi [STRUCTURE.md](./docs/STRUCTURE.md) pentru mai multe detalii!

<br><br>

  <hr>
<br><br>

# 🏙️ UrbanPulse — Neighborhood Connectivity Platform (English)

A hyper-local community app that transforms passive neighbors into an active, resilient support network.

**Tech Stack:** Next.js 16 · React 19 · TypeScript · Tailwind CSS v4 · shadcn/ui v4 · Supabase · Vercel

---

## 📖 Documentation

New to the project? Read these **in order**:

| #   | Doc                                      | What You'll Learn                                               |
| --- | ---------------------------------------- | --------------------------------------------------------------- |
| 1   | [Setup Guide](./docs/SETUP.md)           | Installing tools and running the app                            |
| 2   | [Project Structure](./docs/STRUCTURE.md) | What files to edit, what not to touch                           |
| 3   | [Workflow Guide](./docs/WORKFLOW.md)     | GitHub Desktop, React, Tailwind, shadcn — the full crash course |
| 4   | [Quick Reference](./docs/QUICKREF.md)    | Copy-paste cheat sheet for daily use                            |
| 5   | [Glossary](./docs/GLOSSARY.md)           | Web-dev terms explained                                         |
| 6   | [Extensions](./docs/EXTENSIONS.md)       | Recommended extensions for Antigravity / PDF viewer             |
| 7   | [Learning Resources](./docs/LEARNING.md) | Short tutorials to get up to speed with web dev                 |
| 8   | [Roadmap](./docs/ROADMAP.md)             | Split development plan for Backend and Frontend                 |

---

## 🚀 Quick Start

```bash
# 1. Clone the repo via GitHub Desktop
# See [docs/SETUP.md] step 2

# 2. Install dependencies
pnpm install

# 3. Set up environment variables
# Ask the team lead for .env.local values

# 4. Run the dev server
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) to see the app.

---

## 📁 Project Structure

```
app/          → Pages & routes (frontend)
  api/        → Backend API routes
components/   → Reusable UI components (grouped by feature)
  ui/         → shadcn auto-generated (don't edit)
hooks/        → Custom React hooks
lib/          → Shared utilities
types/        → TypeScript definitions
utils/        → Supabase setup (don't touch)
public/       → Static assets (images, icons)
docs/         → Team documentation
```

See [STRUCTURE.md](./docs/STRUCTURE.md) for full details.
