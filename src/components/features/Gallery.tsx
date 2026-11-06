"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import { Expand, Play } from "lucide-react";
import { Lightbox } from "@/components/ui/Lightbox";
import { useT } from "@/i18n/client";
import { cn } from "@/lib/cn";
import type { GalleryItem } from "@/data/gallery";

export function Gallery({ items }: { items: GalleryItem[] }) {
  const t = useT();
  const [filter, setFilter] = useState("All");
  const [open, setOpen] = useState<number | null>(null);

  const categories = useMemo(() => ["All", ...Array.from(new Set(items.map((i) => i.category)))], [items]);
  const visible = useMemo(() => items.filter((i) => filter === "All" || i.category === filter), [items, filter]);

  return (
    <div>
      <div role="group" aria-label={t("Filter gallery")} className="scrollbar-none -mx-4 flex gap-2 overflow-x-auto px-4 pb-1 sm:mx-0 sm:flex-wrap sm:justify-center sm:px-0">
        {categories.map((c) => (
          <button
            key={c}
            type="button"
            aria-pressed={filter === c}
            onClick={() => setFilter(c)}
            className={cn(
              "h-9 shrink-0 rounded-full border px-4 text-[13px] font-semibold transition-colors",
              filter === c ? "border-ink bg-ink text-white" : "border-line-strong bg-surface text-ink-soft hover:bg-sunken",
            )}
          >
            {t(c)}
          </button>
        ))}
      </div>

      <ul className="mt-6 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4" aria-live="polite">
        {visible.map((item, i) => (
          <li key={item.id} className={cn(i % 7 === 0 && "col-span-2 row-span-2")}>
            <button
              type="button"
              onClick={() => setOpen(i)}
              aria-label={`${t("Open")}: ${t(item.title)}`}
              className="group relative block aspect-[4/3] size-full overflow-hidden rounded-xl bg-sunken"
            >
              <Image
                src={item.src}
                alt={t(item.title)}
                fill
                sizes={i % 7 === 0 ? "(min-width: 1024px) 50vw, 100vw" : "(min-width: 1024px) 25vw, 50vw"}
                className="object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <span className="absolute inset-0 bg-gradient-to-t from-black/65 via-transparent to-transparent opacity-80 transition-opacity group-hover:opacity-100" />
              <span className="absolute inset-x-3 bottom-3 text-start text-white">
                <span className="block text-sm leading-tight font-bold">{t(item.title)}</span>
                <span className="mt-0.5 block text-[11px] text-white/75">{item.location}</span>
              </span>
              <span className="absolute end-3 top-3 grid size-9 place-items-center rounded-full bg-black/50 text-white backdrop-blur">
                {item.type === "video" ? <Play aria-hidden="true" className="size-4 fill-current" /> : <Expand aria-hidden="true" className="size-4" />}
              </span>
            </button>
          </li>
        ))}
      </ul>

      {open !== null && <Lightbox items={visible} index={open} onClose={() => setOpen(null)} onChange={setOpen} />}
    </div>
  );
}
