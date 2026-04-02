# 🏙️ UrbanPulse — Hackathon Requirements

> Official specification for all graded deliverables. Reference this document to know what earns points.

---

## 🌟 The Vision

The City Council has observed a growing gap in urban resilience. While global social networks connect people across continents, neighbors living in the same apartment building often remain strangers. In times of minor crises — a power outage, a lost pet, or a broken water pipe — the most effective help is usually less than 100 meters away.

To bridge this gap, the Council has commissioned **UrbanPulse**, a groundbreaking web application designed to foster hyper-local "Micro-Communities" and mutual aid. The goal is to transform passive neighbors into an active, resilient support network.

---

## 📋 Functional Requirements

---

### 1. The Neighborhood Dashboard — Real-Time Connectivity

**Core Requirements:**

- A live feed of **"Pulses"** — short-form updates from neighbors within a specific radius (e.g., 500 meters).
- A **real-time notification system or feed** (using WebSockets or similar) so urgent requests (e.g., _"Does anyone have a jumper cable?"_) appear instantly without a page refresh.
- Use the **OpenWeatherMap API** to display local weather alerts. If a "Severe Weather" warning is issued, the app must automatically **pin a "Safety Check-in" thread** at the top of the dashboard.

| Feature                                                                                                                                             | Points |
| --------------------------------------------------------------------------------------------------------------------------------------------------- | -----: |
| **Dynamic Feed** — Feed for community alerts (Emergency, Skill, Item) with varying urgency levels                                                   |  7 pts |
| **Live Updates** — Dashboard reflects new Pulses or status changes in real-time without page refresh                                                |  8 pts |
| **Notification Engine** — System-wide alerts for urgent local emergencies or direct responses to a user's request                                   |  8 pts |
| **Interactive Visualization** — Map interface displaying location and density of local needs or resources. Base data from Mapbox or Google Maps API | 10 pts |

---

### 2. The Skill & Resource Library — Collaborative Economy

**Core Requirements:**

- A collaborative database of shared **tools** and **skills**. Users can list items they are willing to lend (e.g., drills, ladders, camping gear) or skills they can offer (e.g., _"I can help with furniture assembly"_, _"I am a nurse"_).
- A dynamic **Reliability Rating**: a user's score increases after three successful "Lend" or "Help" events that receive positive feedback from the recipient.

| Feature                                                                                                                               | Points |
| ------------------------------------------------------------------------------------------------------------------------------------- | -----: |
| **Location Filtering** — Efficient database querying allowing users to filter the feed based on a specific radius from their location | 10 pts |
| **Direct Communication** — Integrated messaging (private or group) to allow neighbors to coordinate logistics securely                | 10 pts |
| **Localization** — Profile settings allowing users to define their neighborhood/geographic area and list "Skill Tags" or resources    |  5 pts |
| **Account Management** — Full CRUD on profiles (bios, skills, delete data)                                                            |  5 pts |
| **Reliability Logic** — System that calculates user "Trust Scores" based on community feedback and successful interactions            |  8 pts |

---

### 3. Smart Request Matching

**Core Requirements:**

- When a user posts a "Need" (e.g., _"I need help moving a heavy couch"_), the app **analyzes nearby user profiles** and sends a **"Hero Alert"** to those who have listed matching skills (e.g., "Physical Help" or "Lifting").
- Users can set **"Quiet Hours"** or **"Distance Limits"** in their profile to control how and when they receive these alerts.

---

### 4. Verification & Moderation — Administrative Section

**Core Requirements:**

- Certain high-trust actions (like borrowing expensive tools) require a **"Verified Neighbor" badge**.
- If a specific post is **upvoted/confirmed by 3 or more neighbors**, the system automatically marks it as **"Verified Info"**.
- Admins must have a dashboard to review reported content or users who violate community guidelines.

| Feature                                                                                                                    | Points |
| -------------------------------------------------------------------------------------------------------------------------- | -----: |
| **Secure Auth** — Registration/login with unique credentials, password encryption, secure session management               |  5 pts |
| **Input Validation** — Strict server-side validation for all community posts                                               |  5 pts |
| **Auto-Validation** — Logic to automatically verify alerts when 3+ independent users confirm the information               |  6 pts |
| **Admin Dashboard** — Central interface for moderators to review flagged content, merge duplicates, and manage user access |  6 pts |
| **Data Privacy & Access Control** — Robust RBAC to protect sensitive data like private addresses and messages              |  7 pts |

---

## 🤖 Advanced Bonus Features

### 1. AI "Guardian" for Lost Pets

| Feature                       | Description                                                                                          |
| ----------------------------- | ---------------------------------------------------------------------------------------------------- |
| **Automated Identification**  | System analyzes uploaded photos of found pets to identify key characteristics (species, color, etc.) |
| **Smart Similarity Matching** | Compares "Found" pet images against a "Lost" database to suggest potential matches                   |
| **Match Interface**           | UI component presenting matches with a calculated confidence/similarity score                        |

### 2. Scalability & Resilience Engineering

| Feature                     | Description                                                                                              |
| --------------------------- | -------------------------------------------------------------------------------------------------------- |
| **Huge Traffic Handling**   | Architecture must be stateless and use caching strategies to handle large volumes of concurrent requests |
| **Asynchronous Processing** | Heavy tasks (AI processing, mass notifications) must be decoupled from the main request flow             |
| **Graceful Degradation**    | The app must remain functional even if secondary services (like AI or Maps) fail                         |

---

## 🏗️ Technical Foundation Requirements

- **Database** — A robust relational or NoSQL database to manage complex relationships between users, skills, locations, and live events.
- **Full Stack Scope** — Responsive frontend (Mobile-first recommended) + Secure Backend API + Persistent Database.
- **Base Data** — Use the Mapbox or Google Maps API to visualize "Pulses" and resource locations on an interactive map.

---

## 📦 Deliverables

| Type        | Requirement                                                              |
| ----------- | ------------------------------------------------------------------------ |
| **GitHub**  | Source code must be consistently updated in a public repository          |
| **Video**   | A presentation/demo video of at least **3 minutes** (YouTube or in-repo) |
| **Discord** | Join the official server for announcements and mentor support            |

---

## 📊 Points Summary

| Section                               | Max Points |
| ------------------------------------- | ---------: |
| Dashboard — Dynamic Feed              |          7 |
| Dashboard — Live Updates              |          8 |
| Dashboard — Notification Engine       |          8 |
| Dashboard — Interactive Map           |         10 |
| Resources — Location Filtering        |         10 |
| Resources — Direct Communication      |         10 |
| Resources — Localization              |          5 |
| Resources — Account Management        |          5 |
| Resources — Reliability / Trust Score |          8 |
| Moderation — Secure Auth              |          5 |
| Moderation — Input Validation         |          5 |
| Moderation — Auto-Validation          |          6 |
| Moderation — Admin Dashboard          |          6 |
| Moderation — Data Privacy & RBAC      |          7 |
| **TOTAL**                             |    **100** |
| Bonus: AI Pet Guardian                |     +extra |
| Bonus: Scalability & Resilience       |     +extra |
