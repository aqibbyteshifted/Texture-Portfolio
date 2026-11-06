"use client";

import { useState } from "react";
import Image from "next/image";
import { Search, ShieldCheck, Sparkles } from "lucide-react";
import { TextureImage } from "@/components/ui/TextureImage";
import { useT } from "@/i18n/client";
import { cn } from "@/lib/cn";

interface Props {
  title: string;
  badge: string;
  highlight: string;
  swatch: string;
  /** Primary photo; when missing a generated placeholder is shown. */
  main?: string;
  images: { src: string; label: string }[];
}

export function TextureGallery({ title, badge, highlight, swatch, main, images }: Props) {
  const t = useT();
  const all = [{ src: main, label: "Macro Detail" }, ...images];
  const [active, setActive] = useState(0);

  return (
    <div>
      <div className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-ink shadow-lift">
        {all.map((img, i) => (
          <div key={`${img.src ?? "placeholder"}-${i}`} className={cn("absolute inset-0 transition-opacity duration-500", i === active ? "opacity-100" : "opacity-0")}>
            <TextureImage
              src={img.src}
              alt={`${title}: ${img.label}`}
              swatch={swatch}
              priority={i === 0}
              sizes="(min-width: 1024px) 600px, 100vw"
            />
          </div>
        ))}
        <span className="absolute start-4 top-4 flex items-center gap-1.5 rounded-full bg-surface/95 px-3 py-1.5 text-xs font-bold shadow-sm">
          <ShieldCheck aria-hidden="true" className="size-4 text-clay-500" /> {badge}
        </span>
        <span className="absolute inset-x-4 bottom-4 flex items-center justify-between gap-2 text-[11px] font-semibold text-white">
          <span className="flex items-center gap-1.5 rounded-full bg-black/55 px-3 py-1.5 backdrop-blur">
            <Search aria-hidden="true" className="size-3.5" /> {t(all[active].label)}
          </span>
          <span className="flex items-center gap-1.5 rounded-full bg-black/55 px-3 py-1.5 backdrop-blur">
            <Sparkles aria-hidden="true" className="size-3.5" /> {highlight}
          </span>
        </span>
      </div>

      {all.length > 1 && (
        <ul className="mt-3 grid grid-cols-4 gap-3" aria-label={t("Gallery thumbnails")}>
          {all.map((img, i) => (
            <li key={`${img.src ?? "placeholder"}-${i}`}>
              <button
                type="button"
                aria-label={`${t("Show")} ${t(img.label)}`}
                aria-pressed={i === active}
                onClick={() => setActive(i)}
                className={cn(
                  "relative block aspect-square w-full overflow-hidden rounded-lg border-2 transition-all",
                  i === active ? "border-clay-500" : "border-transparent opacity-75 hover:opacity-100",
                )}
              >
                {img.src ? (
                  <Image src={img.src} alt="" fill sizes="140px" className="object-cover" />
                ) : (
                  <TextureImage alt="" swatch={swatch} />
                )}
                <span className="absolute inset-x-0 bottom-0 bg-black/55 py-0.5 text-[10px] font-semibold text-white">{t(img.label)}</span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
