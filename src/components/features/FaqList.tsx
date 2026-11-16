"use client";

import { useId, useMemo, useState } from "react";
import { Search } from "lucide-react";
import { Accordion } from "@/components/ui/Accordion";
import { useT } from "@/i18n/client";

interface Item {
  id: string;
  question: string;
  answer: string;
}

/** Words people actually type (including Roman Urdu) mapped to the English words used in the answers. */
const synonyms: string[][] = [
  ["price", "rate", "cost", "qeemat", "kimat", "kharcha", "paisa", "rupee", "pkr", "budget"],
  ["rain", "monsoon", "baarish", "barish", "paani", "pani", "water", "seelan", "damp"],
  ["warranty", "guarantee", "waranty", "claim"],
  ["time", "days", "din", "waqt", "duration", "kitna"],
  ["pay", "payment", "advance", "worker", "karigar", "receipt"],
  ["old", "purani", "painted", "paint", "distemper"],
  ["outside", "baahar", "exterior", "boundary", "elevation"],
  ["inside", "andar", "interior"],
  ["city", "shehar", "punjab", "outstation", "islamabad", "faisalabad"],
];

const expand = (word: string) => synonyms.find((g) => g.includes(word)) ?? [word];

/** FAQ accordion with a search box. Typing "baarish" finds the monsoon answer. */
export function FaqList({ items }: { items: Item[] }) {
  const t = useT();
  const id = useId();
  const [q, setQ] = useState("");

  const shown = useMemo(() => {
    const words = q.toLowerCase().split(/\s+/).filter(Boolean);
    if (words.length === 0) return items;
    return items.filter((it) => {
      const hay = `${it.question} ${it.answer}`.toLowerCase();
      return words.every((w) => expand(w).some((s) => hay.includes(s)));
    });
  }, [items, q]);

  return (
    <div>
      <div className="relative mb-4">
        <label htmlFor={id} className="sr-only">{t("Search questions")}</label>
        <Search aria-hidden="true" className="pointer-events-none absolute start-3.5 top-1/2 size-4 -translate-y-1/2 text-ink-muted" />
        <input
          id={id}
          type="search"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder={t("Search questions, e.g. rate, rain, warranty")}
          className="h-12 w-full rounded-control border border-line-strong bg-surface ps-10 pe-4 text-sm text-ink focus:border-brand-500 focus:shadow-[0_0_0_3px_rgba(154,116,31,0.15)] focus:outline-none"
        />
      </div>
      {shown.length > 0 ? (
        <Accordion key={q ? "filtered" : "all"} items={shown} defaultOpen={q ? shown[0].id : items[0]?.id} />
      ) : (
        <p className="rounded-card border border-line bg-surface p-6 text-center text-sm text-ink-soft" aria-live="polite">
          {t("No matching question. Message us on WhatsApp and we will reply as soon as we can.")}
        </p>
      )}
    </div>
  );
}
