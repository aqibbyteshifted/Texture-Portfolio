"use client";

import { useState } from "react";
import { Printer } from "lucide-react";
import { prepChecklist } from "@/data/guides";
import { useT } from "@/i18n/client";
import { cn } from "@/lib/cn";

const total = prepChecklist.reduce((n, g) => n + g.items.length, 0);

/** Tick-off checklist. The Print button gives a clean sheet (header, footer and buttons are hidden when printing). */
export function PrepChecklist() {
  const t = useT();
  const [done, setDone] = useState<string[]>([]);
  const toggle = (k: string) => setDone((d) => (d.includes(k) ? d.filter((x) => x !== k) : [...d, k]));

  return (
    <div>
      <div className="no-print mb-6 flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm font-semibold text-ink-soft" aria-live="polite">
          {done.length} / {total} {t("done")}
        </p>
        <button type="button" onClick={() => window.print()} className="inline-flex h-10 items-center gap-2 rounded-control border border-line-strong bg-surface px-4 text-sm font-semibold hover:bg-sunken">
          <Printer aria-hidden="true" className="size-4" /> {t("Print or save as PDF")}
        </button>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {prepChecklist.map((g) => (
          <section key={g.id} className="break-inside-avoid rounded-2xl border border-line bg-surface p-5 shadow-card sm:p-6">
            <h2 className="text-lg font-bold"><bdi>{g.title}</bdi></h2>
            <ul className="mt-4 grid gap-3">
              {g.items.map((item) => {
                const key = `${g.id}:${item}`;
                const on = done.includes(key);
                return (
                  <li key={key}>
                    <label className="flex cursor-pointer items-start gap-3 text-sm">
                      <input type="checkbox" checked={on} onChange={() => toggle(key)} className="mt-0.5 size-4 shrink-0 accent-[#9a741f]" />
                      <span className={cn("leading-relaxed", on ? "text-ink-muted line-through" : "text-ink-soft")}><bdi>{item}</bdi></span>
                    </label>
                  </li>
                );
              })}
            </ul>
          </section>
        ))}
      </div>
    </div>
  );
}
