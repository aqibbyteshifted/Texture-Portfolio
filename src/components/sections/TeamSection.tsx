import Image from "next/image";
import { BadgeCheck } from "lucide-react";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { team } from "@/data/team";
import { getI18n } from "@/i18n/server";

export async function TeamSection() {
  if (team.length === 0) return null;
  const { t } = await getI18n();
  return (
    <section id="team" className="container-page py-16 sm:py-24">
      <SectionHeading
        align="center"
        eyebrow={t("Meet the Craftsmen")}
        title={t("The People on Your Site")}
        description={t("You deal with the same small team from the first site visit to the final handover.")}
      />
      <ul className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {team.map((m, i) => (
          <li key={m.id}>
            <Reveal delay={i * 80} className="h-full">
              <article className="flex h-full flex-col items-center rounded-card border border-line bg-surface p-7 text-center shadow-card">
                {m.photo ? (
                  <span className="relative size-24 overflow-hidden rounded-full ring-4 ring-clay-100">
                    <Image src={m.photo} alt={m.name} fill sizes="96px" className="object-cover" />
                  </span>
                ) : (
                  <span aria-hidden="true" className="font-display grid size-24 place-items-center rounded-full bg-clay-500 text-4xl font-extrabold text-white ring-4 ring-clay-100">
                    {m.name.replace(/^The\s+/, "").charAt(0)}
                  </span>
                )}
                <h3 className="mt-5 text-xl font-bold">{t(m.name)}</h3>
                <p className="text-sm font-semibold text-clay-600">{t(m.role)}</p>
                <p className="mt-3 flex-1 text-sm leading-relaxed text-ink-soft">{t(m.bio)}</p>
                {m.highlight && (
                  <p className="mt-4 inline-flex items-center gap-1.5 rounded-full bg-clay-50 px-3 py-1.5 text-xs font-bold text-clay-600">
                    <BadgeCheck aria-hidden="true" className="size-3.5" /> {t(m.highlight)}
                  </p>
                )}
              </article>
            </Reveal>
          </li>
        ))}
      </ul>
    </section>
  );
}
