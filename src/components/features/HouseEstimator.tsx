"use client";

import { useEffect, useId, useMemo, useState } from "react";
import { ArrowRight, Plus, Printer, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { WhatsAppIcon } from "@/components/ui/icons";
import { cities, getCity } from "@/data/cities";
import { houseGroups, houseLayouts, OPENING_SQFT, type OpeningKind } from "@/data/house";
import { locationOptions } from "@/data/site";
import { textures } from "@/data/textures";
import { useT } from "@/i18n/client";
import { cn } from "@/lib/cn";
import { formatNumber, formatPKR } from "@/lib/format";
import { ADDON_PRICES, MAX_AREA_SQFT, RANGE_HIGH, RANGE_LOW, UNIT_TO_SQFT } from "@/lib/pricing";
import { effectiveRate, hasOffer, maxRate, rateText, warrantyOf } from "@/lib/rates";
import { quoteHref } from "@/lib/quoteLink";
import { whatsappLink } from "@/lib/whatsapp";

type Mode = "dims" | "total";
interface Row {
  id: number;
  label: string;
  mode: Mode;
  length: string;
  height: string;
  qty: string;
  faces: 1 | 2;
  total: string;
}
interface GroupState {
  on: boolean;
  rows: Row[];
  openings: Record<OpeningKind, string>;
  /** "" = use the main finish */
  slug: string;
}

const STORAGE_KEY = "zc-house-v1";
const MAX_ROWS = 12;
/** Wall finishes only: epoxy is a floor system and is quoted separately. */
const wallFinishes = textures.filter((x) => x.system !== "floor");

const input =
  "h-10 w-full rounded-control border border-line-strong bg-surface px-2.5 text-sm text-ink tnum focus:border-brand-500 focus:outline-none";
const select =
  "h-11 w-full rounded-control border border-line-strong bg-surface px-3 text-sm text-ink focus:border-brand-500 focus:outline-none";

let rowSeq = 1;
const newRow = (label = ""): Row => ({ id: rowSeq++, label, mode: "dims", length: "", height: "", qty: "1", faces: 1, total: "" });

const initialGroups = (): Record<string, GroupState> =>
  Object.fromEntries(
    houseGroups.map((g) => [
      g.id,
      { on: g.on, rows: g.defaultRows.map((l) => newRow(l)), openings: { door: "", window: "", gate: "" }, slug: "" } satisfies GroupState,
    ]),
  );

const num = (s: string) => Math.max(0, Number(s) || 0);

function rowArea(r: Row) {
  if (r.mode === "total") return num(r.total) * r.faces;
  return num(r.length) * num(r.height) * Math.max(1, Math.floor(num(r.qty)) || 1) * r.faces;
}

/** Whole-house estimate: front, sides, upper floors, mumty, parapet and boundary walls, each with its own finish if wanted. */
export function HouseEstimator() {
  const t = useT();
  const uid = useId();
  const [groups, setGroups] = useState<Record<string, GroupState>>(initialGroups);
  const [mainSlug, setMainSlug] = useState(wallFinishes[0].slug);
  const [location, setLocation] = useState<string>(locationOptions[0].value);
  const [scaffold, setScaffold] = useState<boolean | null>(null); // null = automatic
  const [primer, setPrimer] = useState(true);
  const [ready, setReady] = useState(false);

  // Restore an unfinished draft (browser storage may be unavailable: ignore errors).
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const d = JSON.parse(raw);
        if (d?.groups && typeof d.groups === "object") {
          setGroups((cur) => {
            const next = { ...cur };
            for (const g of houseGroups) {
              const s = d.groups[g.id];
              if (s && Array.isArray(s.rows) && s.rows.length > 0) {
                next[g.id] = {
                  on: Boolean(s.on),
                  slug: typeof s.slug === "string" ? s.slug : "",
                  openings: { door: "", window: "", gate: "", ...(s.openings ?? {}) },
                  rows: s.rows.slice(0, MAX_ROWS).map((r: Row) => ({ ...newRow(), ...r, id: rowSeq++ })),
                };
              }
            }
            return next;
          });
        }
        if (wallFinishes.some((x) => x.slug === d?.mainSlug)) setMainSlug(d.mainSlug);
        if (locationOptions.some((l) => l.value === d?.location)) setLocation(d.location);
        if (typeof d?.primer === "boolean") setPrimer(d.primer);
      }
    } catch {
      /* ignore */
    }
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ groups, mainSlug, location, primer }));
    } catch {
      /* ignore */
    }
  }, [groups, mainSlug, location, primer, ready]);

  const patch = (id: string, fn: (g: GroupState) => GroupState) => setGroups((gs) => ({ ...gs, [id]: fn(gs[id]) }));
  const patchRow = (gid: string, rid: number, p: Partial<Row>) => patch(gid, (g) => ({ ...g, rows: g.rows.map((r) => (r.id === rid ? { ...r, ...p } : r)) }));

  const loc = locationOptions.find((l) => l.value === location) ?? locationOptions[0];
  const main = wallFinishes.find((x) => x.slug === mainSlug) ?? wallFinishes[0];
  const city = getCity(loc.city) ?? cities[0];
  const applyLayout = (ids: string[]) => setGroups((gs) => Object.fromEntries(houseGroups.map((g) => [g.id, { ...gs[g.id], on: ids.includes(g.id) }])));
  const layoutOrder = [...houseLayouts].sort((a, b) => {
    const ia = city.layouts.indexOf(a.id);
    const ib = city.layouts.indexOf(b.id);
    return (ia === -1 ? 99 : ia) - (ib === -1 ? 99 : ib);
  });

  const calc = useMemo(() => {
    const lines = houseGroups
      .filter((g) => groups[g.id].on)
      .map((g) => {
        const s = groups[g.id];
        const gross = s.rows.reduce((a, r) => a + rowArea(r), 0);
        const maxFaces = s.rows.some((r) => r.faces === 2 && rowArea(r) > 0) ? 2 : 1;
        const deduct = g.openings.reduce((a, k) => a + num(s.openings[k]) * OPENING_SQFT[k], 0) * maxFaces;
        const sqft = Math.max(0, gross - deduct);
        const finish = wallFinishes.find((x) => x.slug === s.slug) ?? main;
        return { g, sqft, gross, deduct, finish, cost: Math.round(sqft * effectiveRate(finish)), top: Math.round(sqft * maxRate(finish)) };
      });
    const sqft = Math.min(
      lines.reduce((a, l) => a + l.sqft, 0),
      MAX_AREA_SQFT,
    );
    const base = lines.reduce((a, l) => a + l.cost, 0);
    const needsScaffold = lines.some((l) => l.g.scaffold && l.sqft > 0);
    const useScaffold = scaffold ?? needsScaffold;
    const scaffoldCost = useScaffold && sqft > 0 ? ADDON_PRICES.scaffold : 0;
    const primerCost = primer && sqft > 0 ? ADDON_PRICES.primer : 0;
    const subtotal = base + scaffoldCost + primerCost;
    const logistics = Math.round(subtotal * loc.surcharge);
    const total = subtotal + logistics;
    const round = (n: number) => Math.round(n / 1000) * 1000;
    return { lines, sqft: Math.round(sqft), base, needsScaffold, useScaffold, scaffoldCost, primerCost, logistics, total, low: round(total * RANGE_LOW), high: round(total * RANGE_HIGH) };
  }, [groups, main, scaffold, primer, loc.surcharge]);

  const active = calc.lines.filter((l) => l.sqft > 0);
  const dominant = [...active].sort((a, b) => b.sqft - a.sqft)[0]?.finish ?? main;
  const minWarranty = active.length ? Math.min(...active.map((l) => warrantyOf(l.finish))) : warrantyOf(main);
  const hasArea = calc.sqft > 0;

  const summaryText = active.map((l) => `${l.g.title}: ${formatNumber(l.sqft)} sq ft ${l.finish.shortName}`).join("; ");
  const waText = `Salam Zain & Co, I made a whole-house estimate on your website. ${summaryText}. Total ${formatNumber(calc.sqft)} sq ft, about ${formatPKR(calc.total)}. Please arrange a site survey.`;

  const reset = () => {
    setGroups(initialGroups());
    setScaffold(null);
  };

  return (
    <div className="grid gap-8 lg:grid-cols-[1.35fr_1fr] lg:gap-10">
      <div className="no-print grid gap-6">
        <section className="rounded-2xl border border-line bg-surface p-5 shadow-card sm:p-6">
          <h2 className="text-lg font-bold">{t("1. Basics")}</h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor={`${uid}-fin`} className="mb-1.5 block text-xs font-semibold text-ink-soft uppercase">{t("Main finish for the house")}</label>
              <select id={`${uid}-fin`} className={select} value={mainSlug} onChange={(e) => setMainSlug(e.target.value)}>
                {wallFinishes.map((x) => (
                  <option key={x.slug} value={x.slug}>{t(x.name)} ({rateText(x)}/{t("sqft")})</option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor={`${uid}-loc`} className="mb-1.5 block text-xs font-semibold text-ink-soft uppercase">{t("Site Location")}</label>
              <select id={`${uid}-loc`} className={select} value={location} onChange={(e) => setLocation(e.target.value)}>
                {locationOptions.map((l) => (
                  <option key={l.value} value={l.value}>{t(l.label)}</option>
                ))}
              </select>
            </div>
          </div>

          <p className="mt-6 text-xs font-semibold text-ink-soft uppercase">{t("Start from a layout common in {city}", { city: t(city.name) })}</p>
          <ul className="mt-3 grid gap-2 sm:grid-cols-2">
            {layoutOrder.map((l) => (
              <li key={l.id}>
                <button type="button" onClick={() => applyLayout(l.groups)} className="h-full w-full rounded-xl border border-line bg-surface p-3 text-start transition-colors hover:bg-sunken">
                  <span className="block text-sm font-semibold text-ink">
                    {t(l.label)} {city.layouts.includes(l.id) && <span className="ms-1 rounded-full bg-brand-50 px-2 py-0.5 text-[10px] font-bold text-brand-600">{t("Common here")}</span>}
                  </span>
                  <span className="block text-xs text-ink-muted">{t(l.hint)}</span>
                </button>
              </li>
            ))}
          </ul>

          <p className="mt-6 text-xs font-semibold text-ink-soft uppercase">{t("Which parts of the house do you want finished?")}</p>
          <ul className="mt-3 flex flex-wrap gap-2">
            {houseGroups.map((g) => (
              <li key={g.id}>
                <button
                  type="button"
                  aria-pressed={groups[g.id].on}
                  onClick={() => patch(g.id, (s) => ({ ...s, on: !s.on }))}
                  className={cn(
                    "rounded-full border px-3.5 py-2 text-[13px] font-semibold transition-colors",
                    groups[g.id].on ? "border-ink bg-ink text-white" : "border-line-strong bg-surface text-ink-soft hover:bg-sunken",
                  )}
                >
                  {t(g.title)}
                </button>
              </li>
            ))}
          </ul>
        </section>

        {houseGroups.filter((g) => groups[g.id].on).map((g) => {
          const s = groups[g.id];
          const line = calc.lines.find((l) => l.g.id === g.id);
          return (
            <section key={g.id} className="rounded-2xl border border-line bg-surface p-5 shadow-card sm:p-6">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="max-w-xl">
                  <h2 className="text-lg font-bold">{t(g.title)}</h2>
                  <p className="mt-1 text-sm text-ink-soft">{t(g.hint)}</p>
                </div>
                <p className="rounded-full bg-brand-50 px-3 py-1 text-sm font-bold text-brand-600 tnum">{formatNumber(line?.sqft ?? 0)} {t("sq ft")}</p>
              </div>

              <ul className="mt-4 grid gap-3">
                {s.rows.map((r) => (
                  <li key={r.id} className="rounded-xl border border-line bg-canvas p-3">
                    <div className="flex items-center gap-2">
                      <input
                        className={cn(input, "flex-1")}
                        value={r.label}
                        onChange={(e) => patchRow(g.id, r.id, { label: e.target.value })}
                        placeholder={t("Wall name")}
                        aria-label={t("Wall name")}
                      />
                      <select
                        className="h-10 rounded-control border border-line-strong bg-surface px-2 text-xs text-ink focus:border-brand-500 focus:outline-none"
                        value={r.mode}
                        onChange={(e) => patchRow(g.id, r.id, { mode: e.target.value as Mode })}
                        aria-label={t("How do you want to enter this wall?")}
                      >
                        <option value="dims">{t("Width × Height")}</option>
                        <option value="total">{t("Lump sum (total sq ft)")}</option>
                      </select>
                      <button
                        type="button"
                        aria-label={t("Remove")}
                        disabled={s.rows.length === 1}
                        onClick={() => patch(g.id, (x) => ({ ...x, rows: x.rows.filter((q) => q.id !== r.id) }))}
                        className="grid size-10 shrink-0 place-items-center rounded-control text-ink-muted hover:bg-sunken hover:text-red-600 disabled:opacity-30"
                      >
                        <Trash2 aria-hidden="true" className="size-4" />
                      </button>
                    </div>

                    <div className="mt-2 grid grid-cols-2 items-end gap-2 sm:grid-cols-[1fr_1fr_5rem_auto_auto]">
                      {r.mode === "dims" ? (
                        <>
                          <Num label={t("Width (ft)")} value={r.length} onChange={(v) => patchRow(g.id, r.id, { length: v })} />
                          <Num label={t("Height (ft)")} value={r.height} onChange={(v) => patchRow(g.id, r.id, { height: v })} />
                          <Num label={t("Qty")} value={r.qty} onChange={(v) => patchRow(g.id, r.id, { qty: v })} step={1} />
                        </>
                      ) : (
                        <div className="col-span-2 sm:col-span-3">
                          <Num label={t("Total area (sq ft)")} value={r.total} onChange={(v) => patchRow(g.id, r.id, { total: v })} />
                        </div>
                      )}
                      {g.faces && (
                        <label className="col-span-1">
                          <span className="mb-1 block text-[10px] font-semibold tracking-wide text-ink-muted uppercase">{t("Faces to finish")}</span>
                          <select
                            className="h-10 w-full rounded-control border border-line-strong bg-surface px-2 text-xs text-ink focus:border-brand-500 focus:outline-none"
                            value={r.faces}
                            onChange={(e) => patchRow(g.id, r.id, { faces: e.target.value === "2" ? 2 : 1 })}
                          >
                            <option value="1">{t("One side")}</option>
                            <option value="2">{t("Both sides (inside + outside)")}</option>
                          </select>
                        </label>
                      )}
                      <p className="pb-2 text-end text-sm font-semibold text-ink tnum">
                        {formatNumber(rowArea(r))} <span className="text-xs font-normal text-ink-muted">{t("sq ft")}</span>
                      </p>
                    </div>
                  </li>
                ))}
              </ul>

              <button
                type="button"
                disabled={s.rows.length >= MAX_ROWS}
                onClick={() => patch(g.id, (x) => ({ ...x, rows: [...x.rows, newRow()] }))}
                className="mt-3 inline-flex items-center gap-1.5 rounded-control border border-line-strong bg-surface px-3 py-2 text-sm font-semibold hover:bg-sunken disabled:opacity-50"
              >
                <Plus aria-hidden="true" className="size-4" /> {t("Add wall")}
              </button>

              {g.openings.length > 0 && (
                <div className="mt-5 border-t border-line pt-4">
                  <p className="text-xs font-semibold text-ink-soft uppercase">{t("Subtract openings (optional)")}</p>
                  <div className="mt-2 flex flex-wrap gap-3">
                    {g.openings.map((k) => (
                      <label key={k} className="w-28">
                        <span className="mb-1 block text-[10px] font-semibold tracking-wide text-ink-muted uppercase">
                          {k === "door" ? t("Doors") : k === "window" ? t("Windows") : t("Gates")} (~{OPENING_SQFT[k]} {t("sq ft")})
                        </span>
                        <input
                          className={input}
                          type="number"
                          inputMode="numeric"
                          min={0}
                          value={s.openings[k]}
                          onChange={(e) => patch(g.id, (x) => ({ ...x, openings: { ...x.openings, [k]: e.target.value } }))}
                        />
                      </label>
                    ))}
                  </div>
                </div>
              )}

              <div className="mt-5 border-t border-line pt-4">
                <label className="block max-w-sm">
                  <span className="mb-1 block text-xs font-semibold text-ink-soft uppercase">{t("Finish for this part")}</span>
                  <select className={select} value={s.slug} onChange={(e) => patch(g.id, (x) => ({ ...x, slug: e.target.value }))}>
                    <option value="">{t("Same as main finish")}</option>
                    {wallFinishes.map((x) => (
                      <option key={x.slug} value={x.slug}>{t(x.name)} ({rateText(x)}/{t("sqft")})</option>
                    ))}
                  </select>
                </label>
              </div>
            </section>
          );
        })}

        <section className="rounded-2xl border border-line bg-surface p-5 shadow-card sm:p-6">
          <h2 className="text-lg font-bold">{t("Extras")}</h2>
          <div className="mt-3 grid gap-2.5 text-sm">
            <label className="flex items-start gap-3">
              <input type="checkbox" className="mt-0.5 size-4 accent-[#9a741f]" checked={calc.useScaffold} onChange={(e) => setScaffold(e.target.checked)} />
              <span>
                {t("Scaffolding for upper floors")} <span className="text-ink-muted">({formatPKR(ADDON_PRICES.scaffold)})</span>
                {calc.needsScaffold && scaffold === null && <span className="ms-2 rounded-full bg-brand-50 px-2 py-0.5 text-[11px] font-bold text-brand-600">{t("Suggested")}</span>}
              </span>
            </label>
            <label className="flex items-start gap-3">
              <input type="checkbox" className="mt-0.5 size-4 accent-[#9a741f]" checked={primer} onChange={(e) => setPrimer(e.target.checked)} />
              <span>{t("Deep primer coat")} <span className="text-ink-muted">({formatPKR(ADDON_PRICES.primer)})</span></span>
            </label>
          </div>
          <button type="button" onClick={reset} className="mt-5 text-xs font-semibold text-ink-muted underline-offset-2 hover:text-red-600 hover:underline">
            {t("Clear everything and start again")}
          </button>
        </section>
      </div>

      <aside className="lg:sticky lg:top-28 lg:self-start" aria-live="polite">
        <div className="overflow-hidden rounded-2xl bg-ink p-5 text-white shadow-modal sm:p-6">
          <p className="text-xs font-semibold tracking-[0.14em] text-gold-500 uppercase">{t("Whole-house estimate")}</p>
          <p className="font-display mt-1 text-4xl font-extrabold tnum">
            {formatPKR(hasArea ? calc.total : 0)}
          </p>
          {hasArea && (
            <p className="mt-1 text-sm text-white/70 tnum">
              {t("Likely range")}: {formatPKR(calc.low)} – {formatPKR(calc.high)}
            </p>
          )}

          <dl className="mt-5 grid gap-2 text-sm">
            <div className="flex justify-between gap-3"><dt className="text-white/70">{t("Total wall area")}</dt><dd className="font-semibold tnum">{formatNumber(calc.sqft)} {t("sq ft")}</dd></div>
            <div className="flex justify-between gap-3"><dt className="text-white/70">{t("About")}</dt><dd className="font-semibold tnum">{(calc.sqft / UNIT_TO_SQFT.marla).toFixed(1)} {t("Marla")}</dd></div>
          </dl>

          <table className="mt-5 w-full text-start text-[13px]">
            <thead>
              <tr className="text-[11px] tracking-wide text-white/50 uppercase">
                <th className="py-1.5 text-start font-semibold">{t("Part")}</th>
                <th className="py-1.5 text-end font-semibold">{t("sq ft")}</th>
                <th className="py-1.5 text-end font-semibold">{t("Cost")}</th>
              </tr>
            </thead>
            <tbody>
              {calc.lines.map((l) => (
                <tr key={l.g.id} className="border-t border-white/10">
                  <td className="py-2 pe-2">
                    <span className="block font-medium">{t(l.g.title)}</span>
                    <span className="text-[11px] text-white/50">{t(l.finish.shortName)}{hasOffer(l.finish) ? ` • ${t("Offer")}` : ""}</span>
                  </td>
                  <td className="py-2 text-end tnum">{formatNumber(l.sqft)}</td>
                  <td className="py-2 text-end tnum">{formatNumber(l.cost)}</td>
                </tr>
              ))}
              {calc.scaffoldCost > 0 && (
                <tr className="border-t border-white/10"><td className="py-2">{t("Scaffolding")}</td><td /><td className="py-2 text-end tnum">{formatNumber(calc.scaffoldCost)}</td></tr>
              )}
              {calc.primerCost > 0 && (
                <tr className="border-t border-white/10"><td className="py-2">{t("Deep primer coat")}</td><td /><td className="py-2 text-end tnum">{formatNumber(calc.primerCost)}</td></tr>
              )}
              {calc.logistics > 0 && (
                <tr className="border-t border-white/10"><td className="py-2">{t("Outstation logistics")}</td><td /><td className="py-2 text-end tnum">{formatNumber(calc.logistics)}</td></tr>
              )}
            </tbody>
          </table>

          <p className="mt-4 text-[11px] leading-snug text-white/50">
            {t("Indicative estimate from your own measurements. The final price is confirmed after our free site survey. Written warranty: {n} years on the shortest-warranty finish chosen.", { n: minWarranty })}
          </p>

          <div className="no-print mt-5 grid gap-3">
            <Button
              href={quoteHref({ area: calc.sqft, unit: "sqft", texture: dominant.slug, zone: "exterior", location, notes: summaryText })}
              size="lg"
              className={cn(!hasArea && "pointer-events-none opacity-50")}
            >
              {t("Get Exact Quote / Book Visit")} <ArrowRight aria-hidden="true" className="size-4 rtl:-scale-x-100" />
            </Button>
            <Button href={whatsappLink(waText)} variant="whatsapp" size="lg" className={cn(!hasArea && "pointer-events-none opacity-50")}>
              <WhatsAppIcon className="size-5" /> {t("Send Estimate on WhatsApp")}
            </Button>
            <Button variant="secondary" size="lg" disabled={!hasArea} onClick={() => window.print()}>
              <Printer aria-hidden="true" className="size-5" /> {t("Print or save as PDF")}
            </Button>
          </div>
        </div>
      </aside>
    </div>
  );
}

function Num({ label, value, onChange, step }: { label: string; value: string; onChange: (v: string) => void; step?: number }) {
  return (
    <label>
      <span className="mb-1 block text-[10px] font-semibold tracking-wide text-ink-muted uppercase">{label}</span>
      <input className={input} type="number" inputMode="decimal" min={0} step={step} value={value} onChange={(e) => onChange(e.target.value)} />
    </label>
  );
}
