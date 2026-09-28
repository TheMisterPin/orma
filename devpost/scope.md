---
doc: scope
status: approved
---

# Orma

A personal journal that reconstructs one day from photos you already took, and writes a short diary that can show why it said what it said.

## The Unique Kernel
Orma can reconstruct, but it should not invent. Anyone can ask a model to turn photos into a story. Orma has to show the evidence behind a memory, and say when that evidence is weak instead of filling in a confident detail.

## Who It's For
Someone who wants to keep memories and does not consistently journal. Parents, travelers, and busy people are examples, not a specialized product. Today they have photos, places, and timestamps scattered around, and almost none of it becomes a record of the day. Journaling asks them to stop, remember, organize, and write. Orma is meant to remove most of that work.

## The Core Loop
They give Orma a small set of photos from one day. Orma reads the metadata it actually has, especially timestamps and location, groups the photos into moments, and writes a short diary from that evidence only. They read the entry, inspect why a memory is there, correct the text, and save it. They come back because a diary holds the context around a photo, not just the photo.

## Inspiration & Identity
The main experience should feel very simple: import a day, see a few moments, read the diary, check the evidence, edit, save. The tone is a record you can trust, not a polished story. No visual references were named.

## Why This Matters to the Learner
He recently became a dad and wants a way to keep moments with his daughter and a record of how he spends his days. Photos capture a moment. A diary captures the day. Months or years later, remembering what that day looked like is the real product. He also thinks other people could use it, because so many pictures just sit on a phone.

## What "Working" Looks Like
One complete flow, demonstrable on a screen: select or upload photos from one day, extract available metadata, group related photos into moments, generate a short evidence-backed diary, inspect why a generated memory exists, edit it, and save it. The "oh, that's cool" beat is opening a claim like "afternoon at a park" and seeing it came from photos at the same place and time — or seeing Orma stay uncertain when the evidence is thin. If real EXIF metadata is missing, a prepared demo set of photos with timestamps and locations is enough to show the flow reliably.

## The POC Boundary
In: a manually uploaded day of photos, or a prepared demo dataset. Metadata that is actually there. Moments grouped from that evidence. A short diary grounded only in that evidence. A way to inspect the source of a generated memory. Edit and save the entry.

If it is not needed to prove that fragmented evidence can become a coherent, traceable memory, it is not in this proof of concept.

## Later
Other digital traces he named and then set aside for this hackathon: calendar events, automatic Google Photos or iCloud import, and searching a larger personal memory. Worth doing once one day can be reconstructed honestly.

## Explicitly Cut
- A complete life-logging platform. The hackathon only has to prove one day.
- Social features, sharing, and family accounts. This is a personal record, and none of that proves the kernel.
- Face recognition and continuous background tracking. Orma should work from what the user hands it, not from watching them.
- A native mobile app. A manually uploaded set is enough to demo.
- Apple Health, calendar sync, and a large memory search. Called out so they do not sneak into the build.
- Complex authentication, infrastructure, and settings, unless something small is required to show the core experience.
