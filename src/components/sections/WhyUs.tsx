import Image from "next/image";
import { Award } from "lucide-react";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import { Icon } from "@/components/ui/icons";
import { whyUs } from "@/data/site";
import { getI18n } from "@/i18n/server";

export async function WhyUs() {
  const { t } = await getI18n();
  return (
    <section id="why-us" className="container-page py-16 sm:py-24">
      <SectionHeading
        align="center"
        eyebrow={t("Contractor Excellence")}
        title={t("Engineered for Lahore's Climate")}
        description={t("Why discerning architects, prominent DHA builders, and luxury homeowners in Lahore trust Zain & Co with their monumental walls.")}
      />

      <ul className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {whyUs.map((item, i) => (
          <li key={item.title}>
            <Reveal delay={(i % 3) * 80} className="h-full">
              <div className="h-full rounded-card border border-line bg-surface p-6 shadow-card transition-shadow hover:shadow-lift">
                <span className="grid size-12 place-items-center rounded-lg bg-clay-50 text-clay-500">
                  <Icon name={item.icon} className="size-6" />
                </span>
                <h3 className="mt-5 text-lg font-bold">{t(item.title)}</h3>
                <p className="mt-2 text-sm leading-relaxed text-ink-soft">{t(item.description)}</p>
              </div>
            </Reveal>
          </li>
        ))}
      </ul>

      <Reveal className="mt-8">
        <div className="relative isolate overflow-hidden rounded-2xl bg-ink text-white">
          <Image
            src="/images/karigar.jpg"
            alt={t("Pakistani master craftsman karigar applying smooth architectural texture plaster")}
            fill
            sizes="(min-width: 1280px) 1200px, 100vw"
            className="-z-20 object-cover"
          />
          <div className="absolute inset-0 -z-10 bg-gradient-to-r from-black/85 via-black/60 to-black/10 rtl:bg-gradient-to-l" />
          <div className="max-w-xl px-6 py-14 sm:px-12 sm:py-20">
            <p className="text-xs font-semibold tracking-[0.14em] text-sand-500 uppercase">{t("Master Karigars at Work")}</p>
            <h3 className="mt-2 text-2xl font-bold sm:text-4xl">{t("The Art of the Stainless Steel Trowel")}</h3>
            <p className="mt-4 text-sm leading-relaxed text-white/75 sm:text-base">
              {t("Surface texturing is not regular painting. It is fine sculptural architecture. Our artisans calibrate feathering pressure to produce flawless natural veins and monolith seams that machine sprayers can never replicate.")}
            </p>
            <p className="mt-6 inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm font-semibold backdrop-blur">
              <Award aria-hidden="true" className="size-4 text-sand-500" /> {t("100% In-House Trained Pakistani Artisans")}
            </p>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
