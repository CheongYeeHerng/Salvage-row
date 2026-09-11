# Salvage Row — secondhand marketplace demo

A seeded secondhand marketplace built with Next.js 14 (App Router) + TypeScript + Tailwind CSS.
Mobile-friendly browse and item-detail views, natural-language catalogue search, and a
catalogue-grounded Q&A assistant — both backed by the Claude API through server-side routes.
No sign-in is required anywhere on the site. See `/notes` (also at `app/notes/page.tsx`) for
a full write-up of the design and implementation decisions.

## Requirements

- Node.js 18.18+ (or 20+)
- An Anthropic API key, only needed for the AI-backed search/Q&A features to return live
  model responses (the site still runs and browses fine without one — search falls back to
  keyword matching, and Q&A reports the feature as unavailable).

## Local development

```bash
npm install
cp .env.example .env.local   # then paste your key into .env.local (on Windows: copy instead of cp)
npm run dev
```

Visit http://localhost:3000.

## Deploying (e.g. Vercel)

1. Push this project to a Git repo and import it in Vercel (or run `vercel` from this
   directory).
2. In the project's environment variables settings, add `ANTHROPIC_API_KEY` with your key.
   Do **not** add an `NEXT_PUBLIC_`-prefixed version of it — that would ship it to the
   browser. It should only ever be read inside `app/api/*/route.ts`, which run server-side.
3. Deploy. `/`, `/item/[id]`, and `/notes` are all public routes with no auth.

## Project structure

```
app/
  page.tsx              browse view (search + category filters + grid)
  item/[id]/page.tsx     item detail view
  notes/page.tsx         public write-up of decisions and known gaps
  api/search/route.ts    natural-language search (Claude, with keyword fallback)
  api/qa/route.ts        catalogue Q&A (Claude)
components/              UI components (client components where interactive)
data/catalogue.ts        seed data — 24 listings, mostly single/unique items, some fields
                          intentionally left unknown (brand, era, original price, tested status)
lib/anthropic.ts         server-only Claude API helper (key never reaches the client)
lib/search.ts            shared prompt-context builder + keyword fallback
```

## What's real vs. simulated

- Real: browsing, item detail, natural-language search, catalogue Q&A (all call the live
  Claude API server-side).
- Simulated, and labeled as such in the UI: checkout/payment on the item page. There are no
  user accounts, cart persistence, or shipping/logistics — out of scope per the brief.
