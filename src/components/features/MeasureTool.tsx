"use client";

import { useState } from "react";
import { ArrowRight } from "lucide-react";
import { WallMeasurer } from "@/components/features/WallMeasurer";
import { Button } from "@/components/ui/Button";
import { WhatsAppIcon } from "@/components/ui/icons";
import { useT } from "@/i18n/client";
import { formatNumber } from "@/lib/format";
import { UNIT_TO_SQFT, type AreaUnit } from "@/lib/pricing";
import { quoteHref } from "@/lib/quoteLink";
import { whatsappLink } from "@/lib/whatsapp";

const units: { id: AreaUnit; label: string }[] = [
  { id: "sqft", label: "Sq ft" },
  { id: "marla", label: "Marla" },
  { id: "sqm", label: "Sq m" },
];

/** Wall-by-wall measurer plus a unit converter (sq ft, marla, sq m). */
export function MeasureTool() {
  const t = useT();
  const [sqft, setSqft] = useState(0);
  const [value, setValue] = useState("");
  const [unit, setUnit] = useState<AreaUnit>("sqft");

  const converted = (Number(value) || 0) * UNIT_TO_SQFT[unit];

  return (
    <div className="grid gap-8 lg:grid-cols-2">
      <section className="rounded-2xl border border-line bg-surface p-5 shadow-card sm:p-7">
        <h2 className="text-lg font-bold">{t("Add up your walls")}</h2>
        <p className="mt-1 text-sm text-ink-soft">{t("Enter each wall's length and height. We total them and send the area to your quote.")}</p>
        <WallMeasurer onApply={setSqft} />
        {sqft > 0 && (
          <div className="mt-5 rounded-xl bg-brand-50 p-4" aria-live="polite">
            <p className="text-xs font-semibold text-ink-soft uppercase">{t("Total area")}</p>
            <p className="font-display text-3xl font-extrabold text-brand-600 tnum">{formatNumber(sqft)} {t("sq ft")}</p>
            <p className="text-xs text-ink-muted">≈ {(sqft / UNIT_TO_SQFT.marla).toFixed(1)} {t("Marla")} · {(sqft / UNIT_TO_SQFT.sqm).toFixed(1)} {t("Sq m")}</p>
            <div className="mt-4 grid gap-2 sm:grid-cols-2">
              <Button href={quoteHref({ area: sqft, unit: "sqft" })} size="md">
                {t("Get a quote for this area")} <ArrowRight aria-hidden="true" className="size-4 rtl:-scale-x-100" />
              </Button>
              <Button href={whatsappLink(`Salam Zain & Co, my wall area is about ${Math.round(sqft)} sq ft. Please advise on finishes and a quote.`)} variant="whatsapp" size="md">
                <WhatsAppIcon className="size-4" /> {t("Send on WhatsApp")}
              </Button>
            </div>
          </div>
        )}
      </section>

      <section className="rounded-2xl border border-line bg-surface p-5 shadow-card sm:p-7">
        <h2 className="text-lg font-bold">{t("Unit converter")}</h2>
        <p className="mt-1 text-sm text-ink-soft">{t("We use 1 marla = 225 sq ft for wall estimates.")}</p>
        <div className="mt-4 flex gap-2">
          <input
            type="number"
            inputMode="decimal"
            min={0}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            aria-label={t("Area")}
            className="h-11 min-w-0 flex-1 rounded-control border border-line-strong bg-surface px-3 text-sm font-semibold text-ink tnum focus:border-brand-500 focus:outline-none"
          />
          <select value={unit} onChange={(e) => setUnit(e.target.value as AreaUnit)} aria-label={t("Unit")} className="h-11 rounded-control border border-line-strong bg-surface px-3 text-sm text-ink focus:border-brand-500 focus:outline-none">
            {units.map((u) => (
              <option key={u.id} value={u.id}>{t(u.label)}</option>
            ))}
          </select>
        </div>
        <dl className="mt-5 grid grid-cols-3 gap-3 text-center">
          {units.map((u) => (
            <div key={u.id} className="rounded-xl bg-sunken p-3">
              <dt className="text-[11px] font-semibold text-ink-muted uppercase">{t(u.label)}</dt>
              <dd className="mt-1 text-base font-bold text-ink tnum">{converted > 0 ? (converted / UNIT_TO_SQFT[u.id]).toLocaleString("en-PK", { maximumFractionDigits: 1 }) : "0"}</dd>
            </div>
          ))}
        </dl>
      </section>
    </div>
  );
}
