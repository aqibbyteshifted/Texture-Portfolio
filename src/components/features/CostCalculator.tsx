"use client";

import { useEffect, useId, useMemo, useRef, useState } from "react";
import { ArrowRight, Armchair, Check, FileDown, Package, Building2, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { WallMeasurer } from "@/components/features/WallMeasurer";
import { WhatsAppIcon } from "@/components/ui/icons";
import { textures } from "@/data/textures";
import { useT } from "@/i18n/client";
import { track } from "@/lib/analytics";
import { downloadEstimatePdf } from "@/lib/estimatePdf";
import {
  ADDON_PRICES,
  calculateEstimate,
  MAX_AREA_SQFT,
  toSqft,
  UNIT_TO_SQFT,
  type AreaUnit,
} from "@/lib/pricing";
import { formatNumber, formatPKR } from "@/lib/format";
import { quoteHref } from "@/lib/quoteLink";
import { waMessages, whatsappLink } from "@/lib/whatsapp";
import { cn } from "@/lib/cn";
import type { TextureZone } from "@/types";
import { msg } from "@/i18n/config";

const units: AreaUnit[] = ["sqft", "marla", "sqm"];
const unitButton: Record<AreaUnit, string> = { sqft: msg("Sq Ft"), marla: msg("Marla"), sqm: msg("Sq M") };
const unitSuffix: Record<AreaUnit, string> = { sqft: msg("sq ft"), marla: msg("marla"), sqm: msg("m²") };

const hints: Record<TextureZone, string> = {
  exterior: msg("Typical 1-Kanal Elevation: ~3,200 - 4,500 sq ft"),
  interior: msg("Typical 5 Marla feature wall + lounge: ~900 - 1,400 sq ft"),
};

export function CostCalculator() {
  const t = useT();
  const uid = useId();
  const [area, setArea] = useState("3500");
  const [unit, setUnit] = useState<AreaUnit>("sqft");
  const [zone, setZone] = useState<TextureZone>("exterior");
  const [slug, setSlug] = useState("italian-travertine");
  const [scaffold, setScaffold] = useState(true);
  const [primer, setPrimer] = useState(true);

  const available = useMemo(() => textures.filter((x) => x.zones.includes(zone)), [zone]);
  const texture = available.find((x) => x.slug === slug) ?? available[0];

  // sq ft is the source of truth; the input only displays it in the chosen unit,
  // so switching units never introduces rounding drift into the price.
  const [sqftValue, setSqftValue] = useState(3500);
  const estimate = useMemo(
    () => calculateEstimate({ area: sqftValue, unit: "sqft", texture, scaffold: zone === "exterior" && scaffold, primer }),
    [sqftValue, texture, scaffold, primer, zone],
  );

  const onAreaChange = (value: string) => {
    setArea(value);
    setSqftValue(toSqft(Number(value), unit));
  };

  const changeUnit = (next: AreaUnit) => {
    if (sqftValue > 0) setArea(String(Math.round((sqftValue / UNIT_TO_SQFT[next]) * 100) / 100));
    setUnit(next);
  };

  const applyMeasured = (sqft: number) => {
    setUnit("sqft");
    setArea(String(Math.round(sqft)));
    setSqftValue(toSqft(sqft, "sqft"));
  };

  // one analytics event per visit once the visitor actually changes the inputs (debounced)
  const firstRender = useRef(true);
  const tracked = useRef(false);
  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }
    if (tracked.current || estimate.total <= 0) return;
    const id = setTimeout(() => {
      tracked.current = true;
      track("calculator_estimate", { texture: texture.name, area_sqft: estimate.sqft, total: estimate.total });
    }, 1500);
    return () => clearTimeout(id);
  }, [estimate.total, estimate.sqft, texture.name]);

  const [pdfBusy, setPdfBusy] = useState(false);
  const downloadPdf = async () => {
    setPdfBusy(true);
    try {
      await downloadEstimatePdf({ textureName: texture.name, rate: texture.rate, zone, estimate });
      track("estimate_pdf_download", { texture: texture.name, total: estimate.total });
    } finally {
      setPdfBusy(false);
    }
  };

  const hasArea = estimate.sqft > 0;
  const sqftHint = unit !== "sqft" && hasArea ? `≈ ${formatNumber(estimate.sqft)} ${t("sq ft")}` : null;

  return (
    <div className="grid overflow-hidden rounded-2xl border border-line bg-surface shadow-lift lg:grid-cols-[1.25fr_1fr]">
      <div className="grid gap-7 p-5 sm:p-8">
        {/* Area */}
        <div>
          <label htmlFor={`${uid}-area`} className="text-sm font-bold text-ink">
            {t("Total Wall Surface Area")}
          </label>
          <div className="mt-3 flex flex-col gap-3 sm:flex-row">
            <div className="relative flex-1">
              <input
                id={`${uid}-area`}
                type="number"
                inputMode="decimal"
                min={0}
                max={MAX_AREA_SQFT}
                value={area}
                onChange={(e) => onAreaChange(e.target.value)}
                className="h-13 w-full rounded-control border border-line-strong bg-surface ps-4 pe-20 text-lg font-bold text-ink tnum focus:border-clay-500 focus:shadow-[0_0_0_3px_rgba(181,101,29,0.15)] focus:outline-none"
              />
              <span className="pointer-events-none absolute inset-y-0 end-4 grid place-items-center text-sm text-ink-muted">
                {t(unitSuffix[unit])}
              </span>
            </div>
            <div role="group" aria-label={t("Area unit")} className="grid grid-cols-3 rounded-control bg-sunken p-1">
              {units.map((u) => (
                <button
                  key={u}
                  type="button"
                  aria-pressed={unit === u}
                  onClick={() => changeUnit(u)}
                  className={cn(
                    "rounded-md px-3 text-xs font-semibold whitespace-nowrap text-ink-soft transition-colors sm:h-11",
                    "h-10",
                    unit === u && "bg-surface text-clay-600 shadow-sm",
                  )}
                >
                  {t(unitButton[u])}
                </button>
              ))}
            </div>
          </div>
          <p className="mt-2 text-xs text-ink-muted">
            {t(hints[zone])}
            {sqftHint && <span className="ms-2 font-semibold text-clay-600">{sqftHint}</span>}
          </p>
          <WallMeasurer onApply={applyMeasured} />
        </div>

        {/* Environment */}
        <fieldset>
          <legend className="text-sm font-bold text-ink">{t("Application Environment")}</legend>
          <div className="mt-3 grid grid-cols-2 gap-3">
            {(
              [
                { value: "exterior", label: msg("Exterior Facade / Elevation"), Icon: Building2 },
                { value: "interior", label: msg("Interior Accent / Rooms"), Icon: Armchair },
              ] as const
            ).map(({ value, label, Icon }) => (
              <button
                key={value}
                type="button"
                aria-pressed={zone === value}
                onClick={() => setZone(value)}
                className={cn(
                  "flex min-h-14 items-center gap-3 rounded-lg border p-3 text-start text-sm font-semibold transition-colors",
                  zone === value
                    ? "border-clay-500 bg-clay-50 text-clay-600 ring-1 ring-clay-500"
                    : "border-line-strong bg-surface text-ink hover:bg-canvas",
                )}
              >
                <Icon aria-hidden="true" className="size-5 shrink-0" />
                {t(label)}
              </button>
            ))}
          </div>
        </fieldset>

        {/* Finish */}
        <fieldset>
          <legend className="text-sm font-bold text-ink">{t("Select Finish Specification")}</legend>
          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            {available.map((x) => {
              const selected = x.slug === texture.slug;
              return (
                <button
                  key={x.slug}
                  type="button"
                  aria-pressed={selected}
                  onClick={() => setSlug(x.slug)}
                  className={cn(
                    "flex items-center gap-3 rounded-lg border p-3 text-start transition-colors",
                    selected ? "border-clay-500 bg-clay-50 ring-1 ring-clay-500" : "border-line-strong hover:bg-canvas",
                  )}
                >
                  <span className="size-10 shrink-0 rounded-md border border-black/5" style={{ background: x.swatch }} aria-hidden="true" />
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-sm font-semibold text-ink">{t(x.name)}</span>
                    <span className="block truncate text-xs text-ink-muted">{t(x.summary)}</span>
                  </span>
                  <span className="text-end">
                    <span className="block text-sm font-bold text-clay-600 tnum">PKR {x.rate}</span>
                    <span className="block text-[10px] text-ink-muted">/ {t("sq ft")}</span>
                  </span>
                </button>
              );
            })}
          </div>
        </fieldset>

        {/* Add-ons */}
        <fieldset>
          <legend className="text-sm font-bold text-ink">{t("Preparation & Site Logistics")}</legend>
          <div className="mt-3 grid gap-3">
            {zone === "exterior" && (
              <AddOn
                checked={scaffold}
                onChange={setScaffold}
                title={t("Steel Scaffolding & Safety Staging")}
                text={t("Includes double-height staging and DHA safety barriers")}
                price={`+${formatPKR(ADDON_PRICES.scaffold)}`}
              />
            )}
            <AddOn
              checked={primer}
              onChange={setPrimer}
              title={t("Deep Penetrating Primer & Hydro-Sealer")}
              text={t("Moisture block treatment protecting against wall dampness")}
              price={`+${formatPKR(ADDON_PRICES.primer)}`}
            />
            <div className="flex items-center justify-between gap-3 rounded-lg border border-dashed border-line-strong bg-canvas p-3.5">
              <div>
                <p className="text-sm font-semibold text-ink">{t("Turnkey Materials & Trowel Labor")}</p>
                <p className="text-xs text-ink-muted">{t("Imported binders, marble chips, and senior karigar compensation")}</p>
              </div>
              <span className="shrink-0 text-sm font-bold text-emerald-600">{t("Included")}</span>
            </div>
          </div>
        </fieldset>
      </div>

      {/* Result */}
      <div className="flex flex-col bg-ink p-5 text-white sm:p-8">
        <p className="text-xs font-semibold tracking-[0.14em] text-sand-500 uppercase">{t("Estimated Project Investment")}</p>
        <p
          className="font-display mt-2 text-4xl font-extrabold tracking-tight tnum sm:text-5xl"
          aria-live="polite"
          data-testid="calc-total"
          dir="ltr"
        >
          {formatPKR(estimate.total)}
        </p>
        <p className="mt-2 text-sm text-white/60 tnum">
          {hasArea
            ? t("Estimated Range: {low} - {high}", { low: formatPKR(estimate.low), high: formatPKR(estimate.high) })
            : t("Enter your wall area to begin")}
        </p>

        <dl className="mt-6 grid gap-3 border-t border-white/10 pt-5 text-sm">
          <Row label={t("Architectural Texture Plaster:")} value={formatPKR(estimate.base)} />
          {estimate.primer > 0 && <Row label={t("Base Primer & Hydro-Sealers:")} value={formatPKR(estimate.primer)} />}
          {estimate.scaffold > 0 && <Row label={t("Scaffolding Rigging & Safety:")} value={formatPKR(estimate.scaffold)} />}
          <Row label={t("Master Karigar Supervision:")} value={t("Free Inspection Included")} accent />
        </dl>

        <div className="mt-5 rounded-lg bg-white/5 p-4 text-xs leading-relaxed text-white/70">
          <p className="flex items-center gap-2 font-semibold text-white">
            <Package aria-hidden="true" className="size-4 text-sand-500" /> {t("Bill of Material Estimation:")}
          </p>
          <p className="mt-2 tnum" lang="en" dir="ltr">
            {hasArea ? estimate.bomText : t("Material quantities appear once you enter an area.")}
          </p>
        </div>
        <p className="mt-3 text-[11px] leading-snug text-white/50">
          {t("*Final price confirmed after complimentary on-site laser survey and surface moisture check in Lahore.")}
        </p>

        <div className="mt-6 grid gap-3">
          <Button
            href={quoteHref({ area: estimate.sqft, unit: "sqft", texture: texture.slug, zone })}
            size="lg"
            className={cn(!hasArea && "pointer-events-none opacity-50")}
          >
            {t("Get Exact Quote / Book Visit")} <ArrowRight aria-hidden="true" className="size-4 rtl:-scale-x-100" />
          </Button>
          <Button
            href={whatsappLink(waMessages.estimate(texture.name, estimate.sqft, formatPKR(estimate.total)))}
            variant="whatsapp"
            size="lg"
            className={cn(!hasArea && "pointer-events-none opacity-50")}
          >
            <WhatsAppIcon className="size-5" /> {t("Send Estimate on WhatsApp")}
          </Button>
          <Button variant="secondary" size="lg" disabled={!hasArea || pdfBusy} onClick={downloadPdf}>
            <FileDown aria-hidden="true" className="size-5" /> {pdfBusy ? t("Preparing PDF…") : t("Download estimate (PDF)")}
          </Button>
        </div>

        <div className="mt-auto flex gap-3 pt-6 text-xs text-white/70">
          <ShieldCheck aria-hidden="true" className="mt-0.5 size-5 shrink-0 text-sand-500" />
          <p>
            <strong className="block text-sm text-white">{t("3-Year Written Warranty")}</strong>
            {t("Covers against flaking, micro-cracking, and monsoon weather discoloration.")}
          </p>
        </div>
      </div>
    </div>
  );
}

function AddOn({
  checked,
  onChange,
  title,
  text,
  price,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
  title: string;
  text: string;
  price: string;
}) {
  return (
    <label
      className={cn(
        "flex cursor-pointer items-center gap-3 rounded-lg border p-3.5 transition-colors",
        checked ? "border-clay-500 bg-clay-50" : "border-line-strong hover:bg-canvas",
      )}
    >
      <input type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} className="peer sr-only" />
      <span
        aria-hidden="true"
        className="grid size-5 shrink-0 place-items-center rounded border border-line-strong bg-surface text-white peer-checked:border-clay-500 peer-checked:bg-clay-500 peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-sand-500"
      >
        {checked && <Check className="size-3.5" strokeWidth={3} />}
      </span>
      <span className="min-w-0 flex-1">
        <span className="block text-sm font-semibold text-ink">{title}</span>
        <span className="block text-xs text-ink-muted">{text}</span>
      </span>
      <span className="shrink-0 text-sm font-bold text-clay-600 tnum" dir="ltr">{price}</span>
    </label>
  );
}

function Row({ label, value, accent }: { label: string; value: string; accent?: boolean }) {
  return (
    <div className="flex items-baseline justify-between gap-4">
      <dt className="text-white/60">{label}</dt>
      <dd className={cn("text-end font-semibold tnum", accent && "text-emerald-400")}>{value}</dd>
    </div>
  );
}
