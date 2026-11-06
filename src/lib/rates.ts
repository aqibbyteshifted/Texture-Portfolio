import type { Texture } from "@/types";

export const DEFAULT_WARRANTY_YEARS = 3;

/** The per-sq-ft rate a customer actually pays: the offer price when there is one, else the regular rate. */
export const effectiveRate = (t: Texture) => t.offerRate ?? t.rate;

export const hasOffer = (t: Texture) => t.offerRate !== undefined && t.offerRate < t.rate;

/** True when the price depends on the system chosen and is shown as "from X to Y". */
export const hasRange = (t: Texture) => t.rateMax !== undefined && t.rateMax > effectiveRate(t);

/** Highest rate a customer could be quoted (equals the effective rate unless the finish has a range). */
export const maxRate = (t: Texture) => (hasRange(t) ? (t.rateMax as number) : effectiveRate(t));

export const warrantyOf = (t: Texture) => t.warrantyYears ?? DEFAULT_WARRANTY_YEARS;

/** Plain-text price for places that cannot render markup (select options, WhatsApp messages). */
export function rateText(t: Texture) {
  return hasRange(t) ? `PKR ${effectiveRate(t)}–${t.rateMax}` : `PKR ${effectiveRate(t)}`;
}
