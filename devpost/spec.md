---
doc: spec
status: draft
---

# Orma — Technical Spec

## How This Works, In Plain Language

Orma is a personal diary website. You sign up / sign in with email and password; the API issues a **custom JWT** the browser keeps and sends on later requests. You upload one photo. The app reads place and time from the photo when they’re there, turns coordinates into an address, and shows you that evidence. You press Generate; an AI writes a short caption from the photo and that evidence. You edit if you want, save, and the memory lives in your Postgres database—including a shrunk copy of the image. Later you browse by day or by place. On the place view, a map shows pins for those memories. The AI provider can be Ollama on your machine or a cloud model later; the app talks to AI the same way either way.

Why this shape: you already know Next, React, Postgres, Prisma, shadcn, and the AI SDK, and you want a real backend you’ll keep using—not a throwaway demo. New pieces to learn are photo metadata, location/address lookup, and Leaflet on the place map.

## The Core Journey Through the System

PRD ref: `prd.md > The Core Journey`.

1. **Landing** — Browser loads a public Next.js page. No diary data.
2. **Log in** — Register or sign in with email/password. API verifies against Prisma, returns a signed JWT. Client stores the token and sends it on diary API calls; redirect to diary home.
3. **Diary home** — Server loads this user’s memories from Postgres via Prisma. Empty → CTA to create. Otherwise list + day/place grouping controls.
4. **Upload** — Modal: one image file. Client or API reads EXIF (lat, lng, timestamp). If coordinates exist, API asks Nominatim for an address and returns it. Image is resized/compressed before it will be stored. Preview shows image + evidence. If place or time is missing → error + manual entry (both required); shortcuts for current location and current time.
5. **Generate** — `POST` API route sends image + place/time context through the **Vercel AI SDK** (Ollama now; Google/NVIDIA later via env). Caption returns for edit.
6. **Save** — API writes Memory row (caption, address, coords, timestamp, tags empty, **image bytes**) owned by the user. Home list updates.
7. **Browse / evidence** — Open a memory: place, day, caption (no map). Group by day or place; place drill-down renders **Leaflet** with pins from stored coordinates. Add tags on a memory; persist in Postgres.

## Stack

| Choice | Role | Docs |
|---|---|---|
| **Next.js** (App Router) | UI + API routes, deploy on Vercel | https://nextjs.org/docs |
| **React** | UI | https://react.dev |
| **TypeScript** | App language (standard with this stack) | https://www.typescriptlang.org/docs |
| **Postgres** | Source of truth (learner provisions; Prisma connects) | https://www.postgresql.org/docs |
| **Prisma** | Schema, migrations, queries | https://www.prisma.io/docs |
| **shadcn/ui** | UI primitives | https://ui.shadcn.com |
| **Custom JWT auth** | Email/password register + login; signed JWT on API | https://jwt.io/introduction (concept); use a well-maintained signer e.g. `jose` — https://github.com/panva/jose |
| **Vercel AI SDK** | Provider-agnostic caption generation | https://sdk.vercel.ai/docs |
| **Ollama** (dev default) | Local model endpoint for AI SDK | https://ollama.com |
| **exif-reader or similar** | Lat/lng/time from image — *verify package early in build* | — |
| **sharp** (or equivalent) | Resize/compress before `Bytes` storage — *verify on Vercel* | https://sharp.pixelplumbing.com |
| **Nominatim (OSM)** | Free reverse geocode | https://nominatim.org/release-docs/latest/api/Reverse/ |
| **Leaflet** (+ React Leaflet) | Place-view map + pins | https://leafletjs.com ; https://react-leaflet.js.org |
| **Vercel** | Hosting | https://vercel.com/docs |

**Learner agreements:** familiar core stack; stretch = EXIF, location, Leaflet. Backend + API routes + DB (not a frontend-only fake). Host on Vercel; DB set up by learner via Prisma. Auth = **custom JWT** (email/password; no NextAuth/Google). Images = shrunk blobs in Postgres. AI = AI SDK, Ollama first, swap later. Geocode = free Nominatim. Map = place browse only, not memory detail. Single photo per create; both place and time required before Generate.

## Where It Runs and How Someone Tries It

- **Runtime:** Next.js on Vercel (Node serverless/API routes) + Postgres reachable from Vercel.
- **Local/dev:** `npm run dev` (or `pnpm`/`yarn` as chosen in build). Postgres via learner’s Prisma setup. Ollama running locally for captions when using the local provider.
- **Env (names illustrative):** `DATABASE_URL`, `JWT_SECRET` (signing key), `AI_PROVIDER` / Ollama base URL (and later Google/NVIDIA keys). Never commit secrets; ship `.env.example` only.
- **Start (expected):** install deps → set `.env` → `prisma migrate` / `db push` → start Ollama if local AI → `next dev` → open `http://localhost:3000`.
- **Demo recording:** Log in → empty or existing diary → upload one photo (or demo photo with EXIF) → see address/time → Generate → edit → save → browse by day and by place (map with pins) → add a tag. Submission also needs public GitHub + short video; Vercel URL is extra for personal use.
- **Deploy:** Push to GitHub; Vercel project pointed at the repo; set env vars; run Prisma migrations against the hosted DB the learner configures.

## Look and Feel

Carried from `prd.md > Look and Feel` / `scope.md > Inspiration & Identity`:

- Paper-like, warm, organic — notebook meets nature.
- Palette: warm paper, dark green, matte brown; matte, not glossy/neon.
- Tone: calm, trustworthy record — not social polish or generic AI chrome.
- Avoid: cold grays, bright gradients, flashy tech-default styling.
- Implement with shadcn + CSS variables / Tailwind tokens matching that palette; expressive but readable type (not default Inter-only chrome if it fights the notebook feel).

## Components

### Landing page

Public explanation of Orma + Log in CTA. No memories.  
Implements `prd.md > Landing and access`, `Screens and Layout > Landing`.

### Auth (custom JWT)

Register and login API routes: hash password (e.g. bcrypt), store user in Postgres, issue a signed JWT (`jose` or equivalent). Client keeps the token (httpOnly cookie preferred, or secure storage agreed in build) and sends it on protected requests. Middleware or helpers verify JWT and scope queries to `userId`. No OAuth / NextAuth in this POC.  
Implements `prd.md > Landing and access`.  
Tradeoff accepted: full control and one auth path; you own password reset, hashing, and token expiry yourself (keep POC minimal: login + register + logout).

### Diary home

Signed-in list of memories (thumbnail from stored bytes, caption snippet, day, place). Group/filter by day or place. Empty state CTA. Persistent “new memory” action.  
Implements `prd.md > Save and diary browsing`, `Screens and Layout > Diary home`.

### Create memory modal

Single-file upload → preview → EXIF extract → Nominatim address when coords exist → require **both** place and time (manual + current location/time shortcuts if missing) → Generate → editable caption → confirm/cancel.  
Implements `prd.md > Upload and metadata extraction`, `Generate memory`, `States and Boundaries`.

### Memory detail / evidence

Shows place, day, caption together. Day/place links to drill-downs. **No map here.** Tag add/display.  
Implements `prd.md > Evidence inspection`, `Tags`.

### Day drill-down

List all memories for a chosen calendar day.  
Implements `prd.md > Save and diary browsing`, `Screens and Layout > Day or place drill-down`.

### Place drill-down + map

List memories for a place; **Leaflet** map with a pin per memory that has coordinates. First build check: one pin, then multiple.  
Implements `prd.md > Save and diary browsing`, `Evidence inspection` (navigation); learning stretch for Leaflet.

### Image pipeline

Read EXIF → resize/compress → hold for generate/save → persist as Postgres `Bytes` (+ mime type).  
Implements `prd.md > Upload and metadata extraction`; storage decision from spec interview.

### Caption generation API

AI SDK call with image + place/time context; prompt must not invent place/time that contradict supplied evidence (`scope.md > The Unique Kernel`).  
Implements `prd.md > Generate memory`.

### Geocoding API

Server-side Nominatim reverse geocode; store address string on the memory; respect usage policy (identify app, cache result, don’t hammer).  
Implements `prd.md > Upload and metadata extraction`.

## Data Model

Postgres via Prisma. Shape (names may refine in migration):

**User** — `id`, `email` (unique), `passwordHash`, `name` (optional), `createdAt`, `updatedAt`. No Auth.js Account/Session tables.

**Memory**

| Field | Notes |
|---|---|
| `id` | cuid/uuid |
| `userId` | owner; indexed |
| `caption` | editable text |
| `takenAt` | required for save/generate path |
| `latitude`, `longitude` | required for generate path when using geo; stored for map |
| `address` | human-readable from Nominatim or manual place text |
| `imageData` | `Bytes` — shrunk image |
| `imageMimeType` | e.g. image/jpeg |
| `createdAt`, `updatedAt` | timestamps |

**Tag** — `id`, `name`, `userId` (optional uniqueness per user).  
**MemoryTag** — join `memoryId` + `tagId`.

**Where data lives / come back later**

| Data | Stored | On return |
|---|---|---|
| Auth token | Custom JWT (cookie or client storage) | Valid until expiry or logout clears it |
| Memories, tags, edits | Postgres | Loaded by `userId` on diary routes |
| Image | Postgres `Bytes` | Served via authenticated image route or data URL from API |
| Address | Column on Memory | No re-geocode unless coords change |
| AI provider | Env config | Swap Ollama ↔ cloud without schema change |

## File Structure

```
orma/
├── app/
│   ├── page.tsx                 # Landing (signed out)
│   ├── layout.tsx
│   ├── globals.css              # Paper/green/brown tokens
│   ├── login/page.tsx           # Sign-in UI
│   ├── register/page.tsx        # Sign-up UI
│   ├── diary/
│   │   ├── page.tsx             # Home list + day/place controls
│   │   ├── day/[day]/page.tsx  # Day drill-down
│   │   └── place/[placeId]/page.tsx  # Place list + Leaflet
│   ├── memories/[id]/page.tsx   # Evidence detail (no map)
│   └── api/
│       ├── auth/register/route.ts
│       ├── auth/login/route.ts
│       ├── auth/logout/route.ts
│       ├── memories/route.ts     # list/create
│       ├── memories/[id]/route.ts
│       ├── memories/[id]/tags/route.ts
│       ├── upload/extract/route.ts   # EXIF + optional geocode
│       ├── geocode/route.ts
│       ├── generate/route.ts     # AI SDK caption
│       └── images/[id]/route.ts  # authenticated image bytes
├── components/
│   ├── landing/
│   ├── auth/
│   ├── diary/
│   ├── memory/
│   │   ├── create-memory-modal.tsx
│   │   ├── memory-card.tsx
│   │   └── evidence-panel.tsx
│   ├── maps/
│   │   └── place-map.tsx        # Leaflet + pins
│   └── ui/                      # shadcn
├── lib/
│   ├── prisma.ts
│   ├── auth.ts                  # hash password, sign/verify JWT
│   ├── image.ts                 # shrink + EXIF helpers
│   ├── geocode.ts               # Nominatim client
│   └── ai.ts                    # AI SDK provider factory (Ollama default)
├── prisma/
│   ├── schema.prisma
│   └── migrations/
├── public/
├── .env.example
├── package.json
├── README.md
└── devpost/                     # learning docs (this spec, prd, scope)
```

## External Services and Dependencies

### Postgres (learner-managed)

- Connection via `DATABASE_URL`. Prisma Migrate / `db push` in setup.
- Docs: https://www.prisma.io/docs/orm/overview/databases/postgresql

### Custom JWT auth

- `POST /api/auth/register` — email, password → create user with hashed password → return JWT.
- `POST /api/auth/login` — email, password → verify → return JWT.
- `POST /api/auth/logout` — clear cookie / client token.
- Protected routes: `Authorization: Bearer …` or httpOnly cookie; verify signature with `JWT_SECRET`.
- Libraries: password hash (e.g. bcrypt) + JWT (`jose` recommended on Next/Edge).
- Docs: https://github.com/panva/jose ; https://jwt.io/introduction
- Out of POC unless needed: email verification, password reset, refresh-token rotation.

### Nominatim reverse geocode

- Example: `GET https://nominatim.openstreetmap.org/reverse?lat=…&lon=…&format=json`
- Policy: valid User-Agent, low volume, cache on Memory.
- Tradeoff: free / rate-limited vs paid Google geocoding.
- Docs: https://nominatim.org/release-docs/latest/api/Reverse/

### AI SDK + Ollama (default)

- Local Ollama OpenAI-compatible or Ollama provider; vision-capable model required for image captions — **confirm model supports images early in build**.
- Later: same `lib/ai.ts` switch to Google free-tier or NVIDIA via env.
- Docs: https://sdk.vercel.ai/docs ; https://ollama.com/docs

### Vercel

- Deploy web app; env for DB and secrets.
- Note: request body size limits make image shrink mandatory before upload/API handling.
- Docs: https://vercel.com/docs

### Leaflet / OSM tiles

- Client-side map on place pages; tiles from OSM tile usage policy.
- Docs: https://leafletjs.com/reference.html

## Important Failure Modes

- **Photo missing place or time** → Clear error; manual place + time; current location / current time shortcuts; **Generate stays blocked until both are set** (`prd.md > States and Boundaries`).
- **Ollama / AI unreachable or slow** → Loading state; plain error “Couldn’t generate caption—is Ollama running?” (or cloud key missing); user can retry; do not save a fake caption.
- **Nominatim rate limit / failure** → Show coords + allow manual place name; don’t invent an address.
- **Image too large / shrink fails** → Reject with message to try a smaller photo; never store full-resolution camera originals in Postgres.

## What Was Simplified and Why

- **Single-image create** instead of multi-photo day import — proves the vertical first (`prd.md > Product Decisions`). Same-day grouping still works via several single uploads.
- **Image bytes in Postgres** instead of S3/Blob store — one system to run; requires aggressive shrink.
- **Nominatim** instead of Google Geocoding — free for light personal use; rate limits accepted.
- **Map only on place browse** instead of every detail page — matches product choice; Leaflet still learned where it pays off.
- **AI SDK + Ollama first** instead of hard-wiring one cloud — agnostic swap later.
- **No people grouping / face recognition / social** — already cut in scope/PRD.
- **Custom JWT only** instead of NextAuth + Google — one email/password path you control; no OAuth app setup. You own hashing, expiry, and logout.

## Decisions and Open Issues

**Decisions**

- Stack: Next/React/Postgres/Prisma/shadcn/AI SDK; deploy Vercel; learner owns DB setup.
- Auth: custom JWT (email/password register/login); no NextAuth/Google.
- Storage: shrunk image `Bytes` in Postgres.
- AI: AI SDK; Ollama now; Google or NVIDIA later via config.
- Geocode: Nominatim; persist address.
- Map: Leaflet on place view with pins; not on memory detail.
- Generate gate: both place and time required.
- Create flow: one photo only in this POC.

**Learner uncertainty (Leaflet)**

- Least sure about Leaflet. Clarified: browser map + OSM tiles + pins from stored lat/lng on the place page; no custom map server.
- **Build investigation:** implement place view with **one pin** from a saved memory, confirm interactivity, then show **multiple pins** for memories sharing that place. Evidence: place page renders map and pins matching DB coordinates.

**Open / verify early in build**

- Exact EXIF library and Vision-capable Ollama model name (must accept images).
- JWT delivery: prefer httpOnly secure cookie vs Bearer in localStorage — decide in first auth build step (recommendation: httpOnly cookie on same-site Vercel deploy).
- Vercel body size vs chosen max shrunk image size (set an explicit max, e.g. target under ~1MB after compress).
- Place identity key for grouping: normalized address string vs rounded lat/lng geohash — pick one simple rule in the first data-model step (recommendation: store address + coords; group by normalized address when present, else by rounded coords).
