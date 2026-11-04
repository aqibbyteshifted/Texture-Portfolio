import type { Texture } from "@/types";

export type AreaUnit = "sqft" | "marla" | "sqm";

/** 1 unit expressed in square feet (1 marla = 225 sq ft as used by Zain & Co) */
export const UNIT_TO_SQFT: Record<AreaUnit, number> = {
  sqft: 1,
  marla: 225,
  sqm: 10.764,
};

export const UNIT_LABEL: Record<AreaUnit, string> = {
  sqft: "Sq Ft",
  marla: "Marla (Wall Est.)",
  sqm: "Sq Meters",
};

export const ADDON_PRICES = {
  scaffold: 45_000,
  primer: 35_000,
} as const;

export const RANGE_LOW = 0.94;
export const RANGE_HIGH = 1.06;
export const MAX_AREA_SQFT = 200_000;

export interface EstimateInput {
  area: number;
  unit: AreaUnit;
  texture: Texture;
  scaffold?: boolean;
  primer?: boolean;
  /** Fractional logistics surcharge, e.g. 0.08 for projects outside Lahore */
  surcharge?: number;
}

export interface Estimate {
  sqft: number;
  base: number;
  scaffold: number;
  primer: number;
  logistics: number;
  total: number;
  low: number;
  high: number;
  /** Human-readable bill-of-material line for this texture's application system */
  bomText: string;
}

export function toSqft(area: number, unit: AreaUnit) {
  if (!Number.isFinite(area) || area <= 0) return 0;
  return Math.min(area * UNIT_TO_SQFT[unit], MAX_AREA_SQFT);
}

const roundTo = (n: number, step: number) => Math.round(n / step) * step;

export function calculateEstimate({
  area,
  unit,
  texture,
  scaffold = false,
  primer = false,
  surcharge = 0,
}: EstimateInput): Estimate {
  const sqft = toSqft(area, unit);
  const base = Math.round(sqft * texture.rate);
  const scaffoldCost = scaffold && sqft > 0 ? ADDON_PRICES.scaffold : 0;
  const primerCost = primer && sqft > 0 ? ADDON_PRICES.primer : 0;
  const logistics = Math.round((base + scaffoldCost + primerCost) * surcharge);
  const total = base + scaffoldCost + primerCost + logistics;

  return {
    sqft: Math.round(sqft),
    base,
    scaffold: scaffoldCost,
    primer: primerCost,
    logistics,
    total,
    low: roundTo(total * RANGE_LOW, 1000),
    high: roundTo(total * RANGE_HIGH, 1000),
    bomText: describeBom(texture, sqft),
  };
}

function describeBom(texture: Texture, sqft: number) {
  if (sqft <= 0) return "";
  const units = Math.ceil(sqft / texture.coveragePerBag);
  const per = (coverage: number) => Math.ceil(sqft / coverage);

  switch (texture.system) {
    case "paint":
      return `~ ${units} Buckets ${texture.shortName} (2–3 coats), ${per(500)} Buckets Wall Primer, ${per(90)} Bags Skim-Coat Putty.`;
    case "floor":
      return `~ ${units} Kits ${texture.shortName} resin + hardener, ${per(400)} Buckets Epoxy Primer, ${per(500)} Buckets Protective Top Coat.`;
    default:
      return `~ ${units} Bags ${texture.shortName} compound, ${per(500)} Buckets Deep Primer, ${per(900)} Buckets Hydrophobic Sealer, ${per(900)} Rolls High-Tensile Alkali Mesh (100m).`;
  }
}
