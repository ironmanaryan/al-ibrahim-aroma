# Al Ibrahim Aroma

A code-first, premium fragrance-house website for **Al Ibrahim Aroma** — a small-batch attar and parfum
house in Lucknow, est. 1974. Built with the Next.js App Router, TypeScript and hand-written CSS. No
page builder, no WordPress: every pixel lives in this repository.

Tagline: *The scent of a memory you can wear.*

---

## Stack

| Layer      | Choice                                                        |
| ---------- | ------------------------------------------------------------- |
| Framework  | Next.js 15.5 (App Router, React 19, Server Components)        |
| Language   | TypeScript                                                    |
| Styling    | Hand-written CSS (`globals.css`, `admin.css`) — no Tailwind   |
| Motion     | GSAP 3 + IntersectionObserver, CSS keyframes                  |
| Auth       | `jose` JWT in an httpOnly cookie + scrypt password hashing    |
| Storage    | JSON document store — Upstash Redis REST, else local file     |
| Artwork    | Parameterised inline SVG flacons (no runtime image hotlinks)  |

## Features

**Storefront**

- Cinematic hero with layered gradients, drifting aroma notes, parallax and GSAP reveals.
- Filterable showcase grid (`/collections`) with category/family chips, price + intensity filters and a
  full-screen quick-view lightbox.
- Product pages with generated bottle art, notes pyramid, intensity meters, size selector, sticky buy box.
- Scent finder quiz and gifting builder with a live price estimate.
- Cart drawer → checkout that reserves an order in the CRM (no payment gateway; WhatsApp follow-up).
- Floating WhatsApp button (single tap, no pop-ups), announcement ribbon, newsletter capture.
- Testimonial carousel, press strip, live counters, FAQ accordion, journal.
- SEO: metadata per page, OpenGraph image route, JSON-LD (Organization, Product, FAQ), sitemap, robots.

**Admin (`/admin`)**

- Dashboard: visits sparkline, pipeline bars, order value, batch health, latest enquiries, live activity feed.
- Orders: every checkout appears instantly with items, total, delivery details and status flow.
- Activity log: orders, enquiries, newsletter sign-ups, WhatsApp taps, sign-ins and every admin change.
- Products CMS: create/edit/delete, sizes, notes, stock, flags, live bottle preview.
- Journal CMS with markdown-lite body, drafts, publish dates.
- Testimonials CMS, media library (drag & drop upload, copy URL), house settings.
- Lead CRM: tabs by status (New / Contacted / In Progress / Closed), notes, WhatsApp/call/email actions.
- Users & RBAC: `admin` (full control) and `moderator` (content + CRM, no deletion/settings).
- JWT session in an httpOnly cookie, middleware-guarded `/admin/*`.

## Typography

Two self-hosted faces (both in `src/app/fonts/`, no runtime font requests):

- **Cormorant Garamond** — display type, headlines and prices. A high-contrast old-style serif; italic
  is used for the second line of the hero and for editorial emphasis.
- **Jost** — interface and body copy. A geometric grotesque with a small optical weight, set at 16.5px
  with 1.7 leading.

The palette is black lacquer (`#0b0b0b`), crimson (`#8b0d1a`) and off-white (`#f5f2ed`). Photography
lives in `public/images/`; the storefront uses real photographs (Unsplash) rather than stock vector
bottles wherever a picture earns its place.

## Getting started

```bash
npm install
npm run dev          # http://localhost:3000
npm run typecheck
npm run build && npm start
```

Seed data (products, journal, testimonials, settings, demo leads) is written automatically on first read.

### Demo accounts

| Role      | Email                    | Password        |
| --------- | ------------------------ | --------------- |
| Admin     | `admin@alibrahim.com`    | `AlIbrahim@2026` |
| Moderator | `editor@alibrahim.com`   | `Editor@2026`   |

> Change these before going live: sign in as admin → **Users** → edit each account.

## Environment

Copy `.env.example` to `.env.local`:

```bash
AUTH_SECRET=...            # required in production; any long random string
UPSTASH_REDIS_REST_URL=    # optional, but recommended on Vercel
UPSTASH_REDIS_REST_TOKEN=
```

Without Upstash the app stores its JSON database in `.data/db.json` locally and in `/tmp` on Vercel —
fine for a preview, but **ephemeral** on serverless. Point it at Upstash (or any Redis REST endpoint that
speaks `GET/SET`) for durable content and leads.

## Project layout

```
src/
  app/
    (site)/            storefront routes (header/footer shell)
    admin/             login + (panel) authenticated routes
    api/               leads, newsletter, track, auth, admin CRUD
  components/          storefront + admin UI
  lib/
    seed.ts            all seed content
    store.ts           JSON/KV persistence + migration
    auth.ts session.ts scrypt + JWT
    content.ts         server-side data getters
  app/globals.css      design system
  app/admin/admin.css  admin panel
public/images/         local photography
```

## Deploying

```bash
vercel link --project al-ibrahim-aroma
vercel env add AUTH_SECRET production
vercel --prod
```

Set `AUTH_SECRET` (and Upstash keys if used) in the Vercel dashboard, then redeploy. The admin panel is at
`/admin`, the storefront at `/`.

---

© Al Ibrahim Aroma. Code and content in this repository are proprietary to the brand.
