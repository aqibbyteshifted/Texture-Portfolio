import { Mail, MapPinned, Navigation, Phone } from "lucide-react";
import { ContactForm } from "@/components/features/ContactForm";
import { OpenStatus } from "@/components/ui/OpenStatus";
import { Button } from "@/components/ui/Button";
import { site } from "@/data/site";
import { getI18n } from "@/i18n/server";
import { msg } from "@/i18n/config";

const crews = [
  msg("DHA Phase 1-9 & Prism"),
  msg("Bahria Town"),
  msg("Gulberg MM Alam"),
  msg("Model Town"),
  msg("Lake City"),
  msg("Johar Town"),
  msg("WAPDA Town"),
  msg("Valencia"),
];

export async function ContactSection() {
  const { t, locale } = await getI18n();
  const mapSrc = `https://www.google.com/maps?q=${encodeURIComponent(site.mapQuery)}&z=16&output=embed&hl=${locale === "ur" ? "ur" : "en"}`;
  const directions = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(site.mapQuery)}`;

  return (
    <section id="contact" className="container-page pb-16 sm:pb-24">
      <div className="grid gap-10 lg:grid-cols-2 lg:gap-16">
        <div>
          <p className="text-xs font-semibold tracking-[0.14em] text-clay-500 uppercase">{t("Direct Operations")}</p>
          <h2 className="mt-2 text-[1.75rem] font-bold sm:text-4xl">{t("Get in Touch")}</h2>
          <p className="mt-3 text-ink-soft">
            {t("Visit our architectural texture studio or call our project estimators directly for technical support.")}
          </p>
          <ul className="mt-8 grid gap-6">
            <li className="flex gap-4">
              <span className="grid size-12 shrink-0 place-items-center rounded-lg bg-clay-50 text-clay-500"><MapPinned aria-hidden="true" className="size-6" /></span>
              <div>
                <h3 className="font-sans text-base font-bold tracking-normal">{t("Lahore Head Office & Sample Studio")}</h3>
                <p className="text-sm text-ink-soft"><bdi>{site.address}</bdi></p>
              </div>
            </li>
            <li className="flex gap-4">
              <span className="grid size-12 shrink-0 place-items-center rounded-lg bg-clay-50 text-clay-500"><Phone aria-hidden="true" className="size-6" /></span>
              <div>
                <h3 className="font-sans text-base font-bold tracking-normal">{t("Phone & Engineering Helpline")}</h3>
                <a href={`tel:${site.phone.replace(/\s/g, "")}`} className="ltr-run text-sm font-semibold text-clay-600 hover:underline">{site.phone}</a>
                <p className="text-xs text-ink-muted">{t("Available Monday – Saturday, 9:00 AM – 7:00 PM")}</p>
                <OpenStatus className="mt-1" />
              </div>
            </li>
            <li className="flex gap-4">
              <span className="grid size-12 shrink-0 place-items-center rounded-lg bg-clay-50 text-clay-500"><Mail aria-hidden="true" className="size-6" /></span>
              <div>
                <h3 className="font-sans text-base font-bold tracking-normal">{t("Architectural Specifications")}</h3>
                <a href={`mailto:${site.email}`} className="ltr-run text-sm font-semibold text-clay-600 hover:underline">{site.email}</a>
              </div>
            </li>
          </ul>
          <div className="mt-8">
            <p className="text-xs font-semibold tracking-wider text-ink-muted uppercase">{t("Active Daily Crews In:")}</p>
            <ul className="mt-3 flex flex-wrap gap-2">
              {crews.map((c) => (
                <li key={c} className="rounded-full border border-line bg-surface px-3 py-1.5 text-xs font-semibold text-ink-soft">{t(c)}</li>
              ))}
            </ul>
          </div>
        </div>

        <div className="rounded-2xl border border-line bg-surface p-5 shadow-lift sm:p-8">
          <h3 className="text-xl font-bold">{t("Send a Quick Message")}</h3>
          <p className="mt-1 mb-6 text-sm text-ink-soft">{t("Tell us about your project and a project manager will respond shortly.")}</p>
          <ContactForm />
        </div>
      </div>

      <div className="mt-12 overflow-hidden rounded-2xl border border-line bg-surface shadow-card">
        <div className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
          <div>
            <h3 className="text-lg font-bold">{t("Find Our Studio")}</h3>
            <p className="mt-0.5 text-sm text-ink-soft"><bdi>{site.mapQuery}</bdi></p>
            <OpenStatus className="mt-2" />
          </div>
          <Button href={directions} variant="secondary">
            <Navigation aria-hidden="true" className="size-4" /> {t("Get Directions")}
          </Button>
        </div>
        <iframe
          title={t("Map showing the Zain & Co studio in Lahore")}
          src={mapSrc}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          className="h-72 w-full border-0 sm:h-96"
          allowFullScreen
        />
      </div>
    </section>
  );
}
