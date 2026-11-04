"use client";

import { useCallback, useRef, useState } from "react";
import Image from "next/image";
import { ArrowLeftRight } from "lucide-react";

interface Props {
  before: string;
  after: string;
  beforeLabel?: string;
  afterLabel?: string;
}

/** Pointer-draggable + keyboard-accessible comparison slider (role=slider). */
export function BeforeAfterSlider({
  before,
  after,
  beforeLabel = "BEFORE: Raw Plaster Substrate",
  afterLabel = "AFTER: Italian Travertine Finish",
}: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState(50);
  const [dragging, setDragging] = useState(false);

  const moveTo = useCallback((clientX: number) => {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect || rect.width === 0) return;
    setPos(Math.min(100, Math.max(0, ((clientX - rect.left) / rect.width) * 100)));
  }, []);

  return (
    <div
      ref={ref}
      className="relative aspect-[4/3] w-full touch-pan-y overflow-hidden rounded-2xl bg-ink select-none sm:aspect-[16/8]"
      onPointerDown={(e) => {
        e.currentTarget.setPointerCapture(e.pointerId);
        setDragging(true);
        moveTo(e.clientX);
      }}
      onPointerMove={(e) => dragging && moveTo(e.clientX)}
      onPointerUp={() => setDragging(false)}
      onPointerCancel={() => setDragging(false)}
    >
      <Image src={after} alt={afterLabel} fill sizes="(min-width: 1280px) 1200px, 100vw" className="object-cover" draggable={false} />

      <div className="absolute inset-0" style={{ clipPath: `inset(0 ${100 - pos}% 0 0)` }}>
        <Image
          src={before}
          alt={beforeLabel}
          fill
          sizes="(min-width: 1280px) 1200px, 100vw"
          className="object-cover grayscale-[35%] contrast-90"
          draggable={false}
        />
      </div>

      <span className="pointer-events-none absolute top-4 left-4 rounded-full bg-black/60 px-3 py-1.5 text-[11px] font-semibold tracking-wide text-white backdrop-blur">
        {beforeLabel}
      </span>
      <span className="pointer-events-none absolute top-4 right-4 rounded-full bg-clay-500/90 px-3 py-1.5 text-[11px] font-semibold tracking-wide text-white backdrop-blur">
        {afterLabel}
      </span>

      <div className="pointer-events-none absolute inset-y-0 w-0.5 -translate-x-1/2 bg-white shadow-lg" style={{ left: `${pos}%` }}>
        <div
          role="slider"
          tabIndex={0}
          aria-label="Before and after comparison"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={Math.round(pos)}
          aria-valuetext={`${Math.round(pos)}% before`}
          onKeyDown={(e) => {
            const step = e.shiftKey ? 15 : 5;
            if (e.key === "ArrowLeft" || e.key === "ArrowDown") setPos((p) => Math.max(0, p - step));
            else if (e.key === "ArrowRight" || e.key === "ArrowUp") setPos((p) => Math.min(100, p + step));
            else if (e.key === "Home") setPos(0);
            else if (e.key === "End") setPos(100);
            else return;
            e.preventDefault();
          }}
          className="pointer-events-auto absolute top-1/2 left-1/2 grid size-12 -translate-x-1/2 -translate-y-1/2 cursor-ew-resize place-items-center rounded-full bg-white text-clay-600 shadow-modal focus-visible:ring-4 focus-visible:ring-sand-500/50"
        >
          <ArrowLeftRight aria-hidden="true" className="size-5" />
        </div>
      </div>
    </div>
  );
}
