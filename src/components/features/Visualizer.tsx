"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import { ArrowRight, Download, Eye, ImagePlus, Redo2, Undo2, Eraser, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { WhatsAppIcon } from "@/components/ui/icons";
import { getShades } from "@/data/shades";
import { textures } from "@/data/textures";
import { useT } from "@/i18n/client";
import { msg } from "@/i18n/config";
import { track } from "@/lib/analytics";
import { cn } from "@/lib/cn";
import { quoteHref } from "@/lib/quoteLink";
import { whatsappLink } from "@/lib/whatsapp";
import {
  buildAlpha,
  buildEdgeMap,
  combineMask,
  floodSelect,
  hexToRgb,
  makePattern,
  maskCoverage,
  recolor,
  type Pattern,
  type PatternKind,
} from "@/lib/visualizer";

const MAX_W = 960;
const MAX_FILE_MB = 15;
const MAX_HISTORY = 15;

interface Sample {
  id: string;
  src: string;
  label: string;
  /** Wall start point as a fraction of the image, so the effect is visible straight away */
  seed: [number, number];
  tolerance: number;
}

const samples: Sample[] = [
  { id: "terracotta", src: "/images/tex-colorcrete.jpg", label: msg("Terracotta room"), seed: [0.5, 0.3], tolerance: 30 },
  { id: "feature", src: "/images/after.jpg", label: msg("Feature wall"), seed: [0.3, 0.35], tolerance: 30 },
  { id: "lounge", src: "/images/tex-stucco.jpg", label: msg("Lounge wall"), seed: [0.5, 0.5], tolerance: 20 },
];

const effects: { kind: PatternKind; label: string }[] = [
  { kind: "smooth", label: msg("Smooth") },
  { kind: "fine", label: msg("Fine grain") },
  { kind: "coarse", label: msg("Coarse stone") },
  { kind: "veins", label: msg("Veined") },
  { kind: "speckle", label: msg("Speckled") },
  { kind: "cloud", label: msg("Cloudy") },
];

const effectFor: Record<string, PatternKind> = {
  "rockwall-aggregates": "coarse",
  "stucco-antico": "smooth",
  "mediterranean-graffiato": "coarse",
  "wash-terrazzo": "speckle",
  "italian-travertine": "veins",
  "nugdi-texture": "coarse",
  "velvet-paint": "smooth",
  limewash: "cloud",
  microcement: "cloud",
  "epoxy-flooring": "smooth",
};

export function Visualizer() {
  const t = useT();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const baseRef = useRef<ImageData | null>(null);
  const maskRef = useRef<Uint8Array | null>(null);
  const alphaRef = useRef<Uint8Array | null>(null);
  const edgesRef = useRef<Float32Array | null>(null);
  const historyRef = useRef<Uint8Array[]>([]);
  const futureRef = useRef<Uint8Array[]>([]);
  const patterns = useRef(new Map<PatternKind, Pattern | null>());
  const frame = useRef(0);
  const trackedUse = useRef(false);

  const [source, setSource] = useState<string>("terracotta");
  const [loaded, setLoaded] = useState(false);
  const [loadError, setLoadError] = useState<string>();
  const [tick, setTick] = useState(0);
  const [coverage, setCoverage] = useState(0);
  const [status, setStatus] = useState("");
  const [tolerance, setTolerance] = useState(30);
  const [mode, setMode] = useState<"add" | "remove">("add");
  const [textureSlug, setTextureSlug] = useState("italian-travertine");
  const [shadeIdx, setShadeIdx] = useState(2);
  const [custom, setCustom] = useState<string | null>(null);
  const [effect, setEffect] = useState<PatternKind>("veins");
  const [grain, setGrain] = useState(60);
  const [showOriginal, setShowOriginal] = useState(false);
  const [cursor, setCursor] = useState({ x: 0.5, y: 0.5 });
  const [focused, setFocused] = useState(false);

  const texture = textures.find((x) => x.slug === textureSlug) ?? textures[0];
  const shades = useMemo(() => getShades(texture.slug), [texture.slug]);
  const shade = shades[Math.min(shadeIdx, shades.length - 1)];
  const colorHex = custom ?? shade?.hex ?? texture.swatch;

  const getPattern = useCallback((kind: PatternKind) => {
    if (!patterns.current.has(kind)) patterns.current.set(kind, makePattern(kind, 256, 11));
    return patterns.current.get(kind) ?? null;
  }, []);

  /* ---------- drawing ---------- */
  useEffect(() => {
    cancelAnimationFrame(frame.current);
    frame.current = requestAnimationFrame(() => {
      const canvas = canvasRef.current;
      const base = baseRef.current;
      if (!canvas || !base) return;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      const alpha = alphaRef.current;
      if (showOriginal || !alpha || coverage === 0) ctx.putImageData(base, 0, 0);
      else ctx.putImageData(recolor(base, alpha, { color: hexToRgb(colorHex), pattern: getPattern(effect), grain: grain / 100 }), 0, 0);
    });
    return () => cancelAnimationFrame(frame.current);
  }, [tick, loaded, coverage, colorHex, effect, grain, showOriginal, getPattern]);

  /* ---------- selection ---------- */
  const commitMask = useCallback((next: Uint8Array, pushHistory = true) => {
    const base = baseRef.current;
    if (!base) return;
    if (pushHistory && maskRef.current) {
      historyRef.current.push(maskRef.current);
      if (historyRef.current.length > MAX_HISTORY) historyRef.current.shift();
      futureRef.current = [];
    }
    maskRef.current = next;
    alphaRef.current = buildAlpha(next, base.width, base.height);
    const cov = maskCoverage(next);
    setCoverage(cov);
    setTick((n) => n + 1);
    return cov;
  }, []);

  const selectAt = useCallback(
    (x: number, y: number, opts?: { tolerance?: number; mode?: "add" | "remove"; silent?: boolean }) => {
      const base = baseRef.current;
      const mask = maskRef.current;
      if (!base || !mask) return;
      const region = floodSelect(base.data, base.width, base.height, x, y, opts?.tolerance ?? tolerance, edgesRef.current ?? undefined);
      const cov = commitMask(combineMask(mask, region, opts?.mode ?? mode));
      if (cov === undefined) return;
      const removing = (opts?.mode ?? mode) === "remove";
      setStatus(
        cov > 0
          ? t("Wall selected: {pct}% of the photo", { pct: Math.round(cov * 100) })
          : removing
            ? t("Selection cleared")
            : t("Nothing selected. Try a higher tolerance or tap a different spot."),
      );
      if (cov > 0 && !opts?.silent && !trackedUse.current) {
        trackedUse.current = true;
        track("visualizer_use", { texture: texture.name });
      }
    },
    [commitMask, mode, t, texture.name, tolerance],
  );

  const undo = () => {
    const prev = historyRef.current.pop();
    if (!prev || !maskRef.current) return;
    futureRef.current.push(maskRef.current);
    commitMask(prev, false);
    setStatus(t("Undone"));
  };
  const redo = () => {
    const next = futureRef.current.pop();
    if (!next || !maskRef.current) return;
    historyRef.current.push(maskRef.current);
    commitMask(next, false);
  };
  const clear = () => {
    const base = baseRef.current;
    if (!base) return;
    commitMask(new Uint8Array(base.width * base.height));
    setStatus(t("Selection cleared"));
  };

  /* ---------- loading photos ---------- */
  const installImage = useCallback(
    (source: CanvasImageSource, naturalW: number, naturalH: number, seedFrom?: Sample) => {
      const scale = Math.min(1, MAX_W / naturalW);
      const w = Math.max(1, Math.round(naturalW * scale));
      const h = Math.max(1, Math.round(naturalH * scale));
      const off = document.createElement("canvas");
      off.width = w;
      off.height = h;
      const octx = off.getContext("2d", { willReadFrequently: true });
      if (!octx) return;
      octx.drawImage(source, 0, 0, w, h);
      const canvas = canvasRef.current;
      if (canvas) {
        canvas.width = w;
        canvas.height = h;
      }
      baseRef.current = octx.getImageData(0, 0, w, h);
      edgesRef.current = buildEdgeMap(baseRef.current.data, w, h);
      maskRef.current = new Uint8Array(w * h);
      alphaRef.current = new Uint8Array(w * h);
      historyRef.current = [];
      futureRef.current = [];
      setCoverage(0);
      setShowOriginal(false);
      setLoaded(true);
      setLoadError(undefined);
      setTick((n) => n + 1);
      if (seedFrom) {
        setTolerance(seedFrom.tolerance);
        selectAt(Math.round(seedFrom.seed[0] * w), Math.round(seedFrom.seed[1] * h), { tolerance: seedFrom.tolerance, mode: "add", silent: true });
      } else {
        setStatus(t("Photo loaded. Tap the wall you want to change."));
      }
    },
    [selectAt, t],
  );

  const loadSample = useCallback(
    async (s: Sample) => {
      setSource(s.id);
      setLoaded(false);
      try {
        const img = new window.Image();
        img.src = s.src;
        await img.decode();
        installImage(img, img.naturalWidth, img.naturalHeight, s);
      } catch {
        setLoadError(t("Could not load this photo."));
      }
    },
    [installImage, t],
  );

  const loadFile = async (file: File | undefined) => {
    if (!file) return;
    if (!/^image\/(jpeg|png|webp)$/.test(file.type)) return setLoadError(t("Please choose a JPG, PNG or WebP photo."));
    if (file.size > MAX_FILE_MB * 1024 * 1024) return setLoadError(t("That photo is too large (max {mb} MB).", { mb: MAX_FILE_MB }));
    setSource("upload");
    setLoaded(false);
    try {
      let bitmap: ImageBitmap;
      try {
        bitmap = await createImageBitmap(file, { imageOrientation: "from-image" });
      } catch {
        bitmap = await createImageBitmap(file);
      }
      installImage(bitmap, bitmap.width, bitmap.height);
      bitmap.close?.();
    } catch {
      setLoadError(t("Could not read that photo. Try another one."));
    }
  };

  useEffect(() => {
    void loadSample(samples[0]);
    // load the first sample once on mount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* ---------- pointer + keyboard ---------- */
  const onPointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas || !loaded) return;
    const rect = canvas.getBoundingClientRect();
    const x = Math.floor(((e.clientX - rect.left) / rect.width) * canvas.width);
    const y = Math.floor(((e.clientY - rect.top) / rect.height) * canvas.height);
    selectAt(x, y);
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLCanvasElement>) => {
    const step = e.shiftKey ? 0.12 : 0.04;
    const move = (dx: number, dy: number) => {
      e.preventDefault();
      setCursor((c) => ({ x: Math.min(0.999, Math.max(0, c.x + dx)), y: Math.min(0.999, Math.max(0, c.y + dy)) }));
    };
    if (e.key === "ArrowLeft") move(-step, 0);
    else if (e.key === "ArrowRight") move(step, 0);
    else if (e.key === "ArrowUp") move(0, -step);
    else if (e.key === "ArrowDown") move(0, step);
    else if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      const base = baseRef.current;
      if (base) selectAt(Math.floor(cursor.x * base.width), Math.floor(cursor.y * base.height));
    }
  };

  /* ---------- finish choices ---------- */
  const pickTexture = (slug: string) => {
    setTextureSlug(slug);
    setShadeIdx(0);
    setCustom(null);
    setEffect(effectFor[slug] ?? "smooth");
  };

  /* ---------- export ---------- */
  const download = () => {
    const canvas = canvasRef.current;
    if (!canvas || !loaded) return;
    const out = document.createElement("canvas");
    out.width = canvas.width;
    out.height = canvas.height;
    const ctx = out.getContext("2d");
    if (!ctx) return;
    ctx.drawImage(canvas, 0, 0);
    const label = `Zain & Co  •  ${texture.name}  •  ${custom ? custom.toUpperCase() : shade?.name ?? ""}`;
    const fs = Math.max(12, Math.round(out.width / 60));
    ctx.font = `600 ${fs}px sans-serif`;
    const padX = fs, boxH = fs * 2;
    const textW = ctx.measureText(label).width;
    ctx.fillStyle = "rgba(31,31,31,0.65)";
    ctx.fillRect(0, out.height - boxH, textW + padX * 2, boxH);
    ctx.fillStyle = "#fff";
    ctx.textBaseline = "middle";
    ctx.fillText(label, padX, out.height - boxH / 2);
    out.toBlob((blob) => {
      if (!blob) return;
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "zain-and-co-visualizer.png";
      a.click();
      setTimeout(() => URL.revokeObjectURL(url), 2000);
      track("visualizer_download", { texture: texture.name });
    }, "image/png");
  };

  const hasSelection = coverage > 0;
  const crossStyle = { left: `${cursor.x * 100}%`, top: `${cursor.y * 100}%` };

  return (
    <div className="grid gap-8 lg:grid-cols-[1.35fr_1fr] lg:items-start">
      {/* Canvas */}
      <div className="lg:sticky lg:top-24">
        <div className="relative overflow-hidden rounded-2xl bg-ink shadow-lift">
          <canvas
            ref={canvasRef}
            role="img"
            aria-label={t("Photo of a room. Tap or click a wall to recolour it. Use arrow keys and Enter to select with the keyboard.")}
            tabIndex={0}
            onPointerDown={onPointerDown}
            onKeyDown={onKeyDown}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            className="block h-auto w-full cursor-crosshair touch-manipulation outline-offset-2"
            data-testid="viz-canvas"
          />
          {focused && loaded && (
            <span aria-hidden="true" className="pointer-events-none absolute size-8 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white shadow-[0_0_0_2px_rgba(0,0,0,0.5)]" style={crossStyle} />
          )}
          {!loaded && !loadError && <div className="absolute inset-0 grid place-items-center bg-ink/60 text-sm font-semibold text-white">{t("Loading photo…")}</div>}
          {showOriginal && loaded && (
            <span className="pointer-events-none absolute start-3 top-3 rounded-full bg-black/60 px-3 py-1 text-[11px] font-bold text-white">{t("Original")}</span>
          )}
          {loaded && !hasSelection && (
            <span className="pointer-events-none absolute inset-x-3 bottom-3 rounded-lg bg-black/65 px-3 py-2 text-center text-sm font-semibold text-white backdrop-blur">
              {t("Tap the wall you want to change")}
            </span>
          )}
        </div>
        <p role="status" aria-live="polite" className="mt-3 min-h-5 text-center text-sm text-ink-soft" data-testid="viz-status">
          {loadError ?? status}
        </p>
      </div>

      {/* Controls */}
      <div className="grid gap-6">
        <section className="rounded-2xl border border-line bg-surface p-5 shadow-card">
          <h2 className="text-base font-bold">{t("1. Choose a room")}</h2>
          <ul className="mt-3 grid grid-cols-4 gap-2.5">
            {samples.map((s) => (
              <li key={s.id}>
                <button
                  type="button"
                  aria-pressed={source === s.id}
                  aria-label={t(s.label)}
                  onClick={() => loadSample(s)}
                  className={cn("relative block aspect-square w-full overflow-hidden rounded-lg border-2", source === s.id ? "border-clay-500" : "border-transparent opacity-80 hover:opacity-100")}
                >
                  <Image src={s.src} alt="" fill sizes="110px" className="object-cover" />
                </button>
              </li>
            ))}
            <li>
              <button
                type="button"
                aria-pressed={source === "upload"}
                onClick={() => fileRef.current?.click()}
                className={cn("grid aspect-square w-full place-items-center rounded-lg border-2 border-dashed text-center text-[11px] font-semibold text-clay-600 hover:bg-clay-50", source === "upload" ? "border-clay-500 bg-clay-50" : "border-line-strong")}
              >
                <span>
                  <ImagePlus aria-hidden="true" className="mx-auto mb-1 size-5" />
                  {t("Your photo")}
                </span>
              </button>
              <input ref={fileRef} type="file" accept="image/jpeg,image/png,image/webp" className="sr-only" aria-label={t("Upload your own photo")} onChange={(e) => { void loadFile(e.target.files?.[0]); e.target.value = ""; }} data-testid="viz-upload" />
            </li>
          </ul>
          <p className="mt-3 flex items-start gap-2 text-xs text-ink-muted">
            <ShieldCheck aria-hidden="true" className="mt-0.5 size-4 shrink-0 text-clay-500" />
            {t("Your photo stays on your device. It is never uploaded.")}
          </p>
        </section>

        <section className="rounded-2xl border border-line bg-surface p-5 shadow-card">
          <h2 className="text-base font-bold">{t("2. Tap the wall")}</h2>
          <div role="group" aria-label={t("Selection mode")} className="mt-3 grid grid-cols-2 gap-1 rounded-control bg-sunken p-1">
            {(["add", "remove"] as const).map((m) => (
              <button key={m} type="button" aria-pressed={mode === m} onClick={() => setMode(m)} className={cn("h-10 rounded-md text-sm font-semibold", mode === m ? "bg-surface text-clay-600 shadow-sm" : "text-ink-soft")}>
                {m === "add" ? t("Add to selection") : t("Remove from selection")}
              </button>
            ))}
          </div>
          <label className="mt-4 block">
            <span className="flex items-center justify-between text-xs font-semibold text-ink-soft uppercase">
              {t("Tolerance")} <span className="tnum text-ink">{tolerance}</span>
            </span>
            <input type="range" min={6} max={80} value={tolerance} onChange={(e) => setTolerance(Number(e.target.value))} className="mt-2 w-full accent-[#b5651d]" />
            <span className="text-[11px] text-ink-muted">{t("Higher selects more of the wall; lower is more precise around furniture.")}</span>
          </label>
          <div className="mt-4 flex flex-wrap gap-2">
            <button type="button" onClick={undo} disabled={historyRef.current.length === 0} className="inline-flex h-10 items-center gap-1.5 rounded-control border border-line-strong px-3 text-sm font-semibold hover:bg-sunken disabled:opacity-40"><Undo2 aria-hidden="true" className="size-4" /> {t("Undo")}</button>
            <button type="button" onClick={redo} disabled={futureRef.current.length === 0} className="inline-flex h-10 items-center gap-1.5 rounded-control border border-line-strong px-3 text-sm font-semibold hover:bg-sunken disabled:opacity-40"><Redo2 aria-hidden="true" className="size-4" /> {t("Redo")}</button>
            <button type="button" onClick={clear} disabled={!hasSelection} className="inline-flex h-10 items-center gap-1.5 rounded-control border border-line-strong px-3 text-sm font-semibold hover:bg-sunken disabled:opacity-40"><Eraser aria-hidden="true" className="size-4" /> {t("Clear")}</button>
          </div>
        </section>

        <section className="rounded-2xl border border-line bg-surface p-5 shadow-card">
          <h2 className="text-base font-bold">{t("3. Pick a finish and colour")}</h2>
          <label className="mt-3 block">
            <span className="mb-1.5 block text-xs font-semibold text-ink-soft uppercase">{t("Finish")}</span>
            <select value={textureSlug} onChange={(e) => pickTexture(e.target.value)} className="h-11 w-full rounded-control border border-line-strong bg-surface px-3 text-sm text-ink focus:border-clay-500 focus:outline-none" data-testid="viz-texture">
              {textures.map((x) => (
                <option key={x.slug} value={x.slug}>{t(x.name)}</option>
              ))}
            </select>
          </label>

          <div className="mt-4 flex flex-wrap items-center gap-2.5" role="radiogroup" aria-label={t("Shade")}>
            {shades.map((s, i) => {
              const on = !custom && i === shadeIdx;
              return (
                <button key={s.code} type="button" role="radio" aria-checked={on} aria-label={`${s.name} (${s.code})`} title={`${s.name} · ${s.code}`} onClick={() => { setShadeIdx(i); setCustom(null); }} className={cn("size-10 rounded-full border-2 transition-transform hover:scale-110", on ? "border-clay-500 ring-2 ring-clay-500/30" : "border-white shadow-card")} style={{ backgroundColor: s.hex }} />
              );
            })}
            <label className="relative ms-1 grid size-10 cursor-pointer place-items-center overflow-hidden rounded-full border-2 border-dashed border-line-strong text-[10px] font-bold text-ink-soft" title={t("Custom colour")}>
              <input type="color" value={custom ?? colorHex} onChange={(e) => setCustom(e.target.value)} className="absolute inset-0 size-full cursor-pointer opacity-0" aria-label={t("Custom colour")} />
              <span aria-hidden="true" style={custom ? { backgroundColor: custom } : undefined} className="size-full rounded-full text-center leading-9">{custom ? "" : "+"}</span>
            </label>
          </div>
          <p className="mt-2 text-xs text-ink-soft">
            {custom ? <>{t("Custom colour")} · <span className="ltr-run uppercase">{custom}</span></> : <>{shade?.name} · <span className="ltr-run font-semibold">{shade?.code}</span></>}
          </p>

          <div className="mt-4">
            <span className="mb-1.5 block text-xs font-semibold text-ink-soft uppercase">{t("Surface effect")}</span>
            <div role="group" aria-label={t("Surface effect")} className="flex flex-wrap gap-1.5">
              {effects.map((ef) => (
                <button key={ef.kind} type="button" aria-pressed={effect === ef.kind} onClick={() => setEffect(ef.kind)} className={cn("h-9 rounded-full border px-3.5 text-[13px] font-semibold", effect === ef.kind ? "border-ink bg-ink text-white" : "border-line-strong bg-surface text-ink-soft hover:bg-sunken")}>
                  {t(ef.label)}
                </button>
              ))}
            </div>
          </div>
          <label className="mt-4 block">
            <span className="flex items-center justify-between text-xs font-semibold text-ink-soft uppercase">{t("Texture strength")} <span className="tnum text-ink">{grain}%</span></span>
            <input type="range" min={0} max={100} value={grain} onChange={(e) => setGrain(Number(e.target.value))} className="mt-2 w-full accent-[#b5651d]" disabled={effect === "smooth"} />
          </label>
        </section>

        <section className="grid gap-3">
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              aria-pressed={showOriginal}
              disabled={!hasSelection}
              onPointerDown={() => setShowOriginal(true)}
              onPointerUp={() => setShowOriginal(false)}
              onPointerLeave={() => setShowOriginal(false)}
              onKeyDown={(e) => (e.key === " " || e.key === "Enter") && setShowOriginal(true)}
              onKeyUp={() => setShowOriginal(false)}
              className="inline-flex h-11 items-center justify-center gap-2 rounded-control border border-line-strong bg-surface text-sm font-semibold hover:bg-sunken disabled:opacity-40"
              data-testid="viz-compare"
            >
              <Eye aria-hidden="true" className="size-4" /> {t("Hold to see original")}
            </button>
            <button type="button" onClick={download} disabled={!hasSelection} className="inline-flex h-11 items-center justify-center gap-2 rounded-control border border-line-strong bg-surface text-sm font-semibold hover:bg-sunken disabled:opacity-40" data-testid="viz-download">
              <Download aria-hidden="true" className="size-4" /> {t("Download image")}
            </button>
          </div>
          <Button href={quoteHref({ texture: texture.slug, shade: custom ? undefined : shade?.code })} size="lg">
            {t("Get a quote for this look")} <ArrowRight aria-hidden="true" className="size-4 rtl:-scale-x-100" />
          </Button>
          <Button
            href={whatsappLink(`Salam Zain & Co, I tried ${texture.name} in ${custom ? `custom colour ${custom.toUpperCase()}` : `${shade?.name} (${shade?.code})`} on your visualizer. Please share a quote and a sample board.`)}
            variant="whatsapp"
          >
            <WhatsAppIcon className="size-4" /> {t("Discuss on WhatsApp")}
          </Button>
          <p className="text-[11px] leading-snug text-ink-muted">{t("Colours and textures on screen are an approximation. Sample boards at your site confirm the real result.")}</p>
        </section>
      </div>
    </div>
  );
}
