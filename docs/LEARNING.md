# 🎓 Resurse de Învățare (Learning Resources)

Dacă nu ai mai făcut aplicații web moderne înainte, nu te speria! Acest document îți oferă cele mai bune referințe oficiale pentru a învăța din mers.

Dacă preferi formatul video, **recomand să cauți liber online (YouTube, Google)** termeni precum _"React in 100 seconds"_, _"Next.js App Router crash course"_, sau _"Tailwind CSS tutorial"_. Există mii de astfel de tutoriale excelente care te vor ajuta să prinzi ideile de bază extrem de rapid.

---

## 📚 Documentații Oficiale (Pentru Copy-Paste)

Când vrei să implementezi ceva specific, nu învăța pe de rost. Deschide aceste linkuri, citește regula, și dă Copy-Paste la cod:

1. **React Quick Start (Concepte de bază)**
   👉 Citește despre componente, `useState` și Props.
   🔗 [https://react.dev/learn](https://react.dev/learn)

2. **Next.js App Router (Partea de routing și server)**
   👉 Caută diferențele dintre Client Components și Server Components.
   🔗 [https://nextjs.org/docs/app](https://nextjs.org/docs/app)

3. **Shadcn UI (Butoane, Formulare, Meniuri Gata Făcute)**
   👉 Caută pe stânga ce vrei (ex: `Dialog`, `Select`, `Card`).
   🔗 [https://ui.shadcn.com/docs/components/accordion](https://ui.shadcn.com/docs/components/accordion)

4. **Tailwind CSS Cheat Sheet (Află clasa CSS pentru orice)**
   👉 Caută funcția (ex: "box shadow") și vezi ce clasă să folosești.
   🔗 [https://nerdcave.com/tailwind-cheat-sheet](https://nerdcave.com/tailwind-cheat-sheet)

5. **HugeIcons (Iconițe)**
   👉 Caută iconița, uită-te la numele ei oficial.
   🔗 [https://hugeicons.com/](https://hugeicons.com/)

---

## 📝 Recapitulare pentru Programatori

- `var x = 1` ❌ -> folosește `const x = 1` (constant) sau `let x = 1` (dacă se schimbă).
- `document.getElementById` ❌ -> În React NU atingi DOM-ul direct (HTML-ul). Folosești starea (`useState`) și React va actualiza singur ecranul.
- `class="buton"` ❌ -> În Next.js / React, folosești mereu `className="buton"`.
- `<a href="/pagina">` ❌ -> La navigare în Next.js, folosești `<Link href="/pagina">`. Altfel site-ul dă refresh total (ceea ce distruge viteza și baza de date în timp real).

<br><br>

<hr>
<br><br>

# 🎓 Learning Resources (English)

If you haven't built modern web apps before, don't panic! This document provides the best official references to learn as you go.

If you prefer video content, **we highly recommend searching online (YouTube, Google)** for terms like _"React in 100 seconds"_, _"Next.js App Router crash course"_, or _"Tailwind CSS tutorial"_. There are thousands of brilliant short tutorials that will help you grasp the core concepts very quickly.

---

## 📚 Official Documentation (Copy-Paste)

When building the app, don't memorize. Open these links, find what you need, and copy-paste the code:

1. **React Quick Start (Core Concepts)**
   👉 Read about components, state (`useState`), and passing props.
   🔗 [https://react.dev/learn](https://react.dev/learn)

2. **Next.js App Router (Routing and Server side)**
   👉 Learn the difference between Client and Server components.
   🔗 [https://nextjs.org/docs/app](https://nextjs.org/docs/app)

3. **Shadcn UI (Pre-built beautiful components)**
   👉 Find what you need on the left sidebar (Cards, Menus, Dialogs).
   🔗 [https://ui.shadcn.com/docs/components/accordion](https://ui.shadcn.com/docs/components/accordion)

4. **Tailwind CSS Searchable Cheat Sheet**
   👉 Need to center a div? Search "center" and find the Tailwind class.
   🔗 [https://nerdcave.com/tailwind-cheat-sheet](https://nerdcave.com/tailwind-cheat-sheet)

5. **HugeIcons (Icons)**
   👉 Search for an icon, grab its reference name.
   🔗 [https://hugeicons.com/](https://hugeicons.com/)

---

## 📝 Quick Notes

- `var x = 1` ❌ -> use `const x = 1` (constant) or `let x = 1` (variable).
- `document.getElementById` ❌ -> In React, you NEVER touch the DOM directly. You use state (`useState`) and React updates the screen for you.
- `class="btn"` ❌ -> In React/JSX, you MUST use `className="btn"`.
- `<a href="/page">` ❌ -> In Next.js, NEVER use standard anchor tags for internal links. Use `<Link href="/page">` from `next/link`. Ordinary anchors cause a full page refresh, losing state and WebSocket connections!
