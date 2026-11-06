import { BadgeCheck, Landmark } from "lucide-react";
import { warrantyCoverage } from "@/data/credentials";
import { getI18n } from "@/i18n/server";

/** Illustrative preview of the stamped warranty card every client receives. */
export async function WarrantyCard() {
  const { t } = await getI18n();
  const fields: [string, string][] = [
    [t("Client"), t("Sample Client")],
    [t("Site"), "DHA Phase 6, Lahore"],
    [t("Finish"), "Italian Travertine"],
    [t("Area"), "3,500 sq ft"],
  ];

  return (
    <figure className="relative mx-auto w-full max-w-lg" aria-label={t("Sample warranty card")}>
      <div className="relative overflow-hidden rounded-2xl border-[3px] border-double border-clay-500/60 bg-gradient-to-br from-[#fffdf8] to-[#f7efe0] p-6 shadow-lift sm:p-8">
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 grid place-items-center">
          <span className="-rotate-12 font-display text-6xl font-extrabold tracking-widest text-clay-500/[0.07] uppercase sm:text-7xl">
            {t("Sample")}
          </span>
        </div>

        <div className="relative flex items-center gap-3 border-b border-clay-500/30 pb-4">
          <span className="grid size-11 place-items-center rounded-lg bg-clay-500 text-white">
            <Landmark aria-hidden="true" className="size-5" />
          </span>
          <div>
            <p className="font-display text-lg leading-tight font-extrabold">ZAIN &amp; CO GROUP</p>
            <p className="text-[10px] tracking-[0.16em] text-ink-muted uppercase">{t("Architectural Finishes • Lahore")}</p>
          </div>
        </div>

        <div className="relative mt-5 text-center">
          <p className="text-[11px] font-semibold tracking-[0.2em] text-clay-600 uppercase">{t("Certificate of Warranty")}</p>
          <p className="font-display mt-1 text-4xl font-extrabold text-ink">{t("3 Years")}</p>
        </div>

        <dl className="relative mt-5 grid grid-cols-2 gap-x-6 gap-y-3 text-sm">
          {fields.map(([k, v]) => (
            <div key={k} className="border-b border-dashed border-clay-500/30 pb-1.5">
              <dt className="text-[10px] font-semibold tracking-wider text-ink-muted uppercase">{k}</dt>
              <dd className="font-semibold">{v}</dd>
            </div>
          ))}
        </dl>

        <ul className="relative mt-5 grid gap-1.5 text-[13px] text-ink-soft">
          {warrantyCoverage.map((c) => (
            <li key={c} className="flex items-center gap-2">
              <BadgeCheck aria-hidden="true" className="size-4 shrink-0 text-clay-500" /> {t(c)}
            </li>
          ))}
        </ul>

        <div className="relative mt-6 flex items-end justify-between gap-4">
          <div>
            <div className="h-px w-32 bg-ink/40" />
            <p className="mt-1 text-[10px] tracking-wider text-ink-muted uppercase">{t("Authorised signature")}</p>
          </div>
          <span className="grid size-16 rotate-[-8deg] place-items-center rounded-full border-2 border-clay-500/70 text-center text-[8px] leading-tight font-bold tracking-wider text-clay-600 uppercase">
            {t("Official")}
            <br />
            {t("Stamp")}
          </span>
        </div>
      </div>
      <figcaption className="mt-3 text-center text-xs text-ink-muted">
        {t("Illustrative sample. Your card carries your name, site details and issue date.")}
      </figcaption>
    </figure>
  );
}
