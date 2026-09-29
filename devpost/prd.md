---
doc: prd
status: draft
---

# Orma — Product Requirements

A personal diary for people who rarely journal: sign in, upload a photo, and Orma turns available place-and-time evidence into a memory you can inspect, edit, tag, and browse by day or place.

Source: `scope.md > Who It's For`, `The Core Loop`, `The Unique Kernel`.

## The Core Journey

1. A visitor lands on a public page that explains what Orma is and offers a **Log in** call to action.
2. After login, they arrive at their **diary home** — a personal list of saved memories.
3. If they have no memories yet, the home screen prompts them to **create a new memory from an image**.
4. A modal opens. They upload one image file. Orma reads latitude, longitude, and timestamp from the file when present, resolves a human-readable **address** for the location, and shows a **preview** of the image alongside that evidence.
5. They tap **Generate memory**. The image and location context are sent for AI processing; Orma returns a **short description (caption)** grounded in the photo and the place/time evidence.
6. They review a **preview** of the memory (image, place, day/time, caption). They **confirm** or **edit** the text before saving.
7. The saved memory appears on the diary home. They can **organize and browse** memories grouped by **day** or **place**, open a day or place to see all related memories, **add tags** to a memory, and inspect **place, day, and caption** as the evidence trail for why that memory exists.
8. They return later to a diary that holds context around photos, not just the photos themselves.

Source: `scope.md > The Core Loop`, `What "Working" Looks Like`.

## Screens and Layout

### Landing (signed out)

- Short explanation of Orma: personal memories from photos, with evidence you can check.
- Primary **Log in** CTA.
- No diary content visible without signing in.

### Diary home (signed in)

- Header or title area for the personal diary.
- **Memories list** when entries exist — each row/card shows enough to recognize the memory (e.g. thumbnail, caption snippet, day, place).
- **View controls** to group or filter the list by **day** or **place** (not by people in this proof of concept).
- **Empty state** when there are no memories: clear CTA to create the first memory from an image.
- Persistent way to start **another** upload (same flow as empty-state CTA).

### Create memory modal

- File upload for one image.
- After upload: image preview; extracted **timestamp**; **address** from coordinates when available.
- **Generate memory** action (disabled or hidden until upload succeeds).
- After generation: editable caption/description; **confirm/save** and a way to cancel or go back without saving.

### Day or place drill-down

- From the home grouping, tapping a **day** or **place** opens a focused list of all memories that share that day or place.
- From a memory, the user sees **place**, **day**, and **caption** as the inspectable evidence trail.

Source: `scope.md > Inspiration & Identity` (simple, trustworthy record).

## Look and Feel

- **Overall:** Paper-like, warm, organic — between a **notebook** and **nature**.
- **Palette:** Warm paper tones, **dark green**, **matte brown**; matte, not glossy or neon.
- **Tone:** Calm and trustworthy — a record you can believe, not a polished social story or generic “AI app” chrome.
- **Avoid:** Cold grays, bright gradients, and flashy tech-default styling.

Source: learner direction in PRD interview; extends `scope.md > Inspiration & Identity`.

## Features and Behavior

### Landing and access

- Signed-out visitors see what Orma is and can log in.
- Signed-in users go straight to their diary home.
- Each user sees only their own memories (personal record).

Source: `scope.md > Explicitly Cut` (no social/sharing); minimal auth acceptable to show the core experience.

### Upload and metadata extraction

- User uploads **one image file** in the create-memory modal.
- Orma extracts **latitude, longitude, and timestamp** when the file contains them.
- Orma shows a resolved **address** for the coordinates (human-readable place name).
- User sees **preview + extracted data** before generating text.

- [ ] After a valid upload, preview, timestamp (when present), and address (when coordinates present) appear in the modal before generation.
- [ ] Coordinates and time shown match what was extracted from the file (or what the user supplied after a metadata gap — see States).

### Generate memory

- **Generate memory** sends the image and location/time context to AI and returns a **caption/description** that includes or reflects the **location** in the narrative.
- Generated text is shown for review; user can edit before saving.

- [ ] Tapping **Generate memory** produces visible caption text tied to the uploaded image and place/time shown in the modal.
- [ ] User can edit the caption before confirming.

Source: `scope.md > The Unique Kernel` (ground in evidence, not invention — caption should not claim places or times that contradict shown evidence).

### Save and diary browsing

- On confirm, the memory is saved and appears on the diary home.
- Home supports browsing grouped by **day** and by **place**.
- Selecting a day or place shows all memories for that day or place.

- [ ] After save, the new memory appears on the diary home without a full page reload being required for the demo (immediate feedback).
- [ ] Grouping by day and by place each surfaces the correct set of memories for a chosen day or place.

### Evidence inspection

- On a memory, user can see **place**, **day**, and **caption** as the trace for what Orma recorded.
- Day and place are navigational: opening them lists related memories.

- [ ] Opening a memory shows place, day, and caption together.
- [ ] Tapping the day or place from a memory (or from home grouping) opens the list of memories sharing that day or place.

### Tags

- User can **add tags** to a saved memory (manual labels they choose).
- Tags are visible on or from the memory; they support personal organization in this proof of concept.

- [ ] User can add at least one tag to a memory and see it after saving.

Source: learner decision — tags in the proof of concept; people-based grouping deferred.

## States and Boundaries

- **First visit (signed out)** — Landing with explanation and Log in only.
- **Empty diary** — Signed in, zero memories; prominent CTA to create from an image.
- **Missing location or timestamp metadata** — Clear error: this photo doesn’t have the necessary metadata. Offer **manual entry** for place and time, with shortcuts **use current location** and **use current time** where applicable. After manual fill (or partial fill), user can continue to preview and generate when minimum evidence is present for the demo path.
- **Successful save** — Memory on home; day/place groupings update to include it.
- **Persistence** — Saved memories, tags, and edits remain when the user logs out and returns (personal diary over time).

Source: `scope.md > What "Working" Looks Like` (demo set acceptable when EXIF is missing — manual path covers live uploads without metadata).

## Product Decisions

- **Landing + login before diary** — Public explanation, then a private space for memories.
- **One image per create flow (first vertical)** — Prove upload, metadata, AI caption, save, and browse before batch or multi-photo day imports.
- **Day and place grouping on home** — Organization comes from extracted (or manually supplied) metadata, not from a separate “moments” editor in v1.
- **People grouping deferred** — Waits until metadata extraction and the upload/process vertical work; aligns with cutting face recognition in scope.
- **Tags in now** — Manual tags on memories for personal organization.
- **Missing metadata: error + manual fix + shortcuts** — Fail honestly, then let the user supply place/time rather than silently inventing EXIF.
- **Visual direction: paper, warm green/brown, notebook-meets-nature** — So the build doesn’t default to generic AI styling.

## What We're Building

- Public landing and login entry to a personal diary.
- Diary home with empty state, memory list, and browse by **day** and **place**.
- Create-memory modal: single-image upload, metadata extraction, address + timestamp display, generate caption with AI, edit, confirm, save.
- Evidence visible as place, day, and caption; drill-down lists by day and place.
- Manual tags on memories.
- Missing-metadata error with manual place/time entry and current-location / current-time shortcuts.

Source: `scope.md > The POC Boundary`, narrowed to the learner’s first vertical while keeping inspectable evidence and edit/save.

## Deferred From the POC

- **Browse/group by people** — Requires recognition or manual people labels beyond tags; explicitly after the first upload/process vertical.
- **Multi-photo “one day” import and automatic moment grouping** — In scope as the fuller loop; deferred until single-image flow is reliable (`scope.md > The Core Loop`).
- **Automatic Google Photos / iCloud import, calendar traces, large memory search** — `scope.md > Later`.
- **Social, sharing, family accounts** — `scope.md > Explicitly Cut`.
- **Native mobile app** — Web upload is enough for the demo.

## Possible Later Enhancements

- Upload many photos from one day and group them into moments before diary generation.
- People-based views once identity in photos is handled deliberately (not sneaking in face recognition).
- Richer “why this memory” UI linking caption claims directly to EXIF fields and map pin.
- Imports from photo libraries and other digital traces.

## Non-Goals

- Inventing place or time when metadata is missing and the user did not supply values.
- Face recognition or background tracking (`scope.md > Explicitly Cut`).
- Life-logging platform scope — prove one honest memory path first.
- Complex settings, infrastructure, or auth beyond what’s needed to show a personal diary.

## Open Questions

- **Aligning batch “one day” upload with the first vertical** — Does the hackathon demo require multiple photos in one action, or is several single uploads on the same day enough to prove grouping? *Should be resolved before `4-spec` if it changes build order.*
- **Minimum fields to allow Generate memory after manual metadata** — Both place and time required, or is one enough with a visible “partial evidence” state? *Resolve before `4-spec` if it affects empty/error UX.*
- **Tech stack (e.g. Google AI, hosting, auth provider)** — Captured in `4-spec`, not here; learner asked to choose stack in the next step.
