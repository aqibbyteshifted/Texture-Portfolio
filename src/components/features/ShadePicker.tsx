"use client";

import { useState } from "react";
import { ArrowRight, Check } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { TextureImage } from "@/components/ui/TextureImage";
import { WhatsAppIcon } from "@/components/ui/icons";
import { useT } from "@/i18n/client";
import { cn } from "@/lib/cn";
import { quoteHref } from "@/lib/quoteLink";
import { waMessages, whatsappLink } from "@/lib/whatsapp";
import type { Shade } from "@/data/shades";
import type { Texture } from "@/types";

/** Pick a shade, preview it on the finish, and carry the shade code into the quote request. */
export function ShadePicker({ texture, shades }: { texture: Texture; shades: Shade[] }) {
  const t = useT();
  const [active, setActive] = useState(0);
  if (shades.length === 0) return null;
  const shade = shades[active];

  return (
    <section id="shades" aria-labelledby="shade-title" className="container-page py-16 sm:py-20">
      <div className="mb-8 max-w-2xl">
        <p className="mb-2 text-xs font-semibold tracking-[0.14em] text-clay-500 uppercase">{t("Colour Palette")}</p>
        <h2 id="shade-title" className="text-[1.75rem] leading-[1.1] font-bold sm:text-4xl">
          {t("Choose Your Shade")}
        </h2>
        <p className="mt-3 text-[15px] leading-relaxed text-ink-soft sm:text-base">
          {t("Tap a shade to preview it on this finish. Your shade code is added to your quote request.")}
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.1fr_1fr] lg:items-center">
        <div className="relative aspect-[16/10] overflow-hidden rounded-2xl bg-ink shadow-lift" aria-live="polite">
          {texture.image ? (
            <>
              <TextureImage src={texture.image} alt={`${texture.name} in ${shade.name}`} swatch={shade.hex} className="grayscale contrast-110" sizes="(min-width: 1024px) 600px, 100vw" />
              <div className="absolute inset-0 transition-colors duration-500" style={{ backgroundColor: shade.hex, mixBlendMode: "color", opacity: 0.9 }} />
              <div className="absolute inset-0 transition-colors duration-500" style={{ backgroundColor: shade.hex, mixBlendMode: "multiply", opacity: 0.25 }} />
            </>
          ) : (
            <TextureImage alt={`${texture.name} in ${shade.name}`} swatch={shade.hex} className="transition-colors duration-500" />
          )}
          <span className="absolute start-4 bottom-4 rounded-lg bg-black/60 px-3 py-2 text-white backdrop-blur">
            <span className="block text-[11px] tracking-wider text-white/70 uppercase">{shade.code}</span>
            <span className="block text-sm font-bold">{shade.name}</span>
          </span>
        </div>

        <div>
          <ul className="grid grid-cols-4 gap-3 sm:grid-cols-5" role="radiogroup" aria-label={t("Shade")}>
            {shades.map((s, i) => {
              const selected = i === active;
              return (
                <li key={s.code}>
                  <button
                    type="button"
                    role="radio"
                    aria-checked={selected}
                    aria-label={`${s.name} (${s.code})`}
                    onClick={() => setActive(i)}
                    className={cn(
                      "group relative block aspect-square w-full rounded-xl border-2 transition-transform hover:scale-105",
                      selected ? "border-clay-500 ring-2 ring-clay-500/30" : "border-white shadow-card",
                    )}
                    style={{ backgroundColor: s.hex }}
                  >
                    {selected && (
                      <Check aria-hidden="true" className="absolute top-1/2 left-1/2 size-5 -translate-x-1/2 -translate-y-1/2 text-white drop-shadow" strokeWidth={3} />
                    )}
                  </button>
                </li>
              );
            })}
          </ul>

          <div className="mt-6 rounded-xl border border-line bg-surface p-5 shadow-card">
            <p className="text-[11px] font-semibold tracking-wider text-ink-muted uppercase">{t("Selected Shade")}</p>
            <p className="mt-1 text-xl font-bold">{shade.name}</p>
            <p className="text-sm text-ink-soft">
              {t("Shade code")}: <strong className="ltr-run text-ink">{shade.code}</strong> · <span className="ltr-run uppercase">{shade.hex}</span>
            </p>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <Button href={quoteHref({ texture: texture.slug, shade: shade.code })}>
                {t("Get a Quote in This Shade")} <ArrowRight aria-hidden="true" className="size-4 rtl:-scale-x-100" />
              </Button>
              <Button href={whatsappLink(waMessages.shade(texture.name, shade.name, shade.code))} variant="whatsapp">
                <WhatsAppIcon className="size-4" /> {t("Ask on WhatsApp")}
              </Button>
            </div>
            <p className="mt-3 text-[11px] leading-snug text-ink-muted">
              {t("On-screen colours are approximate. Physical sample boards confirm the final shade at your site.")}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
