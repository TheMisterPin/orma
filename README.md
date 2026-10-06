# Orma

A personal diary that reconstructs a day from photo evidence — without inventing details.

## Stack

- Next.js (App Router) under `src/app` (thin routes)
- Feature folders under `src/features/*`
- Shared infra: `src/shared/ui`, `src/shared/db`
- Postgres + Prisma
- Custom JWT auth (httpOnly cookie)
- pnpm

## Setup

1. Copy `.env.example` to `.env` and set `DATABASE_URL` and `JWT_SECRET`.
2. Install and migrate:

```bash
pnpm install
pnpm exec prisma migrate dev
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000).

## Feature layout

```
src/features/<feature>/{types,actions,hooks,components/{forms,pages},index.ts}
```

Routes stay thin: page → feature hook → stateless feature view.
