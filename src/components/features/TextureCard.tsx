"use client";

import Link from "next/link";
import { ChevronRight, ShieldCheck } from "lucide-react";
import { Rate } from "@/components/ui/Rate";
import { TextureImage } from "@/components/ui/TextureImage";
import { useT } from "@/i18n/client";
import type { Texture } from "@/types";

export function TextureCard({ texture, priority = false }: { texture: Texture; priority?: boolean }) {
  const t = useT();
  const zones = texture.zones.map((z) => t(z === "exterior" ? "Exterior" : "Interior")).join("/");
  return (
    <article className="group flex flex-col overflow-hidden rounded-card border border-line bg-surface shadow-card transition-all duration-300 hover:-translate-y-1 hover:shadow-lift">
      <Link href={`/textures/${texture.slug}`} className="relative block aspect-[4/3] overflow-hidden" tabIndex={-1} aria-hidden="true">
        <TextureImage
          src={texture.image}
          alt={texture.name}
          swatch={texture.swatch}
          priority={priority}
          sizes="(min-width: 1024px) 380px, (min-width: 640px) 50vw, 100vw"
          className="transition-transform duration-700 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
        <span className="absolute start-3 top-3 rounded-md bg-surface/95 px-2.5 py-1 text-[11px] font-bold text-ink shadow-sm">
          {t(texture.category)} • {zones}
        </span>
        <span className="absolute end-3 top-3 rounded-md bg-clay-500 px-2.5 py-1 text-[11px] font-bold text-white shadow-sm">
          {t(texture.badge)}
        </span>
      </Link>
      <div className="flex flex-1 flex-col p-5">
        <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
          <h3 className="text-lg font-bold text-ink">
            <Link href={`/textures/${texture.slug}`} className="hover:text-clay-600">
              {t(texture.name)}
            </Link>
          </h3>
          <p className="shrink-0 text-end text-sm font-bold text-clay-600">
            <Rate texture={texture} badge className="justify-end" />
          </p>
        </div>
        <p className="mt-2 flex-1 text-sm leading-relaxed text-ink-soft">{t(texture.blurb)}</p>
        <div className="mt-4 flex items-center justify-between border-t border-line pt-4">
          <span className="flex items-center gap-1.5 text-xs font-medium text-ink-muted">
            <ShieldCheck aria-hidden="true" className="size-4 text-clay-500" /> {t(texture.feature)}
          </span>
          <Link
            href={`/textures/${texture.slug}`}
            className="flex items-center gap-0.5 text-[13px] font-bold text-clay-600 hover:text-clay-700"
          >
            {t("View & Estimate")} <ChevronRight aria-hidden="true" className="size-4 transition-transform group-hover:translate-x-0.5 rtl:-scale-x-100 rtl:group-hover:-translate-x-0.5" />
          </Link>
        </div>
      </div>
    </article>
  );
}
