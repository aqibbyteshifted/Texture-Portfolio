"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { ArrowRight, Check, Minus } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { TextureImage } from "@/components/ui/TextureImage";
import { WhatsAppIcon } from "@/components/ui/icons";
import { getShades } from "@/data/shades";
import { getTexture, textures } from "@/data/textures";
import { useT } from "@/i18n/client";
import { formatNumber, formatPKR } from "@/lib/format";
import { quoteHref } from "@/lib/quoteLink";
import { waMessages, whatsappLink } from "@/lib/whatsapp";
import { cn } from "@/lib/cn";
import type { Texture } from "@/types";

const DEFAULT_SLUGS = ["rockwall-aggregates", "italian-travertine", "microcement"];
const SLOTS = 3;

export function CompareTool() {
  const t = useT();
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();

  const [slots, setSlots] = useState<string[]>(() => {
    const fromUrl = (params.get("t") ?? "")
      .split(",")
      .filter((s) => getTexture(s))
      .slice(0, SLOTS);
    const base = fromUrl.length ? fromUrl : DEFAULT_SLUGS;
    return Array.from({ length: SLOTS }, (_, i) => base[i] ?? "");
  });
  const [area, setArea] = useState("1000");

  useEffect(() => {
    const picked = slots.filter(Boolean);
    router.replace(picked.length ? `${pathname}?t=${picked.join(",")}` : pathname, { scroll: false });
  }, [slots, pathname, router]);

  const selected = useMemo(() => slots.map((s) => getTexture(s)).filter((x): x is Texture => Boolean(x)), [slots]);
  const sqft = Math.max(0, Number(area) || 0);

  const setSlot = (i: number, value: string) =>
    setSlots((prev) => {
      const next = [...prev];
      // keep every slot unique: picking a finish already used elsewhere clears the other slot
      if (value) next.forEach((v, j) => j !== i && v === value && (next[j] = ""));
      next[i] = value;
      return next;
    });

  const zoneLabel = (x: Texture) => x.zones.map((z) => t(z === "exterior" ? "Exterior" : "Interior")).join(" / ");

  const rows: { label: string; render: (x: Texture) => React.ReactNode }[] = [
    { label: t("Rate"), render: (x) => <strong className="text-clay-600 tnum">PKR {x.rate} / {t("sq ft")}</strong> },
    {
      label: t("Estimated cost for {area} sq ft", { area: formatNumber(sqft) }),
      render: (x) => <strong className="tnum">{formatPKR(sqft * x.rate)}</strong>,
    },
    { label: t("Suited to"), render: (x) => zoneLabel(x) },
    { label: t("Best for"), render: (x) => x.specs.zone },
    { label: t("Coating thickness"), render: (x) => x.specs.thickness },
    { label: t("Feel & finish"), render: (x) => x.specs.tactility },
    { label: t("Curing"), render: (x) => x.specs.curing },
    {
      label: t("Performance"),
      render: (x) => (
        <ul className="grid gap-1.5">
          {x.performance.map((p) => (
            <li key={p.label} className="text-xs leading-snug">
              <span className="text-ink-muted">{p.label}:</span> <strong>{p.value}</strong>
            </li>
          ))}
        </ul>
      ),
    },
    { label: t("Shades available"), render: (x) => <span className="tnum">{getShades(x.slug).length}</span> },
    {
      label: t("Written warranty"),
      render: () => (
        <span className="inline-flex items-center gap-1 font-semibold text-emerald-700">
          <Check aria-hidden="true" className="size-4" /> {t("3 years")}
        </span>
      ),
    },
  ];

  return (
    <div>
      <div className="grid gap-4 rounded-2xl border border-line bg-surface p-5 shadow-card sm:grid-cols-2 lg:grid-cols-[repeat(3,1fr)_auto] lg:p-6">
        {slots.map((slug, i) => (
          <label key={i} className="block">
            <span className="mb-1.5 block text-xs font-semibold text-ink-soft uppercase">
              {t("Finish {n}", { n: i + 1 })}
            </span>
            <select
              value={slug}
              onChange={(e) => setSlot(i, e.target.value)}
              className="h-11 w-full rounded-control border border-line-strong bg-surface px-3 text-sm text-ink focus:border-clay-500 focus:outline-none"
            >
              {i > 0 && <option value="">{t("None")}</option>}
              {textures.map((x) => (
                <option key={x.slug} value={x.slug}>
                  {t(x.name)}
                </option>
              ))}
            </select>
          </label>
        ))}
        <label className="block sm:col-span-2 lg:col-span-1 lg:w-40">
          <span className="mb-1.5 block text-xs font-semibold text-ink-soft uppercase">{t("Your wall area (sq ft)")}</span>
          <input
            type="number"
            inputMode="numeric"
            min={0}
            value={area}
            onChange={(e) => setArea(e.target.value)}
            className="h-11 w-full rounded-control border border-line-strong bg-surface px-3 text-sm font-semibold text-ink tnum focus:border-clay-500 focus:outline-none"
          />
        </label>
      </div>

      {selected.length === 0 ? (
        <p className="mt-8 rounded-card border border-dashed border-line-strong bg-surface p-10 text-center text-ink-soft">
          {t("Pick at least one finish to start comparing.")}
        </p>
      ) : (
        <div className="mt-6 overflow-x-auto rounded-2xl border border-line bg-surface shadow-card">
          <table className="w-full min-w-[640px] border-collapse text-sm">
            <caption className="sr-only">{t("Side-by-side comparison of texture finishes")}</caption>
            <thead>
              <tr>
                <td className="sticky start-0 z-10 w-36 bg-surface p-4 sm:w-48" />
                {selected.map((x) => (
                  <th key={x.slug} scope="col" className="min-w-52 border-s border-line p-4 text-start align-top">
                    <div className="relative aspect-[4/3] overflow-hidden rounded-lg">
                      <TextureImage src={x.image} alt={x.name} swatch={x.swatch} sizes="260px" />
                    </div>
                    <p className="mt-3 text-base font-bold">{t(x.name)}</p>
                    <p className="text-xs font-normal text-ink-muted">{t(x.summary)}</p>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((row, ri) => (
                <tr key={row.label} className={cn("border-t border-line", ri % 2 === 1 && "bg-canvas/70")}>
                  <th scope="row" className={cn("sticky start-0 z-10 p-4 text-start text-xs font-semibold tracking-wide text-ink-soft uppercase", ri % 2 === 1 ? "bg-canvas" : "bg-surface")}>
                    {row.label}
                  </th>
                  {selected.map((x) => (
                    <td key={x.slug} className="border-s border-line p-4 align-top">
                      {row.render(x) ?? <Minus aria-hidden="true" className="size-4 text-ink-muted" />}
                    </td>
                  ))}
                </tr>
              ))}
              <tr className="border-t border-line">
                <th scope="row" className="sticky start-0 z-10 bg-surface p-4" />
                {selected.map((x) => (
                  <td key={x.slug} className="border-s border-line p-4">
                    <div className="grid gap-2">
                      <Button href={quoteHref({ texture: x.slug, area: sqft, unit: "sqft" })} size="sm">
                        {t("Get Quote")} <ArrowRight aria-hidden="true" className="size-3.5 rtl:-scale-x-100" />
                      </Button>
                      <Link href={`/textures/${x.slug}`} className="text-center text-[13px] font-bold text-clay-600 hover:text-clay-700">
                        {t("View details")}
                      </Link>
                    </div>
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      )}

      {selected.length > 1 && (
        <div className="mt-6 flex justify-center">
          <Button href={whatsappLink(waMessages.compare(selected.map((x) => x.name)))} variant="whatsapp" size="lg">
            <WhatsAppIcon className="size-5" /> {t("Not sure? Ask our engineer which one to choose")}
          </Button>
        </div>
      )}
    </div>
  );
}
