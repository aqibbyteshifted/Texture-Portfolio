import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Icon, WhatsAppIcon } from "@/components/ui/icons";
import { RapidEstimator } from "@/components/features/RapidEstimator";
import { site } from "@/data/site";
import { getI18n } from "@/i18n/server";
import { quoteHref } from "@/lib/quoteLink";
import { waMessages, whatsappLink } from "@/lib/whatsapp";

export async function Hero() {
  const { t } = await getI18n();
  return (
    <section className="relative isolate overflow-hidden bg-ink text-white">
      <Image src="/images/bg-a-0.jpg" alt="" fill priority sizes="100vw" className="-z-20 object-cover opacity-60" />
      <div className="absolute inset-0 -z-10 bg-gradient-to-r from-ink via-ink/85 to-ink/30 rtl:bg-gradient-to-l" />
      <div className="absolute inset-x-0 bottom-0 -z-10 h-32 bg-gradient-to-t from-ink/70 to-transparent" />

      <div className="container-page grid gap-10 py-14 sm:py-20 lg:grid-cols-[1.15fr_1fr] lg:items-center lg:gap-14 lg:py-24">
        <div>
          <p className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3.5 py-1.5 text-xs font-semibold tracking-wide backdrop-blur">
            <span className="size-1.5 rounded-full bg-sand-500" /> {t("Lahore Premier Wall Crafters • PEC Registered")}
          </p>
          <h1 className="mt-5 text-[2.5rem] leading-[1.02] font-extrabold tracking-tight sm:text-6xl lg:text-7xl">
            {t("Give Your Walls a Texture")} <span className="text-sand-500">{t("That Lasts")}</span>
          </h1>
          <p className="mt-5 max-w-xl text-base leading-relaxed text-white/75 sm:text-lg">
            {t("Premium rockwall, authentic Italian travertine, refined stucco, microcement, limewash and epoxy finishes crafted for luxury residences across Lahore, DHA, Bahria Town, and Punjab.")}
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Button href={quoteHref()} size="lg">
              {t("Get Free Quote")} <ArrowRight aria-hidden="true" className="size-4 rtl:-scale-x-100" />
            </Button>
            <Button href={whatsappLink(waMessages.start)} variant="whatsapp" size="lg">
              <WhatsAppIcon className="size-5" /> {t("Chat on WhatsApp")}
            </Button>
          </div>

          <dl className="mt-10 grid grid-cols-2 gap-x-6 gap-y-5 border-t border-white/10 pt-7 sm:grid-cols-4">
            {site.stats.map((s) => (
              <div key={s.label} className="flex items-center gap-3">
                <span className="grid size-10 shrink-0 place-items-center rounded-lg bg-white/10 text-sand-500">
                  <Icon name={s.icon} className="size-5" />
                </span>
                <div>
                  <dt className="sr-only">{t(s.label)}</dt>
                  <dd className="font-display text-lg leading-none font-extrabold">{t(s.value)}</dd>
                  <p aria-hidden="true" className="mt-1 text-[11px] leading-tight text-white/60">{t(s.label)}</p>
                </div>
              </div>
            ))}
          </dl>
        </div>

        <div className="lg:w-full lg:max-w-md lg:justify-self-end">
          <RapidEstimator />
        </div>
      </div>
    </section>
  );
}
