"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { AlertTriangle, ArrowRight, CircleCheck } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { WhatsAppIcon } from "@/components/ui/icons";
import { crackHiding, dampTolerant, symptoms, type Zone } from "@/data/guides";
import { textures } from "@/data/textures";
import { useT } from "@/i18n/client";
import { cn } from "@/lib/cn";
import { effectiveRate, rateText } from "@/lib/rates";
import { quoteHref } from "@/lib/quoteLink";
import { whatsappLink } from "@/lib/whatsapp";

const chip = (on: boolean) =>
  cn(
    "rounded-full border px-4 py-2 text-sm font-semibold transition-colors",
    on ? "border-ink bg-ink text-white" : "border-line-strong bg-surface text-ink-soft hover:bg-sunken",
  );

/** Tick what you see on the wall; get the order of repairs and the finishes that suit the condition. */
export function WallDoctor() {
  const t = useT();
  const [zone, setZone] = useState<Exclude<Zone, "floor">>("exterior");
  const [picked, setPicked] = useState<string[]>([]);

  const chosen = symptoms.filter((s) => picked.includes(s.id));
  const water = chosen.some((s) => s.water);
  const cracks = chosen.some((s) => s.cracks);

  const picks = useMemo(() => {
    return textures
      .filter((x) => x.zones.includes(zone) && x.system !== "floor")
      .map((x) => {
        let score = 0;
        if (water && dampTolerant.includes(x.slug)) score += 3;
        if (cracks && crackHiding.includes(x.slug)) score += 2;
        return { x, score };
      })
      .sort((a, b) => b.score - a.score || effectiveRate(a.x) - effectiveRate(b.x))
      .slice(0, 3);
  }, [zone, water, cracks]);

  const toggle = (id: string) => setPicked((p) => (p.includes(id) ? p.filter((x) => x !== id) : [...p, id]));
  const summary = chosen.map((s) => s.label).join("; ");

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_1.1fr] lg:gap-12">
      <div>
        <fieldset>
          <legend className="text-sm font-bold">{t("Which wall is it?")}</legend>
          <div className="mt-3 flex gap-2">
            {(["exterior", "interior"] as const).map((z) => (
              <button key={z} type="button" aria-pressed={zone === z} onClick={() => setZone(z)} className={chip(zone === z)}>
                {z === "exterior" ? t("Outside wall") : t("Inside wall")}
              </button>
            ))}
          </div>
        </fieldset>

        <fieldset className="mt-8">
          <legend className="text-sm font-bold">{t("What do you see? (tick all that apply)")}</legend>
          <ul className="mt-3 grid gap-2">
            {symptoms.map((s) => (
              <li key={s.id}>
                <label
                  className={cn(
                    "flex cursor-pointer items-start gap-3 rounded-xl border p-3.5 text-sm transition-colors",
                    picked.includes(s.id) ? "border-brand-500 bg-brand-50" : "border-line bg-surface hover:bg-sunken",
                  )}
                >
                  <input type="checkbox" checked={picked.includes(s.id)} onChange={() => toggle(s.id)} className="mt-0.5 size-4 accent-[#9a741f]" />
                  <span className="font-medium text-ink">{s.label}</span>
                </label>
              </li>
            ))}
          </ul>
        </fieldset>
      </div>

      <div className="lg:sticky lg:top-28 lg:self-start" aria-live="polite">
        {chosen.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-line-strong bg-surface p-8 text-center text-sm text-ink-soft">
            {t("Tick what you see on the left and your repair plan appears here.")}
          </div>
        ) : (
          <div className="grid gap-5">
            {water && (
              <div className="flex gap-3 rounded-xl border border-amber-300 bg-amber-50 p-4 text-sm text-amber-900">
                <AlertTriangle aria-hidden="true" className="mt-0.5 size-5 shrink-0" />
                <p><strong>{t("Fix the water first.")}</strong> {t("No finish lasts on a damp wall. Repair the source and let the wall dry before texturing.")}</p>
              </div>
            )}

            <section className="rounded-2xl border border-line bg-surface p-5 shadow-card sm:p-6">
              <h2 className="text-lg font-bold">{t("Your repair plan")}</h2>
              <ol className="mt-4 grid gap-4">
                {chosen.map((s, i) => (
                  <li key={s.id} className="flex gap-3">
                    <span className="grid size-7 shrink-0 place-items-center rounded-full bg-brand-500 text-xs font-bold text-white">{i + 1}</span>
                    <div className="text-sm">
                      <p className="font-semibold text-ink"><bdi>{s.label}</bdi></p>
                      <p className="mt-1 text-ink-muted"><bdi>{s.cause}</bdi></p>
                      <p className="mt-1 text-ink-soft"><bdi>{s.action}</bdi></p>
                    </div>
                  </li>
                ))}
              </ol>
            </section>

            <section className="rounded-2xl border border-line bg-surface p-5 shadow-card sm:p-6">
              <h2 className="text-lg font-bold">{t("Finishes that suit this wall")}</h2>
              <ul className="mt-4 grid gap-3">
                {picks.map(({ x }) => (
                  <li key={x.slug} className="flex items-center justify-between gap-3 rounded-xl bg-sunken p-3.5">
                    <div className="text-sm">
                      <Link href={`/textures/${x.slug}`} className="font-semibold text-ink hover:text-brand-600">{t(x.name)}</Link>
                      <p className="text-xs text-ink-muted">{rateText(x)} / {t("sq ft")}</p>
                    </div>
                    <Link href={quoteHref({ texture: x.slug, zone })} className="shrink-0 text-xs font-semibold text-brand-600 hover:underline">{t("Get a quote")}</Link>
                  </li>
                ))}
              </ul>
              <p className="mt-3 flex gap-2 text-xs text-ink-muted">
                <CircleCheck aria-hidden="true" className="mt-0.5 size-4 shrink-0 text-brand-500" />
                {t("This is a guide, not a diagnosis. Our engineer confirms everything at the free site survey.")}
              </p>
            </section>

            <div className="grid gap-3 sm:grid-cols-2">
              <Button href={quoteHref({ zone, texture: picks[0]?.x.slug })} size="lg">
                {t("Book a free survey")} <ArrowRight aria-hidden="true" className="size-4 rtl:-scale-x-100" />
              </Button>
              <Button href={whatsappLink(`Salam Zain & Co, I checked my ${zone} wall on your website. I see: ${summary}. Please advise.`)} variant="whatsapp" size="lg">
                <WhatsAppIcon className="size-5" /> {t("Send this to us")}
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
