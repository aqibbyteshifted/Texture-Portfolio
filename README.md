# Zain & Co: Lahore Wall Texture Website

Next.js 16 (App Router) · React 19 · TypeScript · Tailwind CSS v4 · Zod

Built from the three Stitch designs (Home, Rockwall product, Quote confirmation).

## Run

```bash
npm install
npm run dev          # http://localhost:3000
npm run build && npm start
npm run typecheck
```

Copy `.env.example` to `.env.local` and set:

| Variable | Purpose |
| --- | --- |
| `NEXT_PUBLIC_SITE_URL` | Canonical URL for sitemap / Open Graph |
| `LEAD_WEBHOOK_URL` | Optional. Every lead is POSTed here as JSON (Google Apps Script, Zapier, Make, n8n, CRM) |

Leads are also appended to `.data/leads.jsonl` (git-ignored). Serverless hosts such as Vercel have a read-only
filesystem, so **set `LEAD_WEBHOOK_URL` in production**; otherwise leads would be lost.

## Structure

```
src/
  app/                 routes: /, /textures, /textures/[slug], /quote, /quote/confirmation, /api/leads
  components/
    layout/            Header, Footer, Logo, FloatingActions (WhatsApp + mobile action bar)
    sections/          Home page sections (Hero, TextureShowcase, CalculatorSection, ...)
    features/          Interactive pieces (CostCalculator, QuoteWizard, BeforeAfterSlider, ...)
    ui/                Button, Field, Accordion, Reveal, SectionHeading, icons
  data/                site.ts, textures.ts, projects.ts, content.ts  <- edit content here
  lib/                 pricing.ts, validation.ts (zod), leads.ts (server), whatsapp.ts, format.ts
  hooks/               useLeadSubmit
  types/
public/images/         Local copies of every image used by the designs
```

## Editing content

* **Prices / textures**: `src/data/textures.ts` (`rate` is PKR per sq ft). Calculators, catalog, quote wizard and
  detail pages all read from this one list; adding an entry creates a new `/textures/<slug>` page automatically.
* **Add-on prices, marla conversion, estimate range**: `src/lib/pricing.ts`.
* **Phone, address, hours, nav, process steps**: `src/data/site.ts`.
* **Projects, reviews, FAQs**: `src/data/projects.ts`, `src/data/content.ts`.

## Notes

* Warranty is stated as 3 years everywhere (the Stitch confirmation screen said 5; the home page said 3).
* Pricing for textures other than Rockwall, their specs and performance figures are placeholders written to match the
  design's tone. Replace them with your real numbers.
