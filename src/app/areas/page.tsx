import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, MapPin } from "lucide-react";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { areas } from "@/data/areas";
import { cities } from "@/data/cities";
import { allProjects } from "@/data/projects";
import { getI18n } from "@/i18n/server";

export const metadata: Metadata = {
  title: "Areas We Serve: Lahore, Islamabad, Rawalpindi & Karachi",
  description:
    "Zain & Co applies wall texture and facade finishes in Lahore (DHA, Bahria Town, Gulberg, Model Town, Johar Town), Islamabad, Rawalpindi and Karachi.",
  alternates: { canonical: "/areas" },
};

export default async function AreasPage() {
  const { t } = await getI18n();
  return (
    <div className="container-page py-12 sm:py-16">
      <SectionHeading
        as="h1"
        eyebrow={t("Coverage")}
        title={t("Areas We Serve")}
        description={t("Lahore, Islamabad, Rawalpindi and Karachi. Homes, plot sizes and weather differ in each city, so we plan the finish for where you live.")}
      />

      {cities.map((c) => {
        const list = areas.filter((a) => a.city === c.id);
        return (
          <section key={c.id} id={c.id} className="mt-14 scroll-mt-28">
            <h2 className="text-2xl font-bold sm:text-3xl">{t(c.name)}</h2>
            <p className="mt-2 max-w-3xl text-sm text-ink-soft sm:text-base">{t(c.climate)}</p>
            <ul className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {list.map((a) => {
                const count = allProjects.filter((p) => a.sectors.includes(p.sector)).length;
                return (
                  <li key={a.slug}>
                    <Link href={`/areas/${a.slug}`} className="group flex h-full flex-col rounded-card border border-line bg-surface p-6 shadow-card transition-shadow hover:shadow-lift">
                      <span className="grid size-11 place-items-center rounded-lg bg-brand-50 text-brand-500">
                        <MapPin aria-hidden="true" className="size-5" />
                      </span>
                      <h3 className="mt-4 font-display text-xl font-bold">{t(a.name)}</h3>
                      <p className="mt-1 flex-1 text-sm text-ink-soft">{a.neighbourhoods.slice(0, 4).join(" • ")}{a.neighbourhoods.length > 4 ? " …" : ""}</p>
                      <p className="mt-4 flex items-center justify-between text-sm font-bold text-brand-600">
                        <span>{count > 0 ? t("{n} projects", { n: count }) : c.freeVisit ? t("Free site visit") : t("Get a quote")}</span>
                        <ArrowRight aria-hidden="true" className="size-4 transition-transform group-hover:translate-x-0.5 rtl:-scale-x-100" />
                      </p>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </section>
        );
      })}
    </div>
  );
}
