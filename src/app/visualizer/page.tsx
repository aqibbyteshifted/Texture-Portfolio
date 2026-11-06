import type { Metadata } from "next";
import { MousePointerClick, Palette, Camera } from "lucide-react";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Visualizer } from "@/components/features/Visualizer";
import { getI18n } from "@/i18n/server";
import { msg } from "@/i18n/config";

export const metadata: Metadata = {
  title: "Colour & Texture Visualizer: Try a Finish on Your Wall",
  description:
    "Pick a room or upload your own photo, tap a wall and preview Zain & Co finishes and shades on it. Runs in your browser; your photo is never uploaded.",
  alternates: { canonical: "/visualizer" },
};

const steps = [
  { icon: Camera, title: msg("Choose a photo"), text: msg("Start with a sample room or upload a photo of your own wall.") },
  { icon: MousePointerClick, title: msg("Tap the wall"), text: msg("Tap the wall to select it. Adjust tolerance, then add or remove areas.") },
  { icon: Palette, title: msg("Try finishes"), text: msg("Pick a finish, shade and texture. Download the image or ask for a quote.") },
] as const;

export default async function VisualizerPage() {
  const { t } = await getI18n();
  return (
    <div className="container-page py-10 sm:py-14">
      <SectionHeading
        as="h1"
        eyebrow={t("Free tool")}
        title={t("Colour & Texture Visualizer")}
        description={t("See how a finish and shade will look on your own wall before you decide. Everything runs in your browser.")}
        className="mb-8"
      />
      <Visualizer />
      <ol className="mt-14 grid gap-5 sm:grid-cols-3">
        {steps.map((s, i) => (
          <li key={s.title} className="rounded-card border border-line bg-surface p-6 shadow-card">
            <span className="grid size-11 place-items-center rounded-full bg-clay-500 text-white">
              <s.icon aria-hidden="true" className="size-5" />
            </span>
            <p className="mt-4 text-xs font-bold tracking-wider text-clay-600 uppercase">{t("Step {n}", { n: i + 1 })}</p>
            <h2 className="mt-1 text-lg font-bold">{t(s.title)}</h2>
            <p className="mt-2 text-sm leading-relaxed text-ink-soft">{t(s.text)}</p>
          </li>
        ))}
      </ol>
    </div>
  );
}
