import type { Texture, TextureSystem } from "@/types";
import { msg } from "@/i18n/config";

/**
 * Care tips per application system. Review them against Zain & Co's own maintenance advice; refresh intervals are
 * pulled from each finish's data in data/textures.ts so they never disagree with the product pages.
 */
const bySystem: Record<TextureSystem, string[]> = {
  plaster: [
    "Dust with a soft brush, or rinse exterior surfaces with a garden hose.",
    "If you use a pressure washer, keep the pressure low and the nozzle at a distance.",
    "Avoid acid-based or abrasive cleaners.",
    "Check walls after heavy rain and report any new cracks early.",
  ],
  paint: [
    "Wipe with a soft, damp cloth and mild soap. Do not scrub.",
    "Avoid abrasive pads and strong cleaners that can polish or dull the surface.",
    "Ask us for a matching batch for touch-ups instead of using shop paint.",
    "Report damp patches early; moisture behind the wall is the main cause of peeling.",
  ],
  floor: [
    "Sweep or dust-mop regularly; grit is what wears a resin floor.",
    "Damp-mop with a neutral cleaner and avoid harsh solvents.",
    "Wipe oil and chemical spills promptly.",
    "Use felt pads under furniture and avoid dragging heavy objects.",
  ],
};

export function careTips(texture: Texture): string[] {
  const tips = [...bySystem[texture.system]];
  const refresh = texture.performance.find((p) => /re-?seal|refresh/i.test(p.label));
  if (refresh) tips.push(`Typical ${refresh.label.toLowerCase()}: ${refresh.value}.`);
  return tips;
}

export const claimIssues = [
  msg("Peeling / flaking"),
  msg("Cracks"),
  msg("Colour fading"),
  msg("Damp / seepage"),
  msg("Hollow sound / debonding"),
  msg("Other"),
];
