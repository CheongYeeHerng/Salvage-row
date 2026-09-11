# Salvage Row

A seeded secondhand marketplace demo with natural-language catalogue search and a
catalogue-grounded Q&A assistant, both powered by a model reached through a class-provided
API gateway. Built with Next.js 14
(App Router), TypeScript, and Tailwind CSS. No sign-in required anywhere on the site.

**[Read `/notes`](./app/notes/page.tsx)** for a full, plain-English write-up of the design
and implementation decisions — also live at `/notes` on the deployed site.

---

## Contents

- [Features](#features)
- [Tech stack](#tech-stack)
- [Getting started](#getting-started)
- [Environment variables](#environment-variables)
- [Deployment](#deployment)
- [Project structure](#project-structure)
- [How search and Q&A work](#how-search-and-qa-work)
- [What's real vs. simulated](#whats-real-vs-simulated)
- [Known limitations](#known-limitations)

## Features

- **Browse & item detail** — a responsive listings grid and a detail view for each item,
  usable on mobile without any account.
- **Natural-language search** — describe what you want in plain English ("something for a
  first apartment under $50") and get ranked, relevant listings back.
- **Catalogue Q&A** — ask questions about the catalogue, including comparisons across items;
  the assistant answers only from listed data and says so when a fact isn't on file.
- **Report a listing** — flag wrong information or a suspected scam from any item page.
- **Simulated checkout** — a clearly labeled, no-op "Buy" flow (no real payments, per the
  brief).

## Tech stack

| Layer      | Choice                                   |
| ---------- | ----------------------------------------- |
| Framework  | Next.js 14 (App Router), TypeScript       |
| Styling    | Tailwind CSS                              |
| AI model   | gpt-5.6-terra, via a class gateway, called server-side only |
| Data       | Static seed catalogue (`data/catalogue.ts`) — no database |
| Hosting    | Any Node host; tested against Vercel      |

## Getting started

**Requirements:** Node.js 18.18+ (or 20+), and a class gateway key (`cg_...`)
if you want live AI responses from search and Q&A (the site still runs and browses fine
without one — see [What's real vs. simulated](#whats-real-vs-simulated)).

```bash
git clone <this-repo-url>
cd salvage-row
npm install
cp .env.example .env.local   # Windows: copy .env.example .env.local
npm run dev
```

Open <http://localhost:3000>.

## Environment variables

| Variable            | Required | Description                                                                 |
| -------------------- | -------- | ----------------------------------------------------------------------------- |
| `GATEWAY_API_KEY`    | No*      | Server-side only. Your class gateway key (`cg_...`). Enables live model responses for search and Q&A via the gateway's OpenAI-compatible Chat Completions endpoint. Never read in client code. `ANTHROPIC_API_KEY` also works as a fallback name if that's what you already set. |
| `GATEWAY_BASE_URL`   | No       | Overrides the gateway's base URL if it differs from the default (`https://174.138.16.223`). |
| `GATEWAY_MODEL`      | No       | Overrides the model id requested if the default (`gpt-5.6-terra`) isn't available on your gateway. |

\* Without a key, search falls back to keyword matching and Q&A reports itself unavailable —
both degrade gracefully rather than erroring.

## Deployment

Deploys like any standard Next.js app:

1. Push to a Git repository and import the project in [Vercel](https://vercel.com) (or run
   `npx vercel` from this directory).
2. In the project's **Environment Variables** settings, add `ANTHROPIC_API_KEY`. Do not
   expose it to the client — it should only ever be read inside `app/api/*/route.ts`.
3. Deploy. `/`, `/item/[id]`, `/notes`, and the API routes are all public with no auth.

## Project structure

```
app/
  page.tsx                browse view — search box, category filters, listings grid
  item/[id]/page.tsx       item detail view
  notes/page.tsx           public write-up of decisions and known gaps
  api/
    search/route.ts        natural-language search (gateway model, with keyword fallback)
    qa/route.ts             catalogue Q&A (gateway model)
    report/route.ts         listing report submission (server-validated, logged)
components/                UI components (client components where interactive)
data/catalogue.ts          seed data — 24 listings, mostly unique single items, with
                            some fields intentionally left unknown (brand, era, original
                            price, tested/verified-working status)
lib/
  model.ts                  server-only model-call helper — key never reaches the client
  search.ts                 shared prompt-context builder + keyword fallback
```

## How search and Q&A work

Both features send the entire catalogue (small enough to fit comfortably in context) to
the configured model as JSON alongside the user's query or question, and ask for a grounded response —
ranked listing IDs for search, a direct answer for Q&A. There's no embeddings pipeline or
vector database; it's the simplest approach that works at this catalogue size, with the
trade-offs of that choice (cost, latency, and scale) explained in detail in `/notes`.

Fields the seller hasn't logged (brand, era, original price, tested status) are stored as
`null`, and both prompts are explicitly instructed to say so rather than guess — this is
exercised deliberately by several seeded listings.

## What's real vs. simulated

| Feature                      | Status                                                        |
| ------------------------------ | --------------------------------------------------------------- |
| Browsing, item detail          | Real                                                           |
| Natural-language search        | Real — live model call through the gateway, with a keyword fallback |
| Catalogue Q&A                  | Real — live model call through the gateway                     |
| Listing reports                | Real API call, validated and logged server-side — not reviewed by anyone |
| Checkout / payment             | Simulated — a confirmation UI only, no real payment processed  |
| Accounts / auth                | None, by design — the whole site is public                     |

## Known limitations

See the ["What's unfinished or out of scope"](./app/notes/page.tsx) section of `/notes` for
the full list, including: no pagination past 12 search results, no rate limiting or caching
on the API routes, prompts aren't hardened against adversarial queries, and reports aren't
routed to any real moderation workflow.
