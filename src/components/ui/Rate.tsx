"use client";

import { useT } from "@/i18n/client";
import { effectiveRate, hasOffer, hasRange } from "@/lib/rates";
import { cn } from "@/lib/cn";
import type { Texture } from "@/types";

/**
 * A finish's price per sq ft: the offer price with the regular price struck through, or a "from – to" range
 * when the rate depends on the system (epoxy). Always rendered left-to-right so numbers read correctly in Urdu.
 */
export function Rate({ texture, badge = false, className }: { texture: Texture; badge?: boolean; className?: string }) {
  const t = useT();
  const price = hasRange(texture) ? `PKR ${effectiveRate(texture)} – ${texture.rateMax}` : `PKR ${effectiveRate(texture)}`;
  const offer = hasOffer(texture);

  return (
    <span dir="ltr" className={cn("inline-flex flex-wrap items-baseline gap-x-1.5 tnum", className)}>
      {offer && (
        <s className="font-normal text-ink-muted" aria-label={t("Regular price PKR {n}", { n: texture.rate })}>
          PKR {texture.rate}
        </s>
      )}
      <strong>{price}</strong>
      <span className="font-normal text-ink-muted">/ {t("sq ft")}</span>
      {badge && offer && (
        <span className="self-center rounded bg-emerald-50 px-1.5 py-0.5 text-[10px] font-bold tracking-wide text-emerald-700 uppercase">{t("Offer")}</span>
      )}
    </span>
  );
}
