import { msg } from "@/i18n/config";
export const site = {
  name: "Zain & Co",
  group: "Zain & Co Group",
  tagline: "Architectural Finishes • Lahore",
  description:
    "Lahore's premier architectural surface finishing contractor: rockwall, travertine, stucco, microcement, limewash, terrazzo, epoxy flooring and exterior monolithic facades with a 3-year written warranty.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.zainandco.pk",
  phone: "+92 300 8472190",
  phoneRaw: "923008472190",
  email: "info@zainandco.pk",
  hours: "Mon-Sat 9:00 AM - 7:00 PM",
  address: "Plot 18-C, Commercial Broadway, DHA Phase 5, Lahore, Pakistan",
  addressShort: "Main Boulevard, Phase 6 DHA, Lahore, Punjab, Pakistan",
  pec: "PEC-FIN-7481",
  studio: {
    name: "Zain & Co Surface Gallery",
    address: "Main Commercial Boulevard, Sector CCA, Phase 5 DHA, Lahore",
    hours: "Open Mon–Sat • 9:00 AM – 7:00 PM",
  },
  geo: { lat: 31.4697, lng: 74.3979 },
  /** Opening hours in Asia/Karachi time. Day 0 = Sunday. Sunday is closed. */
  hoursSchedule: { timeZone: "Asia/Karachi", openDays: [1, 2, 3, 4, 5, 6], opens: "09:00", closes: "19:00" },
  /**
   * Shown in the reviews badge when live Google data is not configured. Replace with your real figures,
   * or set GOOGLE_PLACES_API_KEY + GOOGLE_PLACE_ID to pull them live (see README).
   */
  google: {
    rating: 4.9,
    count: 120,
    url: process.env.NEXT_PUBLIC_GOOGLE_REVIEWS_URL ?? "",
  },
  /**
   * Thin banner above the header. Change `id` whenever you change the message so visitors who dismissed the
   * old one see the new one. Set `enabled: false` to hide it.
   */
  announcement: {
    enabled: true,
    id: "free-sample-board-v1",
    text: msg("Free 1×1 ft sample board with every site visit in Lahore"),
    cta: msg("Book a visit"),
    href: "/quote",
  },
  /** Used by the map embed and directions link */
  mapQuery: process.env.NEXT_PUBLIC_MAPS_QUERY ?? "Plot 18-C, Commercial Broadway, DHA Phase 5, Lahore, Pakistan",
  stats: [
    { value: "500+", label: "Walls Finished", icon: "badge" },
    { value: "10+ Yrs", label: "Master Craft", icon: "award" },
    { value: "Free", label: "Site Visit Lahore", icon: "pin" },
    { value: "3-Year", label: "Warranty Invoiced", icon: "shield" },
  ],
} as const;

export const navLinks = [
  { label: "Home", href: "/" },
  { label: "Textures", href: "/textures" },
  { label: "Visualizer", href: "/visualizer" },
  { label: "Compare", href: "/compare" },
  { label: "Estimate", href: "/#estimate" },
  { label: "Our Work", href: "/#work" },
  { label: "Guides", href: "/blog" },
  { label: "Contact", href: "/#contact" },
] as const;

export const coverageAreas = [
  "DHA Lahore (Phases 1-9 & Prism)",
  "Bahria Town & Bahria Orchard",
  "Gulberg & MM Alam Commercial",
  "Model Town & Garden Town",
  "Johar Town & Lake City",
  "WAPDA Town & Valencia",
] as const;

export const locationOptions = [
  { value: "dha", label: "DHA Lahore (Phase 1 to 9 & Prism)", surcharge: 0 },
  { value: "bahria", label: "Bahria Town / Sector C, D, E", surcharge: 0 },
  { value: "gulberg", label: "Gulberg & MM Alam Area", surcharge: 0 },
  { value: "model", label: "Model Town / Garden Town", surcharge: 0 },
  { value: "johar", label: "Johar Town / Lake City / WAPDA Town", surcharge: 0 },
  { value: "punjab", label: "Other Punjab City (Islamabad/Faisalabad)", surcharge: 0.08 },
] as const;

export const processSteps = [
  {
    step: 1,
    title: "Send Your Request",
    description:
      "Submit your square footage estimate or share your architectural elevations directly over WhatsApp to our engineering team.",
    meta: "Response within 15 minutes",
    icon: "send",
  },
  {
    step: 2,
    title: "Site Audit & Physical Samples",
    description:
      "Lead supervisor visits your location in Lahore with physical 1x1 ft sample boards of rockwall, travertine, and microcement to test under your lighting.",
    meta: "100% Free of Cost",
    icon: "clipboard",
  },
  {
    step: 3,
    title: "Exact Quote & Agreement",
    description:
      "Sign off on clear per-square-foot rates. Transparent milestone payments: 50% mobilization advance, 30% mid-project, and 20% on satisfied handover.",
    meta: "Fixed price guarantee",
    icon: "file",
  },
  {
    step: 4,
    title: "Texture Craft & Handover",
    description:
      "Our karigars execute primer preparation, mesh reinforcement, aggregate texturing, hydro-sealing, and site cleanup followed by warranty certificate issuance.",
    meta: "3-Year Written Warranty",
    icon: "hammer",
  },
] as const;

export const whyUs = [
  {
    icon: "ruler",
    title: "Free Laser Measurement",
    description:
      "Our field supervisor arrives at your DHA, Bahria, or Gulberg site within 24 hours with precision digital laser equipment to give an exact sq ft reading.",
  },
  {
    icon: "hammer",
    title: "Skilled Karigar Masters",
    description:
      "Hand-troweled finishing performed strictly by seasoned craftsmen with 10+ years of masonry experience. No raw day-laborers on your finished walls.",
  },
  {
    icon: "droplets",
    title: "Imported UV & Anti-Fungal Polymers",
    description:
      "Proprietary acrylic copolymer binders engineered to resist fungal blackening caused by Lahore's monsoon downpours and canal-side humidity.",
  },
  {
    icon: "clock",
    title: "Guaranteed On-Time Handover",
    description:
      "Strict project milestone timelines backed by daily site supervisor updates via WhatsApp photos, ensuring adherence to your move-in schedule.",
  },
  {
    icon: "shield",
    title: "3-Year Written Warranty",
    description:
      "Every project receives an official stamped warranty card covering peeling, debonding, or cracking with complimentary annual touch-up audits.",
  },
  {
    icon: "receipt",
    title: "Transparent Itemized Pricing",
    description:
      "Zero surprise charges. Complete itemization of square footage, mesh reinforcing, base sealers, scaffolding hire, and karigar labor upfront.",
  },
] as const;
