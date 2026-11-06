"use client";

import { useId, useMemo, useState } from "react";
import { ArrowRight, Calculator } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { locationOptions } from "@/data/site";
import { textures } from "@/data/textures";
import { useT } from "@/i18n/client";
import { calculateEstimate, MAX_AREA_SQFT } from "@/lib/pricing";
import { formatPKR } from "@/lib/format";
import { quoteHref } from "@/lib/quoteLink";

const select =
  "h-11 w-full rounded-control border border-line-strong bg-surface px-3 text-sm text-ink focus:border-clay-500 focus:shadow-[0_0_0_3px_rgba(181,101,29,0.15)] focus:outline-none";

export function RapidEstimator() {
  const t = useT();
  const uid = useId();
  const [area, setArea] = useState("3000");
  const [slug, setSlug] = useState(textures[0].slug);
  const [location, setLocation] = useState<string>(locationOptions[0].value);

  const texture = textures.find((x) => x.slug === slug) ?? textures[0];
  const loc = locationOptions.find((l) => l.value === location) ?? locationOptions[0];
  const areaNum = Number(area);

  const estimate = useMemo(
    () => calculateEstimate({ area: areaNum, unit: "sqft", texture, surcharge: loc.surcharge }),
    [areaNum, texture, loc.surcharge],
  );

  return (
    <div className="rounded-xl border border-white/60 bg-surface p-5 text-ink shadow-modal sm:p-6">
      <p className="text-[11px] font-semibold tracking-[0.14em] text-clay-500 uppercase">{t("Rapid Estimator")}</p>
      <h2 className="mt-1 flex items-center gap-2 text-xl font-bold text-ink">
        <Calculator aria-hidden="true" className="size-5 text-clay-500" /> {t("Instant Estimate in 30s")}
      </h2>

      <div className="mt-5 grid gap-4">
        <div>
          <label htmlFor={`${uid}-area`} className="mb-1.5 block text-xs font-semibold text-ink-soft uppercase">
            {t("Surface Area (Sq. Ft)")}
          </label>
          <div className="relative">
            <input
              id={`${uid}-area`}
              inputMode="numeric"
              type="number"
              min={0}
              max={MAX_AREA_SQFT}
              value={area}
              onChange={(e) => setArea(e.target.value)}
              className={`${select} pe-16 font-semibold tnum`}
            />
            <span className="pointer-events-none absolute inset-y-0 end-3 grid place-items-center text-xs font-medium text-ink-muted">
              {t("SQ FT")}
            </span>
          </div>
        </div>

        <div>
          <label htmlFor={`${uid}-tex`} className="mb-1.5 block text-xs font-semibold text-ink-soft uppercase">
            {t("Preferred Texture Finish")}
          </label>
          <select id={`${uid}-tex`} value={slug} onChange={(e) => setSlug(e.target.value)} className={select}>
            {textures.map((x) => (
              <option key={x.slug} value={x.slug}>
                {t(x.name)} (PKR {x.rate}/{t("sqft")})
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor={`${uid}-loc`} className="mb-1.5 block text-xs font-semibold text-ink-soft uppercase">
            {t("Site Location in Lahore")}
          </label>
          <select id={`${uid}-loc`} value={location} onChange={(e) => setLocation(e.target.value)} className={select}>
            {locationOptions.map((l) => (
              <option key={l.value} value={l.value}>
                {t(l.label)}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="mt-5 rounded-lg bg-clay-50 p-4" aria-live="polite">
        <p className="text-xs font-semibold text-ink-soft uppercase">{t("Est. Project Total:")}</p>
        <p className="font-display mt-1 text-3xl font-extrabold text-clay-600 tnum">{formatPKR(estimate.total)}</p>
        {loc.surcharge > 0 && (
          <p className="mt-1 text-xs text-ink-muted">{t("Includes {pct}% outstation logistics.", { pct: Math.round(loc.surcharge * 100) })}</p>
        )}
      </div>

      <Button
        href={quoteHref({ area: areaNum, unit: "sqft", texture: slug, location })}
        size="lg"
        className="mt-4 w-full"
      >
        {t("Customize Full Quote with Labour")} <ArrowRight aria-hidden="true" className="size-4 rtl:-scale-x-100" />
      </Button>
      <p className="mt-3 text-center text-[11px] leading-snug text-ink-muted">
        {t("*Turnkey calculation includes primer, mesh, base coats, and skilled artisan labour.")}
      </p>
    </div>
  );
}
