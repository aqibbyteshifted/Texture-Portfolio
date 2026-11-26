import type { AreaUnit } from "@/lib/pricing";

interface QuoteLinkParams {
  area?: number;
  unit?: AreaUnit;
  texture?: string;
  zone?: "exterior" | "interior";
  location?: string;
  /** Shade code from the shade picker, e.g. "TR-02" */
  shade?: string;
  /** Free text for the engineer (e.g. a whole-house breakdown). Trimmed to 900 characters. */
  notes?: string;
}

/** Builds a /quote URL that prefills the quote wizard. */
export function quoteHref(params: QuoteLinkParams = {}) {
  const qs = new URLSearchParams();
  if (params.area && params.area > 0) qs.set("area", String(Math.round(params.area)));
  if (params.unit) qs.set("unit", params.unit);
  if (params.texture) qs.set("texture", params.texture);
  if (params.zone) qs.set("zone", params.zone);
  if (params.location) qs.set("loc", params.location);
  if (params.shade) qs.set("shade", params.shade);
  if (params.notes) qs.set("notes", params.notes.slice(0, 900));
  const query = qs.toString();
  return query ? `/quote?${query}` : "/quote";
}
