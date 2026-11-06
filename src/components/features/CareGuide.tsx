"use client";

import { useId, useState } from "react";
import { ChevronDown } from "lucide-react";
import { useT } from "@/i18n/client";
import { cn } from "@/lib/cn";

interface Item {
  slug: string;
  name: string;
  tips: string[];
}

export function CareGuide({ items }: { items: Item[] }) {
  const t = useT();
  const base = useId();
  const [open, setOpen] = useState<string | null>(items[0]?.slug ?? null);

  return (
    <div className="divide-y divide-line overflow-hidden rounded-card border border-line bg-surface shadow-card">
      {items.map((item) => {
        const expanded = open === item.slug;
        const panel = `${base}-${item.slug}`;
        return (
          <div key={item.slug}>
            <h3 className="font-sans text-base tracking-normal">
              <button
                type="button"
                aria-expanded={expanded}
                aria-controls={panel}
                onClick={() => setOpen(expanded ? null : item.slug)}
                className="flex w-full items-center justify-between gap-4 px-5 py-4 text-start font-semibold hover:bg-canvas"
              >
                <span>{t(item.name)}</span>
                <ChevronDown aria-hidden="true" className={cn("size-5 shrink-0 text-clay-500 transition-transform", expanded && "rotate-180")} />
              </button>
            </h3>
            <div id={panel} role="region" hidden={!expanded}>
              <ul className="list-disc space-y-1.5 px-5 pb-5 ps-10 text-sm leading-relaxed text-ink-soft marker:text-clay-500" lang="en" dir="auto">
                {item.tips.map((tip) => (
                  <li key={tip}>{tip}</li>
                ))}
              </ul>
            </div>
          </div>
        );
      })}
    </div>
  );
}
