import { ADDON_PRICES, UNIT_TO_SQFT } from "@/lib/pricing";
import { formatNumber, formatPKR } from "@/lib/format";
import { getTexture, priceRange } from "@/data/textures";
import { effectiveRate, hasOffer } from "@/lib/rates";
import { msg } from "@/i18n/config";

export type Block =
  | { type: "h2"; text: string }
  | { type: "p"; text: string }
  | { type: "ul"; items: string[] }
  | { type: "callout"; text: string };

export interface BlogPost {
  slug: string;
  title: string;
  description: string;
  category: string;
  /** ISO date */
  date: string;
  readMinutes: number;
  cover: string;
  /** Texture slug the article's call-to-action points to */
  cta: string;
  body: Block[];
}

const rockwall = getTexture("rockwall-aggregates")!;
const travertine = getTexture("italian-travertine")!;
const boundaryArea = 120 * 5;

/**
 * Articles are plain data: add an object to this array and it appears on /blog, in the sitemap and on the home page.
 * They are general guidance written for homeowners; review them and adjust to Zain & Co's own practice.
 */
export const posts: BlogPost[] = [
  {
    slug: "rockwall-vs-travertine-lahore",
    title: "Rockwall vs Italian Travertine: Which Finish Suits Your Lahore Home?",
    description: "Both are popular on Lahore villas but they do different jobs. Here is how to choose between rugged rockwall and veined travertine plaster.",
    category: msg("Buying guide"),
    date: "2026-10-12",
    readMinutes: 4,
    cover: "/images/proj-dha-villa42.jpg",
    cta: "rockwall-aggregates",
    body: [
      { type: "p", text: "Rockwall and Italian travertine are two of the most requested finishes on Lahore villas. They look nothing alike and they are built for different jobs, so the right choice depends on where the wall is and what you want it to feel like." },
      { type: "h2", text: "Where each one works best" },
      { type: "p", text: `Rockwall is a rugged stone-aggregate texture applied about ${rockwall.specs.thickness} thick. It is made for exterior exposure: boundary walls, gates, porch columns and facade bands that take sun, rain and street dust every day.` },
      { type: "p", text: `Italian travertine is a smooth, creamy limestone plaster with horizontal veins and small pits, applied about ${travertine.specs.thickness} thick. It suits feature walls, staircases, foyers and entrance facades, and it works both inside and outside.` },
      { type: "h2", text: "Look and feel" },
      { type: "ul", items: [
        "Rockwall: deep relief you can feel, with a natural stone character that is forgiving of street dust and splashes.",
        "Travertine: a quieter, softer surface that reads as imported natural stone, with warm neutral tones that pair well with timber, glass and brass.",
      ] },
      { type: "h2", text: "Cost" },
      { type: "p", text: `Our turnkey rates are ${formatPKR(effectiveRate(rockwall))} per sq ft for Rockwall and ${formatPKR(effectiveRate(travertine))} per sq ft for Italian Travertine${hasOffer(travertine) ? " (current offer price)" : ""}, including material and master karigar labour. Across all our finishes the range is ${formatPKR(priceRange.min)} to ${formatPKR(priceRange.max)} per sq ft.` },
      { type: "h2", text: "Using both together" },
      { type: "p", text: "Many homes pair the two: a Rockwall base for weight and durability, with travertine bands or cantilevers for elegance. Our Villa 42 project in DHA Phase 6 combines a Rockwall charcoal finish with Italian travertine bands." },
      { type: "h2", text: "A simple rule of thumb" },
      { type: "ul", items: [
        "Boundary walls, gates and low walls that get abused: Rockwall.",
        "Statement walls people look at up close, inside or at the entrance: Travertine.",
        "A large elevation where you want both strength and refinement: combine them.",
      ] },
      { type: "callout", text: "Not sure? Book a free site visit. Our engineer brings sample boards of both so you can see them on your own wall, in your own light." },
    ],
  },
  {
    slug: "wall-texture-cost-lahore",
    title: "What Decides the Cost of Wall Texturing in Lahore?",
    description: "Finish, area, preparation and scaffolding all move the price. Here is how to understand and compare wall texturing quotes.",
    category: msg("Cost guide"),
    date: "2026-10-20",
    readMinutes: 4,
    cover: "/images/rw-dha-villa42.jpg",
    cta: "italian-travertine",
    body: [
      { type: "p", text: "Two quotes for the same wall can differ a lot. Knowing what goes into the price makes it easy to compare them fairly." },
      { type: "h2", text: "1. The finish you choose" },
      { type: "p", text: `Different finishes use different materials and take different amounts of craft. Our turnkey rates range from ${formatPKR(priceRange.min)} to ${formatPKR(priceRange.max)} per sq ft, covering material and labour.` },
      { type: "h2", text: "2. The real wall area" },
      { type: "p", text: "Price scales with surface area, so a good measurement matters. Guessing from the plot size can be far off: that is why we measure with a laser during the free site visit, and why you should be wary of quotes that do not state the square footage they are based on." },
      { type: "h2", text: "3. Preparation" },
      { type: "p", text: "Old paint, loose plaster, hairline cracks and dampness all need dealing with before any texture goes on. Skipping preparation is the most common reason finishes fail early, so a quote should say what preparation is included." },
      { type: "h2", text: "4. Access and scaffolding" },
      { type: "p", text: `Tall elevations need staging. In our calculator the scaffolding and safety staging add-on is ${formatPKR(ADDON_PRICES.scaffold)} and the deep primer with hydro-sealer is ${formatPKR(ADDON_PRICES.primer)}, shown separately so you can see exactly what you are paying for.` },
      { type: "h2", text: "How to read a quote" },
      { type: "ul", items: [
        "It states the area in sq ft and the rate per sq ft.",
        "Preparation, primer and sealing are listed, not hidden.",
        "Scaffolding or staging is a separate line when needed.",
        "Payment milestones are clear. Ours are 50% to mobilise, 30% mid-project and 20% on satisfied handover.",
        "The warranty is in writing.",
      ] },
      { type: "callout", text: "Want a number now? The calculator gives an instant estimate with a bill of materials, and the final price is confirmed after the free laser survey." },
    ],
  },
  {
    slug: "monsoon-proof-your-walls",
    title: "How to Protect Boundary Walls from Lahore's Monsoon",
    description: "Damp, white salt stains, black algae and hairline cracks: what causes them and what to do before and after you texture a wall.",
    category: msg("Care guide"),
    date: "2026-10-28",
    readMinutes: 4,
    cover: "/images/rw-bahria-wall.jpg",
    cta: "rockwall-aggregates",
    body: [
      { type: "p", text: "Lahore's monsoon is hard on exterior walls. Most of the damage people see afterwards comes from water finding a way in or getting trapped." },
      { type: "h2", text: "What the damage looks like" },
      { type: "ul", items: [
        "White powdery marks (efflorescence): salts carried out of the masonry by moisture.",
        "Black or green streaks: algae and fungus growing on damp surfaces.",
        "Blistering and peeling: moisture pushing coatings off from behind.",
        "Hairline cracks that open up and let more water in.",
      ] },
      { type: "h2", text: "Fix the cause first" },
      { type: "p", text: "A new finish over a wet or cracked wall will not last. Look for the source of dampness (a leaking pipe, poor drainage at the base, an unprotected wall top) and repair cracks before texturing." },
      { type: "h2", text: "Choose a system, not just a surface" },
      { type: "ul", items: [
        "A penetrating primer and hydro-sealer under the finish to resist moisture.",
        "A breathable finish so water vapour can leave the wall instead of blistering the coating.",
        "Flexible binders that bridge fine cracks as the wall moves with heat and rain.",
        "Proper expansion joints on long runs of wall.",
      ] },
      { type: "h2", text: "Keep it simple afterwards" },
      { type: "p", text: "Rinse dust off with a hose, check the wall top and corners after heavy rain, and have any new cracks sealed early. Our written warranty covers flaking, debonding and hollow spots, and our crew returns to re-trowel and seal affected sections." },
      { type: "callout", text: "Damp or cracks on your boundary wall? Our site engineer can check moisture levels with an electronic probe during the free site visit." },
    ],
  },
  {
    slug: "measure-your-walls-kanal-marla",
    title: "How to Estimate Your Wall Area (Marla and Kanal to Sq Ft)",
    description: "Plot size is not wall area. Here is a simple way to measure your walls and a worked cost example.",
    category: msg("How-to"),
    date: "2026-11-03",
    readMinutes: 3,
    cover: "/images/use-boundary.jpg",
    cta: "rockwall-aggregates",
    body: [
      { type: "p", text: "People often ask for a price per kanal or per marla, but those measure land. Wall texturing is priced on the wall surface, in sq ft." },
      { type: "h2", text: "Land versus wall" },
      { type: "p", text: `For quick estimates we treat 1 marla as ${UNIT_TO_SQFT.marla} sq ft. A typical 1-Kanal villa elevation works out to roughly 3,200 to 4,500 sq ft of wall, and a 10-marla house roughly 1,800 to 2,400 sq ft, depending on the design.` },
      { type: "h2", text: "Measure it yourself in three steps" },
      { type: "ul", items: [
        "Measure the length and the height of each wall in feet.",
        "Multiply length by height to get each wall's area, then add the walls together.",
        "Subtract very large openings (gates, big windows) if you want a closer number.",
      ] },
      { type: "h2", text: "A worked example" },
      { type: "p", text: `A boundary wall that is 120 ft long and 5 ft high is ${formatNumber(boundaryArea)} sq ft. At our Rockwall rate of ${formatPKR(effectiveRate(rockwall))} per sq ft that is ${formatPKR(boundaryArea * effectiveRate(rockwall))} before any scaffolding or primer add-ons.` },
      { type: "callout", text: "Use the calculator's 'measure by walls' option to add each wall separately and get the total automatically. We confirm the exact area with a laser survey before you pay anything." },
    ],
  },
];

export const getPost = (slug: string) => posts.find((p) => p.slug === slug);
export const latestPosts = (n = 3) => [...posts].sort((a, b) => b.date.localeCompare(a.date)).slice(0, n);
