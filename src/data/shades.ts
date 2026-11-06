export interface Shade {
  /** Short code that travels with the quote, e.g. "TR-02" */
  code: string;
  name: string;
  hex: string;
}

const build = (prefix: string, list: [name: string, hex: string][]): Shade[] =>
  list.map(([name, hex], i) => ({ code: `${prefix}-${String(i + 1).padStart(2, "0")}`, name, hex }));

/**
 * Shade palettes per texture slug. These are PLACEHOLDER palettes and codes: replace names, hex values and
 * codes with Zain & Co's real shade card. Anything you add here appears automatically in the shade picker
 * and in the quote request.
 */
export const shades: Record<string, Shade[]> = {
  "rockwall-aggregates": build("RW", [
    ["Charcoal & Sandstone", "#6b5a4a"],
    ["Desert Ochre", "#a9845a"],
    ["Slate Grey", "#5f6368"],
    ["Walnut Brown", "#5a4030"],
    ["Sand Beige", "#b89f7d"],
    ["Terracotta Blend", "#94603f"],
  ]),
  "stucco-antico": build("ST", [
    ["Alabaster", "#ece6da"],
    ["Warm Greige", "#bfb4a3"],
    ["Pearl Grey", "#c9c9c6"],
    ["Sand Dune", "#d3bd98"],
    ["Taupe", "#9c8a78"],
    ["Charcoal Marble", "#4a4a4a"],
    ["Blush Plaster", "#d9bfb3"],
  ]),
  "mediterranean-graffiato": build("GF", [
    ["Cream", "#e5d8bd"],
    ["Sandstone", "#c2a878"],
    ["Ochre", "#b98a45"],
    ["Terracotta", "#b3623f"],
    ["Olive Stone", "#8c8a63"],
    ["Slate", "#6e7378"],
  ]),
  "wash-terrazzo": build("WT", [
    ["Ivory Chip", "#e3dccd"],
    ["Grey Chip", "#aaa9a5"],
    ["Rose Chip", "#c9a79c"],
    ["Black & White", "#6a6a6a"],
    ["Desert Chip", "#bfa27a"],
    ["Green Chip", "#8e9a82"],
  ]),
  "italian-travertine": build("TR", [
    ["Ivory", "#ebe2cf"],
    ["Classic Beige", "#d8c7a8"],
    ["Noce", "#a98a66"],
    ["Silver", "#bdb8ad"],
    ["Gold", "#c9a964"],
  ]),
  "nugdi-texture": build("NG", [
    ["Sand", "#c9ad85"],
    ["Clay", "#a8865f"],
    ["Rust", "#8f553a"],
    ["Stone Grey", "#8d8a84"],
    ["Cream", "#e4d8c0"],
  ]),
  "nova-paint": build("NP", [
    ["Rose Dust", "#c9a0a0"],
    ["Midnight Blue", "#2f3e5c"],
    ["Emerald", "#2f6b5a"],
    ["Champagne", "#d9c4a0"],
    ["Mocha", "#6f4f3f"],
    ["Mauve", "#8c6a7a"],
    ["Pearl White", "#eeeae2"],
    ["Charcoal", "#3a3a3c"],
  ]),
  limewash: build("LW", [
    ["Chalk White", "#eeece6"],
    ["Warm Sand", "#d9c9ae"],
    ["Soft Clay", "#c9a58a"],
    ["Sage", "#a9b09a"],
    ["Stone Grey", "#b8b6b0"],
    ["Dusty Pink", "#dcc0b6"],
    ["Charcoal Lime", "#6b6b69"],
  ]),
  microcement: build("MC", [
    ["Terracotta", "#b8603a"],
    ["Warm Grey", "#a8a29a"],
    ["Concrete", "#8f9194"],
    ["Sand", "#cdb99a"],
    ["Charcoal", "#4b4b4d"],
    ["Olive", "#7a7a5a"],
  ]),
  "color-crete": build("CR", [
    ["Warm Grey", "#a8a29a"],
    ["Terracotta", "#b8765a"],
    ["Sand", "#cdb99a"],
    ["Olive", "#868a6a"],
    ["Charcoal", "#4f4f52"],
    ["Blush", "#d6b9ac"],
  ]),
  "fair-face": build("FF", [
    ["Light Concrete", "#b9b8b3"],
    ["Mid Grey", "#8e8f8d"],
    ["Warm Grey", "#a09a91"],
    ["Charcoal", "#55575a"],
    ["Sand Grey", "#b4aa98"],
  ]),
  "sand-texture": build("SD", [
    ["Cream", "#e5d8bd"],
    ["Sand", "#cdb994"],
    ["Buff", "#c2a878"],
    ["Ochre", "#b98a45"],
    ["Terracotta", "#b3623f"],
    ["Grey Stone", "#8d8a84"],
  ]),
  "epoxy-flooring": build("EF", [
    ["Light Grey", "#b9bcc0"],
    ["Graphite", "#55595e"],
    ["Sand Beige", "#cdbfa5"],
    ["Blue Grey", "#7f93a3"],
    ["Forest Green", "#5f7f6a"],
    ["Red Oxide", "#8b4a3f"],
    ["White", "#e9eaea"],
  ]),
};

export const getShades = (slug: string): Shade[] => shades[slug] ?? [];

export const findShade = (slug: string, code: string | null | undefined): Shade | undefined =>
  code ? getShades(slug).find((s) => s.code === code) : undefined;
