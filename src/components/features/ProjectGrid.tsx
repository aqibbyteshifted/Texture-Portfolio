"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import { ArrowUpRight, CalendarCheck, MapPin } from "lucide-react";
import { cn } from "@/lib/cn";
import type { Project } from "@/types";

interface Props {
  projects: Project[];
  /** "work": image-led cards (home). "spec": adds contract-scope footer (product page). */
  variant?: "work" | "spec";
  filterBy?: "sector" | "texture";
}

export function ProjectGrid({ projects, variant = "work", filterBy = "sector" }: Props) {
  const options = useMemo(() => {
    const values = filterBy === "sector" ? projects.map((p) => p.sector) : projects.flatMap((p) => p.textures);
    return ["All", ...Array.from(new Set(values))];
  }, [projects, filterBy]);
  const [active, setActive] = useState("All");

  const visible = projects.filter(
    (p) => active === "All" || (filterBy === "sector" ? p.sector === active : p.textures.includes(active)),
  );

  return (
    <div>
      {options.length > 2 && (
        <div role="group" aria-label="Filter projects" className="scrollbar-none -mx-4 flex gap-2 overflow-x-auto px-4 pb-1 sm:mx-0 sm:px-0">
          {options.map((o) => (
            <button
              key={o}
              type="button"
              aria-pressed={active === o}
              onClick={() => setActive(o)}
              className={cn(
                "h-9 shrink-0 rounded-full border px-4 text-[13px] font-semibold transition-colors",
                active === o
                  ? "border-ink bg-ink text-white"
                  : "border-line-strong bg-surface text-ink-soft hover:bg-sunken",
              )}
            >
              {o}
            </button>
          ))}
        </div>
      )}

      <ul className={cn("grid gap-5 sm:grid-cols-2 lg:grid-cols-3", options.length > 2 && "mt-6")}>
        {visible.map((p) => (
          <li key={p.id} className="group overflow-hidden rounded-card border border-line bg-surface shadow-card transition-shadow hover:shadow-lift">
            <div className="relative aspect-[4/3] overflow-hidden">
              <Image
                src={p.image}
                alt={`${p.title}, ${p.location}`}
                fill
                sizes="(min-width: 1024px) 380px, (min-width: 640px) 50vw, 100vw"
                className="object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-transparent" />
              {(p.badge || p.type) && (
                <span className="absolute bottom-3 left-3 rounded-md bg-black/55 px-2.5 py-1 text-[11px] font-semibold text-white backdrop-blur">
                  {p.badge ?? p.type}
                </span>
              )}
            </div>
            <div className="p-5">
              <div className="flex items-center justify-between gap-3 text-xs text-ink-muted">
                <span className="flex items-center gap-1 font-semibold text-clay-600">
                  <MapPin aria-hidden="true" className="size-3.5" /> {p.location}
                </span>
                <span className="flex items-center gap-1">
                  <CalendarCheck aria-hidden="true" className="size-3.5" /> {variant === "spec" ? `Completed ${p.completed}` : p.type}
                </span>
              </div>
              <h3 className="mt-2 text-lg font-bold text-ink">{p.title}</h3>
              <p className="mt-1.5 text-sm leading-relaxed text-ink-soft">{p.description}</p>
              {variant === "spec" && (
                <div className="mt-4 flex items-center justify-between border-t border-line pt-3 text-xs">
                  <span className="text-ink-muted">Contract Scope</span>
                  <span className="flex items-center gap-1 font-semibold text-ink">
                    {p.scope} <ArrowUpRight aria-hidden="true" className="size-3.5 text-clay-500" />
                  </span>
                </div>
              )}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
