# Ghid Configurare Supabase OAuth (GitHub & Google)

Pentru a permite utilizatorilor să se conecteze folosind contul lor de Google sau GitHub, va trebui să configurezi furnizorii OAuth în dashboard-ul tău Supabase și să obții cheile necesare de la fiecare platformă.

---

## 1. Configurarea GitHub OAuth

### Pasul A: Crearea unei aplicații OAuth în GitHub

1. Mergi la [GitHub Developer Settings](https://github.com/settings/developers).
2. În meniul din stânga, apasă pe **OAuth Apps**.
3. Dă click pe butonul **New OAuth App**.
4. Completează formularul:
   - **Application name**: Numele aplicației tale (ex: `UrbanPulse`).
   - **Homepage URL**: URL-ul principal al site-ului (ex: `http://localhost:3000` pentru dezvoltare locală sau adresa ta de pe Vercel pentru producție).
   - **Authorization callback URL**: Acest URL este crucial! Aici va trimite GitHub utilizatorul după autentificare. Trebuie să aibă formatul următor:
     - `https://<PROJECT_REF>.supabase.co/auth/v1/callback`
     - Poți găsi URL-ul specific proiectului tău (`PROJECT_REF`) în Supabase: mergi la **Project Settings** -> **API**, secțiunea **Project URL**.
5. Apasă pe **Register application**.
6. Acum vei vedea un **Client ID**. Copiază-l, vei avea nevoie de el curând.
7. Apasă pe **Generate a new client secret** (probabil va trebui să reintroduci parola ta de GitHub).
8. Copiază **Client Secret** care este generat. Ai grijă, nu îl vei mai putea vedea din nou după ce pleci de pe această pagină.

### Pasul B: Configurarea în Supabase

1. Mergi în [Supabase Dashboard](https://supabase.com/dashboard).
2. Selectează proiectul tău (ex: `urbanpulse-hackathon`).
3. În meniul din stânga, mergi la **Authentication** -> **Providers**.
4. Caută **GitHub** în listă și dă click pe el pentru a-l activa.
5. Activează opțiunea **Enable GitHub**.
6. Introdu **Client ID**-ul pe care l-ai copiat mai devreme de pe GitHub.
7. Introdu **Client Secret**-ul generat de GitHub.
8. Apasă **Save**.

---

## 2. Configurarea Google OAuth

### Pasul A: Crearea unui proiect și obținerea cheilor din Google Cloud Console

1. Mergi la [Google Cloud Console](https://console.cloud.google.com/).
2. Dacă nu ai un proiect deja, creează unul dând click pe drop-down-ul din partea stângă sus (lângă logo) și selectează **New Project**. Dă-i un nume (ex: `UrbanPulse`) și apasă **Create**.
3. Selectează noul proiect creat din drop-down.
4. În meniul lateral (hamburger menu), navighează la **APIs & Services** -> **Credentials**.
5. Înainte de a putea crea un Client ID, trebuie să configurezi "OAuth consent screen" (ecranul pe care îl vede utilizatorul când i se cere permisiunea). Dă click pe butonul **Configure Consent Screen** (sau navighează la secțiunea corespunzătoare din stânga).
   - Alege **External** (dacă vrei ca oricine să se poată autentifica, ceea ce e cel mai probabil) și apasă **Create**.
   - Completează câmpurile necesare:
     - **App name**: ex. `UrbanPulse`.
     - **User support email**: Email-ul tău.
     - (Restul pot fi ignorate sau completate opțional)
     - **Developer contact information**: Email-ul tău (același e ok).
   - Apasă **Save and Continue**.
   - La pașii următori (Scopes, Test users) poți doar să apesi **Save and Continue** deocamdată.
   - Mergi înapoi la Dashboard (Summary) sau direct la meniul de **Credentials**.
6. Acum apasă pe butonul de sus **+ CREATE CREDENTIALS** și alege **OAuth client ID**.
7. La **Application type**, selectează **Web application**.
8. Oferă un nume identificator (ex: `Supabase Auth`).
9. La secțiunea **Authorized redirect URIs**, apasă pe **+ ADD URI**. Aici va trebui să introduci din nou URL-ul de callback generat de Supabase, care are formatul:
     - `https://<PROJECT_REF>.supabase.co/auth/v1/callback`
10. Apasă **Create**.
11. Îți va apărea o fereastră cu **Client ID**-ul tău și cu **Client Secret**-ul tău. Copiază-le pe ambele!

### Pasul B: Configurarea în Supabase

1. În [Supabase Dashboard](https://supabase.com/dashboard), cu proiectul tău deschis.
2. Navighează iar la **Authentication** -> **Providers**.
3. Caută **Google** în listă și dă click pentru a-l deschide.
4. Activează opțiunea **Enable Google**.
5. Introdu **Client ID**-ul obținut din Google Cloud Console.
6. Introdu **Client Secret**-ul.
7. Pentru a lăsa utilizatorii să folosească butonul Google One-Tap (opțional, dar recomandat pentru experiența utilizatorului), poți bifa și opțiunea **Skip nonce checks**.
8. Apasă **Save**.

---

## 3. Utilizarea în Frontend (UrbanPulse)

În frontend, rutele din folderul `app/api/auth/oauth/route.ts` au fost configurate pentru a simplifica apelurile:

Pentru a te autentifica cu **GitHub**, creează un buton care redirecționează utilizatorul la:
`/api/auth/oauth?provider=github`

Pentru a te autentifica cu **Google**, creează un buton care redirecționează la:
`/api/auth/oauth?provider=google`

Asta este tot! Utilizatorul va fi dus la pagina furnizorului, se va loga, și apoi Supabase îl va redirecționa înapoi pe ruta internă (pe care o ai la `/api/auth/callback`), logându-l cu succes în aplicația ta UrbanPulse. Profilul va fi creat automat în baza de date la logarea inițială datorită trigger-ului de Supabase configurat pe tabelul de `auth.users` (`handle_new_user`).
