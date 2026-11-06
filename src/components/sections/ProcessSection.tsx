import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import { Icon } from "@/components/ui/icons";
import { processSteps } from "@/data/site";
import { getI18n } from "@/i18n/server";

export async function ProcessSection() {
  const { t } = await getI18n();
  return (
    <section id="process" className="container-page py-16 sm:py-24">
      <SectionHeading
        align="center"
        eyebrow={t("Structured Workflow")}
        title={t("Our 4-Step Seamless Process")}
        description={t("From the initial consultation to final gloss and warranty issuance, enjoy peace of mind with complete professional transparency.")}
      />
      <ol className="relative mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <div aria-hidden="true" className="absolute inset-x-[12%] top-[3.25rem] hidden border-t-2 border-dashed border-line-strong lg:block" />
        {processSteps.map((p, i) => (
          <li key={p.step} className="relative">
            <Reveal delay={i * 90} className="h-full">
              <div className="h-full rounded-card border border-line bg-surface p-6 shadow-card">
                <div className="flex items-center justify-between">
                  <span className="relative z-10 grid size-14 place-items-center rounded-full bg-clay-500 text-white shadow-lift">
                    <Icon name={p.icon} className="size-6" />
                  </span>
                  <span className="font-display text-5xl font-extrabold text-line-strong/70 tnum">0{p.step}</span>
                </div>
                <h3 className="mt-5 text-lg font-bold">{t(p.title)}</h3>
                <p className="mt-2 text-sm leading-relaxed text-ink-soft">{t(p.description)}</p>
                <p className="mt-4 inline-block rounded-full bg-clay-50 px-3 py-1 text-xs font-bold text-clay-600">{t(p.meta)}</p>
              </div>
            </Reveal>
          </li>
        ))}
      </ol>
    </section>
  );
}
