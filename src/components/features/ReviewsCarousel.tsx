"use client";

import { useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, Quote, Star } from "lucide-react";
import { cn } from "@/lib/cn";
import type { Testimonial } from "@/types";

/** Scroll-snap carousel on small screens (swipe, arrows, dots), 3-up grid on desktop. */
export function ReviewsCarousel({ items }: { items: Testimonial[] }) {
  const track = useRef<HTMLUListElement>(null);
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const el = track.current;
    if (!el) return;
    const onScroll = () => {
      const child = el.children[0] as HTMLElement | undefined;
      if (!child) return;
      setIndex(Math.round(el.scrollLeft / (child.offsetWidth + 20)));
    };
    el.addEventListener("scroll", onScroll, { passive: true });
    return () => el.removeEventListener("scroll", onScroll);
  }, []);

  const go = (i: number) => {
    const el = track.current;
    const child = el?.children[i] as HTMLElement | undefined;
    if (el && child) el.scrollTo({ left: child.offsetLeft - el.offsetLeft, behavior: "smooth" });
  };

  return (
    <div>
      <ul
        ref={track}
        className="scrollbar-none -mx-4 flex snap-x snap-mandatory gap-5 overflow-x-auto px-4 pb-2 lg:mx-0 lg:grid lg:grid-cols-3 lg:overflow-visible lg:px-0"
        aria-label="Customer reviews"
      >
        {items.map((t) => (
          <li
            key={t.id}
            className="relative flex w-[86%] shrink-0 snap-center flex-col rounded-card border border-line bg-surface p-6 shadow-card sm:w-[60%] lg:w-auto"
          >
            <Quote aria-hidden="true" className="absolute top-5 right-5 size-8 text-clay-100" />
            <div className="flex gap-0.5 text-amber-500" role="img" aria-label={`${t.rating} out of 5 stars`}>
              {Array.from({ length: t.rating }).map((_, i) => (
                <Star key={i} aria-hidden="true" className="size-4 fill-current" />
              ))}
            </div>
            <blockquote className="mt-4 flex-1 text-[15px] leading-relaxed text-ink-soft">“{t.quote}”</blockquote>
            <div className="mt-5 flex items-center gap-3 border-t border-line pt-4">
              <span className="grid size-10 place-items-center rounded-full bg-clay-100 font-bold text-clay-600">
                {t.name.charAt(0)}
              </span>
              <span>
                <span className="block text-sm font-bold text-ink">{t.name}</span>
                <span className="block text-xs text-ink-muted">{t.meta}</span>
              </span>
            </div>
          </li>
        ))}
      </ul>

      <div className="mt-5 flex items-center justify-center gap-3 lg:hidden">
        <button type="button" aria-label="Previous review" onClick={() => go(Math.max(0, index - 1))} className="grid size-10 place-items-center rounded-full border border-line-strong bg-surface">
          <ChevronLeft aria-hidden="true" className="size-5" />
        </button>
        <div className="flex gap-2" aria-hidden="true">
          {items.map((t, i) => (
            <span key={t.id} className={cn("h-2 rounded-full transition-all", i === index ? "w-6 bg-clay-500" : "w-2 bg-line-strong")} />
          ))}
        </div>
        <button type="button" aria-label="Next review" onClick={() => go(Math.min(items.length - 1, index + 1))} className="grid size-10 place-items-center rounded-full border border-line-strong bg-surface">
          <ChevronRight aria-hidden="true" className="size-5" />
        </button>
      </div>
    </div>
  );
}
