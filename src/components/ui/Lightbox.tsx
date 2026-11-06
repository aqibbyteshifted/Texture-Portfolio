"use client";

import { useCallback, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import { ArrowRight, ChevronLeft, ChevronRight, MapPin, X } from "lucide-react";
import { useLocale, useT } from "@/i18n/client";
import { Button } from "@/components/ui/Button";
import { quoteHref } from "@/lib/quoteLink";
import { getTextureByCategory } from "@/data/textures";
import type { GalleryItem } from "@/data/gallery";

interface Props {
  items: GalleryItem[];
  index: number;
  onClose: () => void;
  onChange: (index: number) => void;
}

/** Accessible modal lightbox for photos and videos: Esc, arrow keys (RTL aware), swipe, focus trap, scroll lock. */
export function Lightbox({ items, index, onClose, onChange }: Props) {
  const t = useT();
  const rtl = useLocale() === "ur";
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const touchStart = useRef<number | null>(null);
  const item = items[index];

  const step = useCallback(
    (delta: number) => onChange((index + delta + items.length) % items.length),
    [index, items.length, onChange],
  );

  useEffect(() => {
    const previouslyFocused = document.activeElement as HTMLElement | null;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();
    return () => {
      document.body.style.overflow = previousOverflow;
      previouslyFocused?.focus?.();
    };
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") return onClose();
      if (e.key === "ArrowRight") return step(rtl ? -1 : 1);
      if (e.key === "ArrowLeft") return step(rtl ? 1 : -1);
      if (e.key === "Tab") {
        const focusable = dialogRef.current?.querySelectorAll<HTMLElement>("button, a[href], iframe, video");
        if (!focusable?.length) return;
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose, step, rtl]);

  const texture = getTextureByCategory(item.category);
  const prevLabel = t("Previous");
  const nextLabel = t("Next");

  return createPortal(
    <div
      ref={dialogRef}
      role="dialog"
      aria-modal="true"
      aria-label={item.title}
      className="fixed inset-0 z-[100] flex flex-col bg-black/96 text-white"
      onPointerDown={(e) => {
        touchStart.current = e.clientX;
      }}
      onPointerUp={(e) => {
        if (touchStart.current === null) return;
        const dx = e.clientX - touchStart.current;
        touchStart.current = null;
        if (Math.abs(dx) > 60) step(dx < 0 ? 1 : -1);
      }}
    >
      <div className="flex items-center justify-between gap-4 p-4">
        <p className="text-sm text-white/70 tnum" dir="ltr">
          {index + 1} / {items.length}
        </p>
        <button
          ref={closeRef}
          type="button"
          onClick={onClose}
          aria-label={t("Close")}
          className="grid size-11 place-items-center rounded-full bg-white/10 hover:bg-white/20"
        >
          <X aria-hidden="true" className="size-6" />
        </button>
      </div>

      <div className="relative min-h-0 flex-1" onClick={(e) => e.target === e.currentTarget && onClose()}>
        {item.type === "video" ? (
          <div className="absolute inset-0 grid place-items-center p-4">
            {item.youtubeId ? (
              <iframe
                title={item.title}
                src={`https://www.youtube-nocookie.com/embed/${item.youtubeId}?autoplay=1&rel=0`}
                allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
                allowFullScreen
                className="aspect-video w-full max-w-5xl rounded-lg"
              />
            ) : item.file ? (
              <video src={item.file} poster={item.src} controls autoPlay playsInline className="max-h-full w-full max-w-5xl rounded-lg" />
            ) : null}
          </div>
        ) : (
          <Image key={item.src} src={item.src} alt={item.title} fill sizes="100vw" className="object-contain p-2 sm:p-6" priority />
        )}

        <button
          type="button"
          onClick={() => step(-1)}
          aria-label={prevLabel}
          className="absolute start-2 top-1/2 grid size-12 -translate-y-1/2 place-items-center rounded-full bg-white/10 hover:bg-white/25 sm:start-5"
        >
          {rtl ? <ChevronRight aria-hidden="true" className="size-6" /> : <ChevronLeft aria-hidden="true" className="size-6" />}
        </button>
        <button
          type="button"
          onClick={() => step(1)}
          aria-label={nextLabel}
          className="absolute end-2 top-1/2 grid size-12 -translate-y-1/2 place-items-center rounded-full bg-white/10 hover:bg-white/25 sm:end-5"
        >
          {rtl ? <ChevronLeft aria-hidden="true" className="size-6" /> : <ChevronRight aria-hidden="true" className="size-6" />}
        </button>
      </div>

      <div className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between sm:px-8 sm:pb-6">
        <div>
          <p className="text-lg font-bold">{t(item.title)}</p>
          <p className="mt-0.5 flex items-center gap-1.5 text-sm text-white/70">
            <MapPin aria-hidden="true" className="size-4" /> {item.location} · {t(item.category)}
          </p>
        </div>
        <Button href={quoteHref({ texture: texture?.slug })} size="md" onClick={onClose}>
          {t("Get a quote like this")} <ArrowRight aria-hidden="true" className="size-4 rtl:-scale-x-100" />
        </Button>
      </div>
    </div>,
    document.body,
  );
}
