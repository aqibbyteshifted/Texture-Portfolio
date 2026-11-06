import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, MapPin } from "lucide-react";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { areas } from "@/data/areas";
import { allProjects } from "@/data/projects";
import { getI18n } from "@/i18n/server";

export const metadata: Metadata = {
  title: "Areas We Serve in Lahore",
  description:
    "Zain & Co applies wall texture and facade finishes across DHA, Bahria Town, Gulberg, Model Town, Johar Town, Lake City and WAPDA Town in Lahore.",
  alternates: { canonical: "/areas" },
};

export default async function AreasPage() {
  const { t } = await getI18n();
  return (
    <div className="container-page py-12 sm:py-16">
      <SectionHeading
        as="h1"
        eyebrow={t("Lahore Coverage")}
        title={t("Areas We Serve")}
        description={t("Free laser measurement and sample-board visits across these Lahore localities.")}
      />
      <ul className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {areas.map((a) => {
          const count = allProjects.filter((p) => a.sectors.includes(p.sector)).length;
          return (
            <li key={a.slug}>
              <Link href={`/areas/${a.slug}`} className="group flex h-full flex-col rounded-card border border-line bg-surface p-6 shadow-card transition-shadow hover:shadow-lift">
                <span className="grid size-11 place-items-center rounded-lg bg-clay-50 text-clay-500">
                  <MapPin aria-hidden="true" className="size-5" />
                </span>
                <h2 className="mt-4 text-xl font-bold">{t(a.name)}</h2>
                <p className="mt-1 flex-1 text-sm text-ink-soft">{a.neighbourhoods.slice(0, 4).join(" • ")}{a.neighbourhoods.length > 4 ? " …" : ""}</p>
                <p className="mt-4 flex items-center justify-between text-sm font-bold text-clay-600">
                  <span>{count > 0 ? t("{n} projects", { n: count }) : t("Free site visit")}</span>
                  <ArrowRight aria-hidden="true" className="size-4 transition-transform group-hover:translate-x-0.5 rtl:-scale-x-100" />
                </p>
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
