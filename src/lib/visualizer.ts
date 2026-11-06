/**
 * Pure image-processing helpers for the colour visualizer. Everything runs in the browser on plain typed arrays
 * (no dependencies, no network), so photos never leave the visitor's device.
 */
export type RGB = [number, number, number];
export type PatternKind = "smooth" | "fine" | "coarse" | "veins" | "speckle" | "cloud";

const clamp = (v: number, lo: number, hi: number) => (v < lo ? lo : v > hi ? hi : v);

/** Squared colour distance between two pixels, brightness-forgiving like the seed distance below. */
function pairDistance(data: Uint8ClampedArray, a: number, b: number) {
  const dr = data[a] - data[b], dg = data[a + 1] - data[b + 1], db = data[a + 2] - data[b + 2];
  const dY = (0.299 * dr + 0.587 * dg + 0.114 * db) * 0.6;
  const dCb = -0.1687 * dr - 0.3313 * dg + 0.5 * db;
  const dCr = 0.5 * dr - 0.4187 * dg - 0.0813 * db;
  return dY * dY + dCb * dCb + dCr * dCr;
}

/** Colour distance that is deliberately forgiving about brightness (walls are lit unevenly). */
function makeDistance(data: Uint8ClampedArray, w: number, h: number, sx: number, sy: number) {
  // average a 5x5 patch around the seed to ignore single-pixel noise
  let sr = 0, sg = 0, sb = 0, n = 0;
  for (let dy = -2; dy <= 2; dy++) {
    for (let dx = -2; dx <= 2; dx++) {
      const x = clamp(sx + dx, 0, w - 1), y = clamp(sy + dy, 0, h - 1);
      const i = (y * w + x) * 4;
      sr += data[i]; sg += data[i + 1]; sb += data[i + 2]; n++;
    }
  }
  sr /= n; sg /= n; sb /= n;
  const Y0 = 0.299 * sr + 0.587 * sg + 0.114 * sb;
  const Cb0 = -0.1687 * sr - 0.3313 * sg + 0.5 * sb;
  const Cr0 = 0.5 * sr - 0.4187 * sg - 0.0813 * sb;
  return (i: number) => {
    const r = data[i], g = data[i + 1], b = data[i + 2];
    const dY = (0.299 * r + 0.587 * g + 0.114 * b - Y0) * 0.6;
    const dCb = -0.1687 * r - 0.3313 * g + 0.5 * b - Cb0;
    const dCr = 0.5 * r - 0.4187 * g - 0.0813 * b - Cr0;
    return dY * dY + dCb * dCb + dCr * dCr;
  };
}

/** Luminance change per pixel (after a light blur), used as a barrier so the selection stops at real edges. */
export function buildEdgeMap(data: Uint8ClampedArray, w: number, h: number): Float32Array {
  const lum = new Float32Array(w * h);
  for (let i = 0; i < w * h; i++) lum[i] = 0.299 * data[i * 4] + 0.587 * data[i * 4 + 1] + 0.114 * data[i * 4 + 2];

  const R = 2; // blur radius: removes fine plaster/stone grain so only structural edges remain
  const tmp = new Float32Array(w * h), blur = new Float32Array(w * h);
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      let s = 0, n = 0;
      for (let k = -R; k <= R; k++) { const xx = x + k; if (xx >= 0 && xx < w) { s += lum[y * w + xx]; n++; } }
      tmp[y * w + x] = s / n;
    }
  }
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      let s = 0, n = 0;
      for (let k = -R; k <= R; k++) { const yy = y + k; if (yy >= 0 && yy < h) { s += tmp[yy * w + x]; n++; } }
      blur[y * w + x] = s / n;
    }
  }

  const edges = new Float32Array(w * h);
  for (let y = 1; y < h - 1; y++) {
    for (let x = 1; x < w - 1; x++) {
      const i = y * w + x;
      const gx = blur[i - w + 1] + 2 * blur[i + 1] + blur[i + w + 1] - (blur[i - w - 1] + 2 * blur[i - 1] + blur[i + w - 1]);
      const gy = blur[i + w - 1] + 2 * blur[i + w] + blur[i + w + 1] - (blur[i - w - 1] + 2 * blur[i - w] + blur[i - w + 1]);
      edges[i] = Math.hypot(gx, gy) / 8;
    }
  }
  // the Sobel kernel needs a 1px margin; replicate the neighbouring row/column so the barrier has no gap at the
  // photo's border (otherwise a selection could slip around an edge that runs to the image boundary)
  if (w > 2 && h > 2) {
    for (let x = 0; x < w; x++) {
      edges[x] = edges[w + x];
      edges[(h - 1) * w + x] = edges[(h - 2) * w + x];
    }
    for (let y = 0; y < h; y++) {
      edges[y * w] = edges[y * w + 1];
      edges[y * w + w - 1] = edges[y * w + w - 2];
    }
  }
  return edges;
}

/** Edge strength (luminance levels per pixel) above which the selection will not grow. */
const EDGE_LIMIT = 6;

/**
 * Selects the connected region of similar colour around (sx, sy). Returns a w*h mask of 0/1.
 *
 * A pixel joins the selection when it is close to the seed colour, OR when it is only a gentle step away from the
 * neighbour it was reached from and still within a somewhat wider band of the seed. The second rule lets the
 * selection follow lighting gradients across a wall. Pixels on a strong edge (wall/ceiling/floor/furniture
 * outlines) never join, so the selection does not spill into the rest of the room.
 *
 * Pass a cached `edges` map (see buildEdgeMap) when selecting repeatedly on the same photo.
 */
export function floodSelect(
  data: Uint8ClampedArray,
  w: number,
  h: number,
  sx: number,
  sy: number,
  tolerance: number,
  edges: Float32Array = buildEdgeMap(data, w, h),
): Uint8Array {
  const mask = new Uint8Array(w * h);
  if (sx < 0 || sy < 0 || sx >= w || sy >= h) return mask;
  const seedDist = makeDistance(data, w, h, sx, sy);
  const near = tolerance * tolerance;
  const wide = (tolerance * 1.4) ** 2;
  const step = Math.max(2, tolerance * 0.14) ** 2;

  const queue = new Int32Array(w * h);
  let head = 0, tail = 0;
  const start = sy * w + sx;
  mask[start] = 1;
  queue[tail++] = start;

  const tryJoin = (from: number, to: number) => {
    if (mask[to] || edges[to] > EDGE_LIMIT) return;
    const ds = seedDist(to * 4);
    if (ds <= near || (ds <= wide && pairDistance(data, from * 4, to * 4) <= step)) {
      mask[to] = 1;
      queue[tail++] = to;
    }
  };

  while (head < tail) {
    const i = queue[head++];
    const x = i % w;
    if (x > 0) tryJoin(i, i - 1);
    if (x < w - 1) tryJoin(i, i + 1);
    if (i >= w) tryJoin(i, i - w);
    if (i < w * h - w) tryJoin(i, i + w);
  }
  return mask;
}

export function combineMask(base: Uint8Array, region: Uint8Array, mode: "add" | "remove"): Uint8Array {
  const out = new Uint8Array(base.length);
  for (let i = 0; i < base.length; i++) out[i] = mode === "add" ? (base[i] | region[i]) : (base[i] & (region[i] ? 0 : 1));
  return out;
}

export function maskCoverage(mask: Uint8Array): number {
  let n = 0;
  for (let i = 0; i < mask.length; i++) n += mask[i];
  return mask.length ? n / mask.length : 0;
}

/** Feathers the mask edge by one pixel (3x3 box blur) so recoloured walls do not get jagged borders. */
export function buildAlpha(mask: Uint8Array, w: number, h: number): Uint8Array {
  const alpha = new Uint8Array(w * h);
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      let sum = 0, cnt = 0;
      for (let dy = -1; dy <= 1; dy++) {
        const yy = y + dy;
        if (yy < 0 || yy >= h) continue;
        for (let dx = -1; dx <= 1; dx++) {
          const xx = x + dx;
          if (xx < 0 || xx >= w) continue;
          sum += mask[yy * w + xx];
          cnt++;
        }
      }
      alpha[y * w + x] = Math.round((sum / cnt) * 255);
    }
  }
  return alpha;
}

/* ---------- procedural texture patterns (tileable value noise) ---------- */

function rng(seed: number) {
  let s = seed >>> 0;
  return () => {
    s = (s + 0x6d2b79f5) >>> 0;
    let t = s;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function valueNoise(size: number, cellsX: number, cellsY: number, rand: () => number): Float32Array {
  const lattice = new Float32Array(cellsX * cellsY).map(() => rand() * 2 - 1);
  const out = new Float32Array(size * size);
  const smooth = (t: number) => t * t * (3 - 2 * t);
  for (let y = 0; y < size; y++) {
    const fy = (y / size) * cellsY;
    const y0 = Math.floor(fy), ty = smooth(fy - y0);
    for (let x = 0; x < size; x++) {
      const fx = (x / size) * cellsX;
      const x0 = Math.floor(fx), tx = smooth(fx - x0);
      const a = lattice[(y0 % cellsY) * cellsX + (x0 % cellsX)];
      const b = lattice[(y0 % cellsY) * cellsX + ((x0 + 1) % cellsX)];
      const c = lattice[((y0 + 1) % cellsY) * cellsX + (x0 % cellsX)];
      const d = lattice[((y0 + 1) % cellsY) * cellsX + ((x0 + 1) % cellsX)];
      out[y * size + x] = (a * (1 - tx) + b * tx) * (1 - ty) + (c * (1 - tx) + d * tx) * ty;
    }
  }
  return out;
}

function mix(layers: [Float32Array, number][], size: number): Float32Array {
  const out = new Float32Array(size * size);
  for (const [layer, weight] of layers) for (let i = 0; i < out.length; i++) out[i] += layer[i] * weight;
  let max = 0;
  for (let i = 0; i < out.length; i++) max = Math.max(max, Math.abs(out[i]));
  if (max > 0) for (let i = 0; i < out.length; i++) out[i] /= max;
  return out;
}

export interface Pattern {
  tile: Float32Array;
  size: number;
  /** how strongly the pattern modulates brightness at grain = 100% */
  amplitude: number;
}

export function makePattern(kind: PatternKind, size = 256, seed = 7): Pattern | null {
  if (kind === "smooth") return null;
  const r = rng(seed);
  switch (kind) {
    case "fine":
      return { size, amplitude: 0.16, tile: mix([[valueNoise(size, 96, 96, r), 0.7], [valueNoise(size, 24, 24, r), 0.3]], size) };
    case "coarse":
      return { size, amplitude: 0.34, tile: mix([[valueNoise(size, 10, 10, r), 0.5], [valueNoise(size, 28, 28, r), 0.35], [valueNoise(size, 96, 96, r), 0.25]], size) };
    case "veins":
      return { size, amplitude: 0.22, tile: mix([[valueNoise(size, 3, 40, r), 0.6], [valueNoise(size, 6, 96, r), 0.4]], size) };
    case "cloud":
      return { size, amplitude: 0.2, tile: mix([[valueNoise(size, 4, 4, r), 0.6], [valueNoise(size, 9, 9, r), 0.4]], size) };
    case "speckle": {
      const tile = new Float32Array(size * size);
      const base = valueNoise(size, 48, 48, r);
      for (let i = 0; i < tile.length; i++) tile[i] = base[i] * 0.25;
      for (let n = 0; n < size * size * 0.012; n++) {
        const cx = Math.floor(r() * size), cy = Math.floor(r() * size);
        const val = r() < 0.55 ? 1 : -1;
        const rad = r() < 0.2 ? 2 : 1;
        for (let dy = -rad; dy <= rad; dy++)
          for (let dx = -rad; dx <= rad; dx++)
            if (dx * dx + dy * dy <= rad * rad) tile[((cy + dy + size) % size) * size + ((cx + dx + size) % size)] = val;
      }
      return { size, amplitude: 0.5, tile };
    }
  }
}

export interface RecolorOptions {
  color: RGB;
  pattern: Pattern | null;
  /** 0..1, how much of the pattern amplitude to apply */
  grain: number;
  /** 0..1 how opaque the new colour is */
  strength?: number;
}

/**
 * Re-colours the masked pixels while keeping the photo's own light and shadow: each pixel's brightness relative to the
 * average brightness of the selected wall is applied to the new colour, optionally modulated by a texture pattern.
 */
export function recolor(base: ImageData, alpha: Uint8Array, { color, pattern, grain, strength = 0.94 }: RecolorOptions): ImageData {
  const { width: w, height: h, data } = base;
  const out = new ImageData(new Uint8ClampedArray(data), w, h);
  const o = out.data;

  let sum = 0, n = 0;
  for (let i = 0; i < alpha.length; i++) {
    if (alpha[i] > 127) {
      const p = i * 4;
      sum += 0.299 * data[p] + 0.587 * data[p + 1] + 0.114 * data[p + 2];
      n++;
    }
  }
  const L0 = n ? Math.max(sum / n, 1) : 1;
  const amp = pattern ? pattern.amplitude * grain : 0;

  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const a = alpha[y * w + x];
      if (!a) continue;
      const p = (y * w + x) * 4;
      const lum = 0.299 * data[p] + 0.587 * data[p + 1] + 0.114 * data[p + 2];
      let f = clamp(lum / L0, 0.3, 1.8);
      f = 1 + (f - 1) * 0.85;
      const noise = pattern ? pattern.tile[(y % pattern.size) * pattern.size + (x % pattern.size)] : 0;
      const m = f * (1 + amp * noise);
      const t = (a / 255) * strength;
      o[p] = data[p] * (1 - t) + clamp(color[0] * m, 0, 255) * t;
      o[p + 1] = data[p + 1] * (1 - t) + clamp(color[1] * m, 0, 255) * t;
      o[p + 2] = data[p + 2] * (1 - t) + clamp(color[2] * m, 0, 255) * t;
    }
  }
  return out;
}

export function hexToRgb(hex: string): RGB {
  const m = /^#?([0-9a-f]{6})$/i.exec(hex.trim());
  if (!m) return [128, 128, 128];
  const n = parseInt(m[1], 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}
