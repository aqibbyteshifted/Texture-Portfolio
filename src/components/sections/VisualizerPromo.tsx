import Image from "next/image";
import { ArrowRight, MousePointerClick, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Reveal } from "@/components/ui/Reveal";
import { getI18n } from "@/i18n/server";

export async function VisualizerPromo() {
  const { t } = await getI18n();
  return (
    <section id="visualizer" className="container-page py-16 sm:py-24">
      <Reveal>
        <div className="grid items-center gap-8 overflow-hidden rounded-3xl border border-line bg-surface p-5 shadow-lift sm:p-8 lg:grid-cols-2 lg:gap-12 lg:p-10">
          <div>
            <p className="text-xs font-semibold tracking-[0.14em] text-clay-500 uppercase">{t("Free tool")}</p>
            <h2 className="mt-2 text-[1.75rem] leading-[1.1] font-bold sm:text-4xl">{t("See the finish on your own wall")}</h2>
            <p className="mt-4 text-[15px] leading-relaxed text-ink-soft sm:text-base">
              {t("Upload a photo, tap the wall and try our textures and shades instantly. Download the result or ask for a quote for the look you like.")}
            </p>
            <ul className="mt-5 grid gap-2.5 text-sm text-ink-soft">
              <li className="flex items-center gap-2.5"><MousePointerClick aria-hidden="true" className="size-4 shrink-0 text-clay-500" /> {t("Tap a wall, pick a shade, done")}</li>
              <li className="flex items-center gap-2.5"><ShieldCheck aria-hidden="true" className="size-4 shrink-0 text-clay-500" /> {t("Your photo stays on your device. It is never uploaded.")}</li>
            </ul>
            <Button href="/visualizer" size="lg" className="mt-7">
              {t("Try the visualizer")} <ArrowRight aria-hidden="true" className="size-4 rtl:-scale-x-100" />
            </Button>
          </div>

          <div dir="ltr" className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-ink">
            <Image src="/images/tex-stucco.jpg" alt={t("A room wall shown before and after recolouring")} fill sizes="(min-width: 1024px) 560px, 100vw" className="object-cover" />
            <div aria-hidden="true" className="absolute inset-y-0 right-0 w-1/2 bg-[#7f8f78] mix-blend-color" />
            <div aria-hidden="true" className="absolute inset-y-0 right-0 w-1/2 bg-[#7f8f78]/25 mix-blend-multiply" />
            <div aria-hidden="true" className="absolute inset-y-0 left-1/2 w-0.5 bg-white shadow-lg" />
            <span className="absolute top-3 left-3 rounded-full bg-black/60 px-3 py-1 text-[11px] font-bold text-white">{t("Before")}</span>
            <span className="absolute top-3 right-3 rounded-full bg-clay-500 px-3 py-1 text-[11px] font-bold text-white">{t("After")}</span>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
