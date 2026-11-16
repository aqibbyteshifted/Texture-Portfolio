import type { Metadata } from "next";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { MeasureTool } from "@/components/features/MeasureTool";
import { measureSteps } from "@/data/guides";
import { getI18n } from "@/i18n/server";

export const metadata: Metadata = {
  title: "Measure Your Walls and Convert Units",
  description: "Add up wall areas and convert between square feet, marla and square metres for an accurate quote.",
  alternates: { canonical: "/measure" },
};

export default async function Page() {
  const { t } = await getI18n();
  return (
    <div className="container-page py-12 sm:py-16">
      <SectionHeading as="h1" eyebrow={t("Help & Tools")} title={t("Measure Your Walls")} description={t("A small mistake in area becomes a big mistake in price. Measure once, properly.")} />
      <div className="mt-10">
        <MeasureTool />
      </div>
      <section className="mt-14 max-w-3xl">
        <h2 className="text-xl font-bold sm:text-2xl">{t("How to measure, step by step")}</h2>
        <ol className="mt-5 grid gap-4">
          {measureSteps.map((s, i) => (
            <li key={s.title} className="flex gap-3">
              <span className="grid size-8 shrink-0 place-items-center rounded-full bg-brand-500 text-sm font-bold text-white">{i + 1}</span>
              <div>
                <h3 className="font-sans text-base font-bold tracking-normal"><bdi>{s.title}</bdi></h3>
                <p className="mt-1 text-sm leading-relaxed text-ink-soft"><bdi>{s.text}</bdi></p>
              </div>
            </li>
          ))}
        </ol>
      </section>
    </div>
  );
}
