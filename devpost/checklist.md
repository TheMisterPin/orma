---
doc: checklist
status: approved
---

# Build Checklist

Build mode: learn

Package manager: pnpm (learner preference)

## Slices

- [x] **1. Sign in and land on your empty personal diary**
  Becomes usable: A running Orma site with the paper/notebook look: public landing, email/password register and login (custom JWT), and a signed-in diary home that shows an empty state with a clear “create a memory from an image” CTA.
  Why now: Bootstrapping lives here, and every later slice needs a private place to land. Auth and the empty home prove the personal-diary boundary before any photo or AI work.
  PRD ref: `prd.md > The Core Journey` (steps 1–3), `prd.md > Landing and access`, `prd.md > Screens and Layout > Landing`, `Diary home`
  Spec ref: `spec.md > Stack`, `spec.md > Where It Runs and How Someone Tries It`, `spec.md > Look and Feel`, `spec.md > Components > Landing page`, `Auth (custom JWT)`, `Diary home`, `spec.md > Data Model` (User), `spec.md > File Structure`
  Build: Scaffold Next.js (App Router under `src/`) + TypeScript + Tailwind + shadcn with **pnpm**, using **feature folders** (`src/features/landing`, `auth`, `diary` + `src/shared/{ui,db}`). Thin `src/app` routes wire features only. Paper/green/brown tokens; Prisma User model; auth register/login/logout via `features/auth/actions` + JWT httpOnly cookie; landing and empty diary views as stateless feature page components driven by thin routes/hooks; `.env.example` and README (`pnpm install`, `pnpm dev`).
  Verify (mechanical): App starts with `pnpm dev`; register a user, log in, confirm redirect to diary empty state; log out and confirm landing/login again; confirm a second user cannot see another user’s session data (empty diary only).
  Learner check: Open the site, register, log in, and say whether the landing and empty diary feel like a calm notebook-style personal diary.
  Commit: `Add landing, JWT auth, and empty diary home`

- [ ] **2. Upload a photo and see place/time evidence before anything is invented**
  Becomes usable: From the diary, open create-memory: upload one image, see a preview, read EXIF place/time when present (and reverse-geocode to an address), or get a clear missing-metadata path with manual place/time plus current-location and current-time shortcuts. Generate stays blocked until both place and time are set. Nothing is invented.
  Why now: This is the unique kernel arriving early — Orma shows what it actually knows and refuses to fake the rest — and it is also where EXIF and Nominatim risk get proven.
  PRD ref: `prd.md > The Core Journey` (step 4), `prd.md > Upload and metadata extraction`, `prd.md > States and Boundaries` (missing metadata)
  Spec ref: `spec.md > Components > Create memory modal`, `Image pipeline`, `Geocoding API`, `spec.md > Important Failure Modes` (missing place/time, Nominatim failure), `spec.md > Decisions and Open Issues` (EXIF library)
  Build: Inside `src/features/memories` — create-memory form/modal, hooks for upload orchestration, actions for EXIF extract + optional Nominatim + image shrink; require both place and time; manual entry and current location/time shortcuts; evidence preview; Generate disabled until both present. Thin API route delegates to feature actions. Pick and pin the EXIF library that works.
  Verify (mechanical): Upload a photo with EXIF and confirm preview shows matching time and a resolved or fallback place; upload (or simulate) a photo without metadata and confirm the error + manual/shortcut path; confirm Generate remains blocked until both fields are set; confirm Nominatim failure still allows manual place text.
  Learner check: Upload a photo (with or without metadata), fill anything missing, and say whether the evidence preview is clear and trustworthy before any caption exists.
  Commit: `Add create modal with EXIF evidence and geocode`

- [ ] **3. Generate an evidence-grounded caption, edit it, and save the memory**
  Becomes usable: With place and time set, Generate returns a short caption grounded in the photo and shown evidence; you can edit it, confirm, and the memory (shrunk image bytes included) appears on the diary home.
  Why now: Completes the core create journey and proves the AI path (vision-capable Ollama via AI SDK) while the kernel rule is still front-and-center — caption must not contradict place/time evidence.
  PRD ref: `prd.md > The Core Journey` (steps 5–7), `prd.md > Generate memory`, `prd.md > Save and diary browsing` (save appears on home)
  Spec ref: `spec.md > Components > Caption generation API`, `Create memory modal`, `Diary home`, `spec.md > Data Model` (Memory), `spec.md > External Services > AI SDK + Ollama`, `spec.md > Important Failure Modes` (AI unreachable)
  Build: Extend `features/memories` (and diary list consumption): Memory Prisma model; generate/save actions (AI SDK/Ollama, evidence-bound prompt); editable caption in create form; persist caption, address, coords, takenAt, shrunk image; thin image API → memory action; diary home hook refreshes list from memory/diary actions after save.
  Verify (mechanical): With Ollama (or configured provider) up, generate a caption for a photo with place/time and confirm text returns; stop/break AI and confirm a clear retryable error with no fake caption saved; save a memory and confirm it appears on home with thumbnail and evidence fields after reload.
  Learner check: Generate a caption, edit one phrase, save, and confirm the memory shows up on your diary home the way you expect.
  Commit: `Add caption generation and save memory to diary`

- [ ] **4. Inspect evidence and browse by day or place (with map pins)**
  Becomes usable: Open a saved memory to see place, day, and caption together (no map on detail). From home, group by day or place; open a day or place list; on place drill-down, a Leaflet map shows pins for memories with coordinates.
  Why now: Browsing and evidence inspection prove the diary is more than a photo dump, and Leaflet — the named stretch risk — is tackled once real saved coordinates exist.
  PRD ref: `prd.md > The Core Journey` (step 7), `prd.md > Evidence inspection`, `prd.md > Save and diary browsing`, `prd.md > Screens and Layout > Day or place drill-down`
  Spec ref: `spec.md > Components > Memory detail / evidence`, `Day drill-down`, `Place drill-down + map`, `spec.md > Decisions and Open Issues` (Leaflet investigation, place identity key)
  Build: `features/memories` evidence detail view (place/day/caption, no map); `features/diary` grouping controls, day/place page components + hooks; thin day/place routes; place identity by normalized address (else rounded coords); Leaflet place map under diary (one pin, then multiple).
  Verify (mechanical): Save at least two memories (same day and/or same place as needed); open detail and confirm place/day/caption; confirm day and place groupings list the right sets; on a place page, confirm the map renders and pin coordinates match stored values for one pin, then for multiple.
  Learner check: Open a memory’s evidence, then browse by day and by place (including the map), and say what feels clear or confusing.
  Commit: `Add evidence detail, day/place browse, and place map`

- [ ] **5. Tag a saved memory**
  Becomes usable: On a memory, add at least one personal tag and see it stuck to that memory after save/reload.
  Why now: Tags are in the POC for personal organization; they sit last because the create, evidence, and browse path already prove the kernel without them.
  PRD ref: `prd.md > Tags`
  Spec ref: `spec.md > Data Model` (Tag, MemoryTag), `spec.md > Components > Memory detail / evidence`, `spec.md > File Structure` (`memories/[id]/tags`)
  Build: Inside `features/memories` — Tag/MemoryTag models, tag actions, form/UI on evidence detail; thin tags API route delegates to the feature.
  Verify (mechanical): Add a tag to a memory, reload, confirm it still appears; confirm tags stay scoped to that user’s memory.
  Learner check: Add a tag to one memory and confirm it still shows after you leave and come back to that memory.
  Commit: `Add tags on memories`

## Hands-on Checkpoints

- [ ] Early usable behavior explored — after slice 3 (full create → generate → save path works; feedback can still shape browse, detail, map, and tags)
- [ ] Final kick-the-tires exploration and feedback completed

## Final Review

- [ ] Final review complete — feedback resolved and learner confirms ready to ship

## Code Tour and App Map

- [ ] Learning activity complete — guided route, focused alternative, prior practice connected, or brief recap
- [ ] Optional edit and transfer reflection addressed — offered/declined/already covered/not applicable as appropriate
- [ ] `devpost/app-map.html` generated from finished code, checked, and shown, including a project-grounded practice to reuse

Activity and evidence: [what actually happened; real document/test/code references; unfinished work if interrupted]
Route and stops: [actual paths and symbols; guided stops completed, or reference-only route]
Edit outcome: [tried/kept/reverted/declined/not applicable; verification if changed]
Reflection: [offered/answered/declined/already covered — personal answer belongs only in the ignored profile]
Activity mode: [live app and editor, explicit static fallback, focused alternative, prior practice, or recap]

## Revisions

- Prefer `pnpm` for install and scripts — learner preference recorded at checklist approval; slice verify/start commands use `pnpm` instead of npm.
- Structure by feature under `src/features/*` (not by file type) — learner architecture rule; `spec.md > File Structure` and slice Build steps updated. Thin `src/app` routes; shared only `shared/ui` and `shared/db` unless a later need is genuine. Features: `landing`, `auth`, `diary`, `memories`.
