# 🛠️ Ghid de Instalare — De la Zero la Rularea Aplicației

> **Pentru cine este acest ghid?** Pentru oricine din echipă care trebuie să ruleze UrbanPulse local. Nu se presupune nicio experiență anterioară în web development. Urmează fiecare pas în ordine.

---

## Cuprins

1. [Instalarea Programelor Necesare](#1-instalarea-programelor-necesare)
2. [Clonarea Repository-ului (Descărcarea Codului)](#2-clonarea-repository-ului-descărcarea-codului)
3. [Instalarea Dependențelor Proiectului](#3-instalarea-dependențelor-proiectului)
4. [Configurarea Variabilelor de Mediu](#4-configurarea-variabilelor-de-mediu)
5. [Rularea Aplicației](#5-rularea-aplicației)
6. [Verificarea Funcționării](#6-verificarea-funcționării)
7. [Probleme Frecvente (Troubleshooting)](#7-probleme-frecvente-troubleshooting)

---

## 1. Instalarea Programelor Necesare

Ai nevoie de **patru** lucruri instalate pe calculator. Instalează-le în această ordine.

### 1a. Node.js (motorul care rulează JavaScript în afara browserului)

1. Intră pe [https://nodejs.org](https://nodejs.org)
2. Descarcă versiunea **LTS** (butonul mare și verde)
3. Rulează installer-ul. Lasă toate setările implicite — doar apasă "Next" până la final.
4. Când s-a terminat, deschide un terminal **nou** (Command Prompt pe Windows, Terminal pe Mac) și rulează:

```bash
node --version
```

Ar trebui să vezi ceva de genul `v22.x.x`. Dacă vezi o eroare precum `'node' is not recognized`, închide și deschide din nou terminalul.

### 1b. pnpm (managerul nostru de pachete)

> **De ce nu npm?** Toată echipa trebuie să folosească același manager de pachete pentru a nu crea conflicte. Acest proiect folosește `pnpm`.

În terminal, rulează:

```bash
npm install -g pnpm
```

Apoi verifică:

```bash
pnpm --version
```

Ar trebui să vezi un număr de versiune (ex. `10.x.x`). Dacă Windows spune "execution of scripts is disabled", rulează mai întâi asta în **PowerShell deschis ca Administrator**:

```powershell
Set-ExecutionPolicy -Scope CurrentUser -ExecutionPolicy RemoteSigned
```

Apoi încearcă din nou comanda `pnpm --version`.

### 1c. GitHub Desktop (pentru a lucra cu codul)

1. Intră pe [https://desktop.github.com](https://desktop.github.com)
2. Descarcă și instalează aplicația.
3. Deschide-o și conectează-te cu contul tău de GitHub.

### 1d. Antigravity (editorul nostru de cod)

1. Intră pe [https://antigravity.google/download](https://antigravity.google/download)
2. Descarcă și instalează.
3. Acesta este programul în care vom scrie tot codul.

P.S. Pentru acest proiect, îți recomand să folosești capabilitățile AI din editor pentru eficiență maximă.

---

## 2. Clonarea Repository-ului (Descărcarea Codului)

"Clonarea" înseamnă să descarci o copie a proiectului de pe GitHub la tine pe calculator.

1. Deschide **GitHub Desktop**
2. Dă click pe `File > Clone repository...`
3. Du-te la tab-ul `URL` și introdu link-ul primit de la liderul echipei (ex: `https://github.com/nume/urbanpulse-hackathon.git`)
4. Alege unde vrei să îl salvezi (ex: pe Desktop) și apasă **Clone**.
5. Acum deschide **Antigravity**.
6. Dă `File > Open Folder` și selectează folderul `urbanpulse-hackathon` pe care tocmai l-ai descărcat.

---

## 3. Instalarea Dependențelor Proiectului

"Dependențele" sunt toate librăriile de care are nevoie proiectul (React, Next.js, etc.). Ele se descarcă în folderul `node_modules`.

1. În **Antigravity**, deschide terminalul integrat (de obicei din meniul de sus: Terminal > New Terminal).
2. Asigură-te că ești în folderul `urbanpulse-hackathon` și rulează:

```bash
pnpm install
```

Va dura un minut sau două prima dată. Când e gata, vei vedea un folder `node_modules` apărut în stânga.
_P.S. Dacă vezi erori despre "peer dependencies", ignoră-le — sunt doar avertismente._

---

## 4. Configurarea Variabilelor de Mediu

Acestea sunt parole și chei secrete de care aplicația are nevoie, dar pe care **nu** le punem niciodată pe GitHub.

1. Cere liderului echipei valorile pentru `.env.local`.
2. În Antigravity, creează un fișier nou în folderul principal numit EXACT `.env.local`
3. Pune valorile în el. Va arăta cam așa:

```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=eyJhbGci...
```

> **🚨 NU PUNE NICIODATĂ ACEST FIȘIER PE GITHUB.** GitHub Desktop îl va ignora automat pentru că este setat așa, dar e bine să știi. Variabilele cu `NEXT_PUBLIC_` sunt publice pentru browser, deci nu sunt parole super-secrete, dar tot acolo stau.

---

## 5. Rularea Aplicației

În terminalul din Antigravity, rulează:

```bash
pnpm dev
```

Ar trebui să vezi ceva de genul:

```
▲ Next.js 16.1.6
- Local:   http://localhost:3000
```

Lasă acest terminal **deschis și pornit**, nu îl închide pe durata lucrului. El urmărește modificările pe care le faci în cod și actualizează site-ul automat.

---

## 6. Verificarea Funcționării

1. Deschide browserul (Chrome/Edge/Safari).
2. Intră pe [http://localhost:3000](http://localhost:3000)
3. Ar trebui să vezi aplicația încărcându-se.

Dacă vezi o pagină web — **felicitări, ești gata de lucru!** 🎉

---

## 7. Probleme Frecvente (Troubleshooting)

### Erori de tip "Module not found"

Rulează `pnpm install` din nou. Probabil cineva a adăugat un pachet nou pe care tu nu îl ai.

### Erori de tip "Port 3000 is already in use"

Ai o altă aplicație deschisă care folosește acest port. Fie o închizi, fie rulezi:

```bash
pnpm dev -- -p 3001
```

Apoi intri pe `http://localhost:3001` în loc de 3000.

### Pagina e albă sau apare o eroare ciudată

1. Verifică terminalul din Antigravity pentru a vedea dacă sunt erori roșii.
2. Asigură-te că fișierul `.env.local` există și are valorile corecte.
3. Încearcă să oprești serverul apăsând `Ctrl+C` în terminal, apoi pornește-l iar cu `pnpm dev`.

### Erori "EPERM" sau de permisiuni pe Windows

Închide Antigravity și deschide-l din nou ca Administrator (click dreapta pe iconiță -> Run as administrator).

### Nu merge nimic și ești blocat

Fă un screenshot și trimite-l pe grupul echipei. De asta suntem echipă! 🙂

---

**Următorul pas:** Citește [STRUCTURE.md](./STRUCTURE.md) pentru a înțelege cum sunt organizate fișierele.

<br><br>

  <hr>
<br><br>

# 🛠️ Setup Guide — From Zero to Running the App (English)

> **Who is this for?** Anyone on the team who needs to run UrbanPulse locally. No previous web-dev experience assumed. Follow every step in order.

---

## Table of Contents

1. [Install Required Software](#1-install-required-software-eng)
2. [Clone the Repository](#2-clone-the-repository-eng)
3. [Install Project Dependencies](#3-install-project-dependencies-eng)
4. [Set Up Environment Variables](#4-set-up-environment-variables-eng)
5. [Run the App](#5-run-the-app-eng)
6. [Verify It Works](#6-verify-it-works-eng)
7. [Troubleshooting](#7-troubleshooting-eng)

---

## 1. Install Required Software <a name="1-install-required-software-eng"></a>

You need **four** things installed on your machine. Install them in this order.

### 1a. Node.js (the runtime that runs JavaScript outside a browser)

1. Go to [https://nodejs.org](https://nodejs.org)
2. Download the **LTS** version (the big green button)
3. Run the installer. Accept all defaults — just keep clicking "Next"
4. When it's done, open a **new** terminal (Command Prompt on Windows, Terminal on Mac) and run:

```bash
node --version
```

You should see something like `v22.x.x`. If you see an error like `'node' is not recognized`, close and reopen your terminal — it needs to reload the PATH.

### 1b. pnpm (our package manager)

> **Why not npm?** The entire team must use the same package manager to avoid lock file conflicts. This project uses `pnpm`.

In your terminal, run:

```bash
npm install -g pnpm
```

Then verify:

```bash
pnpm --version
```

You should see a version number (e.g., `10.x.x`). If Windows says "execution of scripts is disabled", run this first in **PowerShell as Administrator**:

```powershell
Set-ExecutionPolicy -Scope CurrentUser -ExecutionPolicy RemoteSigned
```

Then try the `pnpm --version` command again.

### 1c. GitHub Desktop (version control GUI)

1. Go to [https://desktop.github.com](https://desktop.github.com)
2. Download and install it.
3. Open it and sign in with your GitHub account.

### 1d. Antigravity (our code editor)

1. Go to [https://antigravity.google/download](https://antigravity.google/download)
2. Download and install.
3. This is where we write all our code.

P.S.: For this project, I highly recommend using the editor's AI features for maximum efficiency.

---

## 2. Clone the Repository <a name="2-clone-the-repository-eng"></a>

"Cloning" means downloading a copy of the project from GitHub to your computer.

1. Open **GitHub Desktop**
2. Click on `File > Clone repository...`
3. Go to the `URL` tab and paste the link from the team lead (e.g., `https://github.com/name/urbanpulse-hackathon.git`)
4. Choose where to save it (e.g., Desktop) and click **Clone**.
5. Now open **Antigravity**.
6. Go to `File > Open Folder` and select the `urbanpulse-hackathon` folder you just downloaded.

---

## 3. Install Project Dependencies <a name="3-install-project-dependencies-eng"></a>

"Dependencies" are all the libraries/packages the project uses (React, Next.js, etc.). They're listed in `package.json` and get downloaded into the `node_modules` folder.

1. Inside **Antigravity**, open the integrated terminal.
2. Ensure you are in the `urbanpulse-hackathon` folder and run:

```bash
pnpm install
```

This will take a minute or two the first time. You'll see a progress bar. When it's done, you should see a `node_modules` folder appear in the project.

> **⚠️ Common issue:** If you see errors about "peer dependencies", ignore them — they're warnings, not errors. As long as the command finishes without a red "ERR!" at the end, you're fine.

---

## 4. Set Up Environment Variables <a name="4-set-up-environment-variables-eng"></a>

Environment variables are secret values (API keys, database URLs) that the app needs but that we **never** commit to GitHub.

1. Ask the team lead for the `.env.local` values
2. In the project root in Antigravity, create a file named exactly `.env.local`
3. It should look something like this:

```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=eyJhbGci...
```

> **🚨 NEVER commit this file to Git.** GitHub Desktop ignores it automatically based on rules, but be careful. Variables starting with `NEXT_PUBLIC_` are visible to the browser, so they aren't super-secret passwords, but they live here.

---

## 5. Run the App <a name="5-run-the-app-eng"></a>

In your Antigravity terminal:

```bash
pnpm dev
```

You should see output like:

```
▲ Next.js 16.1.6
- Local:   http://localhost:3000
```

Leave this terminal **running** — don't close it. This is your dev server. It watches for file changes and updates the page automatically.

---

## 6. Verify It Works <a name="6-verify-it-works-eng"></a>

1. Open your browser
2. Go to [http://localhost:3000](http://localhost:3000)
3. You should see the app load (even if it's just a basic page right now)

If you see a page — **congratulations, you're set up!** 🎉

---

## 7. Troubleshooting <a name="7-troubleshooting-eng"></a>

### "Module not found" errors

Run `pnpm install` again. Someone probably added a new package.

### Port 3000 is already in use

Another app is using that port. Either close it, or run:

```bash
pnpm dev -- -p 3001
```

Then go to `http://localhost:3001` instead.

### The page is blank or shows a weird error

1. Check your terminal for red error messages
2. Make sure `.env.local` exists and has the right values
3. Try stopping the server (`Ctrl+C` in the terminal) and running `pnpm dev` again

### "EPERM" or permission errors on Windows

Close Antigravity and open it again as Administrator (Right click icon -> Run as administrator).

### Nothing works and you're stuck

Screenshot the error and send it in the group chat. That's what the team lead is for. 🙂

---

**Next:** Read [STRUCTURE.md](./STRUCTURE.md) to understand how the project is organized.
