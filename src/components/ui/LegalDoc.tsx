import { Mail, Phone } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { WhatsAppIcon } from "@/components/ui/icons";
import { LEGAL_UPDATED, type LegalSection } from "@/data/legal";
import { site } from "@/data/site";
import { getI18n } from "@/i18n/server";
import { whatsappLink } from "@/lib/whatsapp";

interface Props {
  title: string;
  intro: string;
  sections: LegalSection[];
  /** Optional block rendered right after the section with this id (e.g. the payment notice). */
  inject?: { afterId: string; node: React.ReactNode };
}

/** Table of contents + numbered sections + contact box. The legal wording itself is English only. */
export async function LegalDoc({ title, intro, sections, inject }: Props) {
  const { t } = await getI18n();
  return (
    <div className="container-page py-12 sm:py-16">
      <SectionHeading as="h1" eyebrow={t("Legal")} title={title} description={intro} />
      <p className="mt-3 text-xs text-ink-muted">
        {t("Last updated")}: <bdi>{LEGAL_UPDATED}</bdi>
      </p>

      <div className="mt-10 grid gap-10 lg:grid-cols-[16rem_1fr] lg:gap-14">
        <nav aria-label={t("On this page")} className="lg:sticky lg:top-28 lg:self-start">
          <p className="mb-3 text-xs font-semibold tracking-wider text-ink-muted uppercase">{t("On this page")}</p>
          <ol className="grid gap-1.5 border-s border-line-strong ps-4 text-sm">
            {sections.map((s) => (
              <li key={s.id}>
                <a href={`#${s.id}`} className="text-ink-soft hover:text-brand-600">
                  <bdi>{s.title}</bdi>
                </a>
              </li>
            ))}
          </ol>
        </nav>

        <div className="max-w-3xl space-y-9">
          {sections.map((s) => (
            <section key={s.id} id={s.id} className="scroll-mt-28">
              <h2 className="text-xl font-bold sm:text-2xl">
                <bdi>{s.title}</bdi>
              </h2>
              {s.body?.map((p) => (
                <p key={p} className="mt-3 text-[15px] leading-relaxed text-ink-soft">
                  <bdi>{p}</bdi>
                </p>
              ))}
              {s.list && (
                <ul className="mt-3 grid list-disc gap-2 ps-5 text-[15px] leading-relaxed text-ink-soft marker:text-brand-500">
                  {s.list.map((li) => (
                    <li key={li}>
                      <bdi>{li}</bdi>
                    </li>
                  ))}
                </ul>
              )}
              {inject && inject.afterId === s.id && <div className="mt-5">{inject.node}</div>}
            </section>
          ))}

          <section className="rounded-2xl border border-line bg-sunken p-6">
            <h2 className="text-lg font-bold">{t("Questions about this page?")}</h2>
            <p className="mt-1 text-sm text-ink-soft">{t("Contact the Zain & Co office directly. We are happy to explain anything in plain words.")}</p>
            <div className="mt-4 flex flex-wrap gap-2">
              <Button href={`tel:${site.phone.replace(/\s/g, "")}`} variant="secondary" size="sm">
                <Phone aria-hidden="true" className="size-4" /> <span className="ltr-run">{site.phone}</span>
              </Button>
              <Button href={`mailto:${site.email}`} variant="secondary" size="sm">
                <Mail aria-hidden="true" className="size-4" /> <span className="ltr-run">{site.email}</span>
              </Button>
              <Button href={whatsappLink("Salam Zain & Co, I have a question about your terms.")} variant="whatsapp" size="sm">
                <WhatsAppIcon className="size-4" /> WhatsApp
              </Button>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
