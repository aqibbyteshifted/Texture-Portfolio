"use client";

import { useMemo, useState } from "react";
import { Search, SearchX } from "lucide-react";
import { TextureCard } from "@/components/features/TextureCard";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/cn";
import { quoteHref } from "@/lib/quoteLink";
import type { Texture, TextureZone } from "@/types";

type ZoneFilter = "all" | TextureZone;
type Sort = "featured" | "price-asc" | "price-desc";

const zoneTabs: { value: ZoneFilter; label: string }[] = [
  { value: "all", label: "All Finishes" },
  { value: "exterior", label: "Exterior" },
  { value: "interior", label: "Interior" },
];

export function TextureCatalog({ items, initialZone = "all", showFilters = true }: { items: Texture[]; initialZone?: ZoneFilter; showFilters?: boolean }) {
  const [zone, setZone] = useState<ZoneFilter>(initialZone);
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState<Sort>("featured");

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    const filtered = items.filter(
      (t) =>
        (zone === "all" || t.zones.includes(zone)) &&
        (!q || `${t.name} ${t.category} ${t.blurb} ${t.feature}`.toLowerCase().includes(q)),
    );
    if (sort === "price-asc") return [...filtered].sort((a, b) => a.rate - b.rate);
    if (sort === "price-desc") return [...filtered].sort((a, b) => b.rate - a.rate);
    return filtered;
  }, [items, zone, query, sort]);

  return (
    <div>
      {showFilters && (
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div role="group" aria-label="Filter by environment" className="scrollbar-none -mx-4 flex gap-2 overflow-x-auto px-4 lg:mx-0 lg:px-0">
            {zoneTabs.map((tab) => (
              <button
                key={tab.value}
                type="button"
                aria-pressed={zone === tab.value}
                onClick={() => setZone(tab.value)}
                className={cn(
                  "h-10 shrink-0 rounded-full border px-5 text-sm font-semibold transition-colors",
                  zone === tab.value ? "border-ink bg-ink text-white" : "border-line-strong bg-surface text-ink-soft hover:bg-sunken",
                )}
              >
                {tab.label}
              </button>
            ))}
          </div>
          <div className="flex flex-col gap-3 sm:flex-row">
            <label className="relative block sm:w-64">
              <span className="sr-only">Search textures</span>
              <Search aria-hidden="true" className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-ink-muted" />
              <input
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search finishes…"
                className="h-10 w-full rounded-full border border-line-strong bg-surface pr-4 pl-9 text-sm focus:border-clay-500 focus:shadow-[0_0_0_3px_rgba(181,101,29,0.15)] focus:outline-none"
              />
            </label>
            <label className="block">
              <span className="sr-only">Sort finishes</span>
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value as Sort)}
                className="h-10 w-full rounded-full border border-line-strong bg-surface px-4 text-sm focus:border-clay-500 focus:outline-none"
              >
                <option value="featured">Featured</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
              </select>
            </label>
          </div>
        </div>
      )}

      {visible.length > 0 ? (
        <ul className={cn("grid gap-5 sm:grid-cols-2 lg:grid-cols-3", showFilters && "mt-8")} aria-live="polite">
          {visible.map((t, i) => (
            <li key={t.slug}>
              <TextureCard texture={t} priority={i < 3} />
            </li>
          ))}
        </ul>
      ) : (
        <div className="mt-10 rounded-card border border-dashed border-line-strong bg-surface p-10 text-center">
          <SearchX aria-hidden="true" className="mx-auto size-10 text-ink-muted" />
          <p className="mt-3 font-semibold text-ink">No finishes match your search</p>
          <p className="mt-1 text-sm text-ink-muted">Try a different keyword, or ask our engineers to recommend a finish.</p>
          <div className="mt-5 flex justify-center gap-3">
            <Button variant="secondary" onClick={() => { setQuery(""); setZone("all"); }}>
              Reset filters
            </Button>
            <Button href={quoteHref()}>Ask for a recommendation</Button>
          </div>
        </div>
      )}
    </div>
  );
}
