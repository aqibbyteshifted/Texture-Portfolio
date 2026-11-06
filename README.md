# Zain & Co: Lahore Wall Texture Website

Next.js 16 (App Router) · React 19 · TypeScript · Tailwind CSS v4 · Zod

Built from the Stitch designs (Home, Rockwall product, Quote confirmation), then extended.

## Run

```bash
npm install
npm run dev          # http://localhost:3000
npm run build && npm start
npm run typecheck
npm run i18n:check   # lists English strings that have no Urdu translation yet
```

Copy `.env.example` to `.env.local`. The important ones:

| Variable | Purpose |
| --- | --- |
| `LEAD_WEBHOOK_URL` | **Set this in production.** Every lead is POSTed here as JSON (Google Apps Script, Zapier, Make, n8n, CRM). Leads are also appended to `.data/leads.jsonl`, but serverless hosts cannot persist files. |
| `GOOGLE_PLACES_API_KEY` + `GOOGLE_PLACE_ID` | Optional. Live Google rating and latest reviews in the Reviews section. Not set = static rating from `src/data/site.ts`. |
| `NEXT_PUBLIC_GOOGLE_REVIEWS_URL` | Optional link behind the "Google Rating" badge. |
| `NEXT_PUBLIC_MAPS_QUERY` | Address (or `lat,lng`) for the map and directions button. |
| `NEXT_PUBLIC_SITE_URL` | Canonical URL for sitemap / Open Graph. |
| `NEXT_PUBLIC_GA_ID`, `NEXT_PUBLIC_META_PIXEL_ID` | Optional. GA4 and Meta Pixel. Loaded only after the visitor accepts the cookie banner (the banner appears only when one of these is set). Tracks WhatsApp/phone clicks, lead submissions, calculator use, PDF downloads, visualizer use. |

## Pages and features

* `/areas`, `/areas/[slug]`: one SEO page per Lahore locality (DHA, Bahria, Gulberg, Model Town, Johar/Lake City, WAPDA/Valencia), built from `data/areas.ts` plus your projects and reviews.
* `/projects`, `/projects/[slug]`: case-study page for every project in `data/projects.ts`.
* `/blog`, `/blog/[slug]`: guides written as data in `data/blog.ts` (Article JSON-LD, sitemap).
* `/visualizer`: colour & texture visualizer. Pick a sample room or upload a photo, tap a wall, try finishes and shades. Runs fully in the browser (photos are never uploaded). Edge-aware wall selection, add/remove/undo/redo, download PNG, keyboard support.
* `/warranty`: coverage, claim form (stored like any lead, `type: "claim"`) and a care guide per finish.
* Calculator extras: measure several walls and total them, and download a branded PDF estimate (jsPDF, English only).
* Announcement bar (`site.announcement`), referral capture (`?referral=CODE` is stored for 30 days and attached to every enquiry).
* `/` landing page: hero estimator, texture catalog, cost calculator, credentials + warranty card, before/after slider,
  project gallery with lightbox (photos + videos), team, process, consultation form, reviews (Google + video), FAQ, contact + map.
* `/textures`, `/textures/[slug]`: 10 finishes, each with specs, performance, use areas, **shade picker**, area calculator.
* `/compare`: side-by-side comparison of up to 3 finishes (shareable URL).
* `/quote` → `/quote/confirmation`: 3-step quote wizard (prefilled from calculators and shade picker).
* WhatsApp chat widget (desktop button, mobile bottom bar), live "Open now / Closed" status in Lahore time.
* **Urdu / English** toggle (cookie based, RTL layout, Urdu fonts). Pages are rendered per request because of this.

## Structure

```
src/
  app/                 routes + api/leads
  components/
    layout/            Header, Footer, Logo, LanguageToggle, FloatingActions (chat widget)
    sections/          landing-page sections
    features/          interactive pieces (CostCalculator, QuoteWizard, Gallery, CompareTool, ShadePicker, ...)
    ui/                Button, Field, Accordion, Lightbox, Reveal, OpenStatus, TextureImage, icons
  data/                site.ts, textures.ts, shades.ts, projects.ts, gallery.ts, credentials.ts, team.ts, content.ts
  i18n/                config.ts (translate, msg), server.ts, client.tsx, ur*.ts (Urdu dictionary)
  lib/                 pricing, validation (zod), leads (server), hours, whatsapp, googleReviews (server), format
  hooks/  types/
scripts/               check-i18n.mjs (+ alias loader)
public/images/         local copies of every image
```

## Editing content

* **Price list**: `rate` (regular PKR/sq ft), `offerRate` (current offer: customers pay this, the regular price is shown struck through with an OFFER tag), `rateMax` (for finishes priced as a range, e.g. epoxy 250 to 750: shown as "from – to", estimates start from the lower figure) and `warrantyYears` (default 3; Rockwall is 15) are all in `src/data/textures.ts`. Remove `offerRate` when an offer ends.
* **Finishes, rates, specs**: `src/data/textures.ts`. Adding an entry creates its page, catalog card, calculator option,
  compare column, quote option and sitemap entry automatically. Photos: put a file in `public/images/` and set `image`.
* **Shades**: `src/data/shades.ts` (name, hex, code per finish). The code travels with the quote request.
* **Gallery photos/videos**: `src/data/gallery.ts` (the file header shows how to add a YouTube or mp4 video).
* **Video testimonials**: add `video: { youtubeId: "..." }` (or `file`) to a testimonial in `src/data/content.ts`.
* **Certificates**: add `document: "/images/<scan>.jpg"` to a credential in `src/data/credentials.ts`.
* **Team**: `src/data/team.ts` (empty the array to hide the section).
* **Areas**: `src/data/areas.ts`. **Projects / case studies**: `src/data/projects.ts` (add `areaSqft` when known). **Guides**: `src/data/blog.ts`. **Care tips**: `src/data/care.ts`.
* **Announcement bar**: `site.announcement` in `src/data/site.ts` (change `id` when you change the text so people who dismissed it see the new one).
* **Phone, address, hours, nav**: `src/data/site.ts`. **Add-on prices, marla conversion**: `src/lib/pricing.ts`.

## Translations

Urdu strings live in `src/i18n/ur*.ts`, keyed by the exact English text, so a missing key just falls back to English.
After changing any English copy run `npm run i18n:check`: it lists strings without a translation. Wrap new constants
in `msg("...")` so the checker can see them. Long texture descriptions, performance tables and use-area text are
intentionally left in English.

## What is intentionally not included (needs a paid service or a database)

Slot booking with real availability, photo upload to your server, a leads dashboard with login, automatic WhatsApp/email confirmations, an AI chatbot and a live Instagram feed. Everything above works without any subscription.

## Placeholders to replace with real data

* Rates, specs, performance figures for Wash Terrazzo, Nugdi, Velvet Paint, Limewash, Epoxy Flooring.
* Shade palettes and codes (`shades.ts`), team members, Google rating/count, map address.
* Guides, area text and care tips are general drafts: review them and add Zain & Co's own specifics (they are indexed by Google).
* Photos are low resolution (512px) copies from the Stitch designs; replace with real project photos.
* Warranty is stated as 3 years everywhere (the Stitch confirmation screen said 5; the home page said 3).
