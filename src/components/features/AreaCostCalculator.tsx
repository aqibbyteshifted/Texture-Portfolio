"use client";

import { useId, useMemo, useState } from "react";
import { Hammer, Send } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { WhatsAppIcon } from "@/components/ui/icons";
import { formatNumber, formatPKR } from "@/lib/format";
import { quoteHref } from "@/lib/quoteLink";
import { waMessages, whatsappLink } from "@/lib/whatsapp";
import type { Texture } from "@/types";

const input =
  "h-11 w-full rounded-control border border-line-strong bg-surface px-3 text-sm font-semibold tnum focus:border-clay-500 focus:shadow-[0_0_0_3px_rgba(181,101,29,0.15)] focus:outline-none";

/** Wall length x height x rate calculator used on texture detail pages. */
export function AreaCostCalculator({ texture }: { texture: Texture }) {
  const uid = useId();
  const [length, setLength] = useState("120");
  const [height, setHeight] = useState("5");
  const [rate, setRate] = useState(String(texture.rate));

  const { area, total } = useMemo(() => {
    const l = Math.max(0, Number(length) || 0);
    const h = Math.max(0, Number(height) || 0);
    const r = Math.max(0, Number(rate) || 0);
    const a = Math.min(l * h, 200_000);
    return { area: a, total: a * r };
  }, [length, height, rate]);

  return (
    <section id="estimator" aria-labelledby={`${uid}-title`} className="rounded-2xl border border-line bg-surface p-5 shadow-lift sm:p-8">
      <div className="grid gap-8 lg:grid-cols-[1.3fr_1fr] lg:items-center">
        <div>
          <p className="text-xs font-semibold tracking-[0.14em] text-clay-500 uppercase">Instant Estimator</p>
          <h2 id={`${uid}-title`} className="mt-1 text-2xl font-bold sm:text-3xl">
            {texture.shortName} Area Cost Calculator
          </h2>
          <p className="mt-2 text-sm text-ink-soft">Estimate material &amp; master artisan application costs in Lahore.</p>

          <div className="mt-6 grid gap-4 sm:grid-cols-3">
            <div>
              <label htmlFor={`${uid}-l`} className="mb-1.5 block text-xs font-semibold text-ink-soft uppercase">Total Wall Length (ft)</label>
              <input id={`${uid}-l`} type="number" inputMode="decimal" min={0} value={length} onChange={(e) => setLength(e.target.value)} className={input} />
            </div>
            <div>
              <label htmlFor={`${uid}-h`} className="mb-1.5 block text-xs font-semibold text-ink-soft uppercase">Wall Height (ft)</label>
              <input id={`${uid}-h`} type="number" inputMode="decimal" min={0} value={height} onChange={(e) => setHeight(e.target.value)} className={input} />
            </div>
            <div>
              <label htmlFor={`${uid}-r`} className="mb-1.5 block text-xs font-semibold text-ink-soft uppercase">Rate (PKR / sq ft)</label>
              <input id={`${uid}-r`} type="number" inputMode="numeric" min={0} value={rate} onChange={(e) => setRate(e.target.value)} className={input} />
            </div>
          </div>

          <div className="mt-5 flex items-center gap-3 rounded-lg bg-sunken p-3.5 text-sm text-ink-soft">
            <Hammer aria-hidden="true" className="size-5 shrink-0 text-clay-500" />
            <span>
              <strong className="text-ink">Application Standard:</strong> Trowel Finish • {texture.specs.thickness}
            </span>
          </div>
        </div>

        <div className="rounded-xl border border-clay-300/50 bg-clay-50 p-5 text-center sm:p-6" aria-live="polite">
          <p className="text-xs font-bold tracking-wide text-clay-600 uppercase">Estimated Total (Material + Labor)</p>
          <p className="font-display mt-2 text-3xl font-extrabold text-clay-600 tnum sm:text-4xl" data-testid="area-total">
            {formatPKR(total)}
          </p>
          <p className="mt-1 text-sm text-ink-soft tnum">({formatNumber(area)} sq ft)</p>
          <Button
            href={quoteHref({ area, unit: "sqft", texture: texture.slug })}
            size="lg"
            className="mt-5 w-full"
            aria-disabled={area <= 0}
          >
            Book Site Measurement <Send aria-hidden="true" className="size-4" />
          </Button>
          <Button
            href={whatsappLink(waMessages.estimate(texture.name, Math.round(area), formatPKR(total)))}
            variant="whatsapp"
            className="mt-3 w-full"
          >
            <WhatsAppIcon className="size-4" /> WhatsApp Engineer
          </Button>
        </div>
      </div>
    </section>
  );
}
