import { CheckCheck } from "lucide-react";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import { BeforeAfterSlider } from "@/components/features/BeforeAfterSlider";
import { ProjectGrid } from "@/components/features/ProjectGrid";
import { homeProjects } from "@/data/projects";
import { getI18n } from "@/i18n/server";

export async function Transformation() {
  const { t } = await getI18n();
  return (
    <section id="work" className="border-y border-line bg-sunken/60 py-16 sm:py-24">
      <div className="container-page">
        <SectionHeading
          align="center"
          eyebrow={t("Transformational Execution")}
          title={t("See the Transformation")}
          description={t("Real homes in DHA Lahore, Bahria Town, and Gulberg upgraded from raw grey cement plaster to breathtaking architectural statements.")}
        />

        <Reveal className="mt-10">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-xs font-semibold tracking-wide text-clay-500 uppercase">{t("Case Study • Phase 6 DHA Lahore")}</p>
              <h3 className="text-xl font-bold sm:text-2xl">{t("Raw Cement Plaster to Italian Travertine")}</h3>
            </div>
            <span className="flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-bold text-emerald-700">
              <CheckCheck aria-hidden="true" className="size-4" /> {t("Completed in 8 Days")}
            </span>
          </div>
          <BeforeAfterSlider before="/images/before.jpg" after="/images/after.jpg" />
        </Reveal>

        <Reveal className="mt-12">
          <ProjectGrid projects={homeProjects} filterBy="sector" />
        </Reveal>
      </div>
    </section>
  );
}
