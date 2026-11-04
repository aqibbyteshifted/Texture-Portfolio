export type TextureZone = "exterior" | "interior";
export type TextureCategory =
  | "Rockwall"
  | "Stucco"
  | "Graffiato"
  | "Wash Terrazzo"
  | "Travertine"
  | "Nugdi"
  | "Velvet Paint"
  | "Limewash"
  | "Microcement"
  | "Epoxy Flooring";

/** Decides which bill-of-material template the estimate shows. */
export type TextureSystem = "plaster" | "paint" | "floor";

export interface TextureSpecMetric {
  icon: "sun" | "droplets" | "sliders" | "sparkles";
  title: string;
  description: string;
  label: string;
  value: string;
}

export interface TextureUseArea {
  tag: string;
  title: string;
  description: string;
  cta: string;
  /** Omit until a photo exists; a generated texture placeholder is shown instead. */
  image?: string;
}

export interface Texture {
  slug: string;
  name: string;
  shortName: string;
  category: TextureCategory;
  system: TextureSystem;
  zones: TextureZone[];
  /** PKR per sq ft, turnkey (material + master karigar labour) */
  rate: number;
  /** sq ft covered by one bag of base compound, used by the bill-of-material estimate */
  coveragePerBag: number;
  badge: string;
  feature: string;
  blurb: string;
  summary: string;
  tagline: string;
  description: string;
  highlights: string[];
  /** Optional until a photo exists; set to e.g. "/images/tex-limewash.jpg" once you add one. */
  image?: string;
  gallery: { src: string; label: string }[];
  useAreasIntro: string;
  specs: { zone: string; thickness: string; tactility: string; curing: string };
  rating: number;
  villas: number;
  specRef: string;
  performance: TextureSpecMetric[];
  useAreas: TextureUseArea[];
  swatch: string;
}

export interface Project {
  id: string;
  title: string;
  location: string;
  sector: "DHA Lahore" | "Bahria Town" | "Gulberg" | "Johar Town" | "Model Town" | "WAPDA Town" | "Lake City";
  type: string;
  scope: string;
  completed: string;
  description: string;
  textures: string[];
  image: string;
  badge?: string;
}

export interface Testimonial {
  id: string;
  quote: string;
  name: string;
  meta: string;
  rating: number;
}

export interface Faq {
  id: string;
  question: string;
  answer: string;
}

export interface LeadRecord {
  ref: string;
  type: "quote" | "visit" | "message";
  name: string;
  phone: string;
  email?: string;
  area?: string;
  texture?: string;
  scope?: string;
  areaSqft?: number;
  estimate?: number;
  date?: string;
  window?: string;
  message?: string;
  createdAt: string;
}
