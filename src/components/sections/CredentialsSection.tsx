import Image from "next/image";
import { Icon } from "@/components/ui/icons";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { WarrantyCard } from "@/components/features/WarrantyCard";
import { credentials } from "@/data/credentials";
import { getI18n } from "@/i18n/server";

export async function CredentialsSection() {
  const { t } = await getI18n();
  return (
    <section id="credentials" className="border-y border-line bg-sunken/60 py-16 sm:py-24">
      <div className="container-page grid gap-12 lg:grid-cols-[1fr_1.05fr] lg:items-center lg:gap-16">
        <div>
          <SectionHeading
            eyebrow={t("Credentials & Warranty")}
            title={t("Licensed, Approved and Written Down")}
            description={t("Every project is backed by registered credentials and a stamped warranty card, so you are never relying on a verbal promise.")}
          />
          <ul className="mt-8 grid gap-4">
            {credentials.map((c, i) => (
              <li key={c.id}>
                <Reveal delay={i * 80}>
                  <div className="flex gap-4 rounded-card border border-line bg-surface p-5 shadow-card">
                    <span className="grid size-12 shrink-0 place-items-center rounded-lg bg-clay-50 text-clay-500">
                      <Icon name={c.icon} className="size-6" />
                    </span>
                    <div className="min-w-0 flex-1">
                      <h3 className="text-lg font-bold">{t(c.title)}</h3>
                      <p className="text-sm font-semibold text-clay-600">
                        <bdi>{t(c.detail)}</bdi>
                      </p>
                      <p className="mt-1 text-sm leading-relaxed text-ink-soft">{t(c.description)}</p>
                    </div>
                    {c.document && (
                      <a href={c.document} target="_blank" rel="noopener noreferrer" className="relative hidden size-20 shrink-0 overflow-hidden rounded-md border border-line sm:block" aria-label={t("View certificate")}>
                        <Image src={c.document} alt={t(c.title)} fill sizes="80px" className="object-cover" />
                      </a>
                    )}
                  </div>
                </Reveal>
              </li>
            ))}
          </ul>
        </div>

        <Reveal>
          <WarrantyCard />
        </Reveal>
      </div>
    </section>
  );
}
