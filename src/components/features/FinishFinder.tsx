"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { WhatsAppIcon } from "@/components/ui/icons";
import { looks, looksBySlug, type Zone } from "@/data/guides";
import { textures } from "@/data/textures";
import { useT } from "@/i18n/client";
import { cn } from "@/lib/cn";
import { effectiveRate, hasOffer, rateText, warrantyOf } from "@/lib/rates";
import { quoteHref } from "@/lib/quoteLink";
import { whatsappLink } from "@/lib/whatsapp";

const budgets = [
  { id: "low", label: "Up to PKR 100 / sq ft", max: 100 },
  { id: "mid", label: "PKR 100 to 220 / sq ft", max: 220 },
  { id: "high", label: "PKR 220 and above", max: Infinity },
  { id: "any", label: "No fixed budget", max: Infinity },
] as const;

const zones: { id: Zone; label: string }[] = [
  { id: "exterior", label: "Outside walls" },
  { id: "interior", label: "Inside walls" },
  { id: "floor", label: "Floor" },
];

const chip = (on: boolean) =>
  cn(
    "rounded-full border px-4 py-2 text-sm font-semibold transition-colors",
    on ? "border-ink bg-ink text-white" : "border-line-strong bg-surface text-ink-soft hover:bg-sunken",
  );

/** Three questions, three suggestions. Everything is calculated from data/textures.ts so it never goes out of date. */
export function FinishFinder() {
  const t = useT();
  const [zone, setZone] = useState<Zone>("exterior");
  const [budget, setBudget] = useState<(typeof budgets)[number]["id"]>("any");
  const [look, setLook] = useState<string>("stone");

  const results = useMemo(() => {
    const b = budgets.find((x) => x.id === budget) ?? budgets[3];
    const lowFloor = budget === "mid" ? 100 : budget === "high" ? 220 : 0;
    return textures
      .filter((x) => (zone === "floor" ? x.system === "floor" : x.system !== "floor" && x.zones.includes(zone)))
      .map((x) => {
        const rate = effectiveRate(x);
        let score = 0;
        const reasons: string[] = [];
        if (looksBySlug[x.slug]?.includes(look)) {
          score += 3;
          reasons.push("Matches the look you chose");
        }
        if (rate <= b.max && rate >= lowFloor) {
          score += 2;
          if (budget !== "any") reasons.push("Fits your budget");
        } else if (rate <= b.max) {
          score += 1;
        }
        if (warrantyOf(x) >= 10) {
          score += 1;
          reasons.push("Long written warranty");
        }
        return { x, score, reasons };
      })
      .sort((a, b2) => b2.score - a.score || effectiveRate(a.x) - effectiveRate(b2.x))
      .slice(0, 3);
  }, [zone, budget, look]);

  const lookLabel = looks.find((l) => l.id === look)?.label ?? "";

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_1.1fr] lg:gap-12">
      <div className="grid gap-8">
        <fieldset>
          <legend className="text-sm font-bold">{t("1. Where will it go?")}</legend>
          <div className="mt-3 flex flex-wrap gap-2">
            {zones.map((z) => (
              <button key={z.id} type="button" aria-pressed={zone === z.id} onClick={() => setZone(z.id)} className={chip(zone === z.id)}>
                {t(z.label)}
              </button>
            ))}
          </div>
        </fieldset>

        <fieldset>
          <legend className="text-sm font-bold">{t("2. What is your budget?")}</legend>
          <div className="mt-3 flex flex-wrap gap-2">
            {budgets.map((b) => (
              <button key={b.id} type="button" aria-pressed={budget === b.id} onClick={() => setBudget(b.id)} className={chip(budget === b.id)}>
                {t(b.label)}
              </button>
            ))}
          </div>
        </fieldset>

        {zone !== "floor" && (
          <fieldset>
            <legend className="text-sm font-bold">{t("3. Which look do you like?")}</legend>
            <div className="mt-3 grid gap-2 sm:grid-cols-2">
              {looks.map((l) => (
                <button
                  key={l.id}
                  type="button"
                  aria-pressed={look === l.id}
                  onClick={() => setLook(l.id)}
                  className={cn(
                    "rounded-xl border p-3.5 text-start transition-colors",
                    look === l.id ? "border-brand-500 bg-brand-50" : "border-line bg-surface hover:bg-sunken",
                  )}
                >
                  <span className="block text-sm font-semibold text-ink">{t(l.label)}</span>
                  <span className="block text-xs text-ink-muted">{t(l.hint)}</span>
                </button>
              ))}
            </div>
          </fieldset>
        )}
      </div>

      <div className="grid gap-4 lg:sticky lg:top-28 lg:self-start" aria-live="polite">
        <h2 className="text-lg font-bold">{t("Our top picks for you")}</h2>
        {results.map(({ x, reasons }, i) => (
          <article key={x.slug} className="rounded-2xl border border-line bg-surface p-5 shadow-card">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-[11px] font-bold tracking-wider text-brand-600 uppercase">{i === 0 ? t("Best match") : `${t("Option")} ${i + 1}`}</p>
                <h3 className="mt-0.5 text-lg font-bold">
                  <Link href={`/textures/${x.slug}`} className="hover:text-brand-600">{t(x.name)}</Link>
                </h3>
              </div>
              <p className="text-end text-sm font-bold tnum">
                {rateText(x)}
                <span className="block text-[11px] font-normal text-ink-muted">/ {t("sq ft")}{hasOffer(x) ? ` • ${t("Offer")}` : ""}</span>
              </p>
            </div>
            <p className="mt-2 text-sm text-ink-soft">{t(x.summary)} · {t("{n}-Year Written Warranty", { n: warrantyOf(x) })}</p>
            {reasons.length > 0 && (
              <ul className="mt-3 flex flex-wrap gap-2">
                {reasons.map((r) => (
                  <li key={r} className="rounded-full bg-brand-50 px-2.5 py-1 text-[11px] font-semibold text-brand-600">{t(r)}</li>
                ))}
              </ul>
            )}
            <Link href={quoteHref({ texture: x.slug, zone: zone === "floor" ? "interior" : zone })} className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-brand-600 hover:underline">
              {t("Get a quote for this")} <ArrowRight aria-hidden="true" className="size-4 rtl:-scale-x-100" />
            </Link>
          </article>
        ))}

        <div className="grid gap-3 sm:grid-cols-2">
          <Button href="/compare" variant="secondary" size="lg">{t("Compare finishes")}</Button>
          <Button
            href={whatsappLink(`Salam Zain & Co, I used your finish finder (${zone}, budget: ${budget}${zone !== "floor" ? `, look: ${lookLabel}` : ""}). My top pick was ${results[0]?.x.name}. Please advise.`)}
            variant="whatsapp"
            size="lg"
          >
            <WhatsAppIcon className="size-5" /> {t("Ask an expert")}
          </Button>
        </div>
      </div>
    </div>
  );
}
