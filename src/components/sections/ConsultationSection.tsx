import { CircleCheck } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Reveal } from "@/components/ui/Reveal";
import { WhatsAppIcon } from "@/components/ui/icons";
import { getI18n } from "@/i18n/server";
import { whatsappLink } from "@/lib/whatsapp";

const perks = [
  { title: "Accurate Laser Measurement", text: "Zero guesswork. Exact square footage prevents paying for excess materials." },
  { title: "Moisture & Substrate Check", text: "Electronic dampness probe test ensures plaster is ready for optimal adhesion." },
  { title: "No Obligation or Pressure", text: "Receive your comprehensive itemized quotation. Proceed only if 100% satisfied." },
];

/** Free site-visit pitch. Bookings go through the quote wizard (it already asks for visit date and time) or WhatsApp. */
export async function ConsultationSection() {
  const { t } = await getI18n();
  return (
    <section id="consultation" className="border-y border-line bg-sunken/60 py-16 sm:py-24">
      <div className="container-page grid gap-10 lg:grid-cols-[1fr_1.1fr] lg:items-center lg:gap-16">
        <div>
          <h2 className="text-[1.75rem] leading-[1.1] font-bold sm:text-4xl">{t("Touch & Feel Real Texture Boards at Your Site")}</h2>
          <p className="mt-4 text-[15px] leading-relaxed text-ink-soft sm:text-base">
            {t("Don't commit from tiny catalog photos. Schedule an on-site consultation and our senior engineer will bring authentic 1×1 ft physical texture samples directly to your doorstep in Lahore.")}
          </p>
          <ul className="mt-8 grid gap-5">
            {perks.map((p) => (
              <li key={p.title} className="flex gap-3">
                <CircleCheck aria-hidden="true" className="mt-0.5 size-6 shrink-0 text-brand-500" />
                <div>
                  <h3 className="font-sans text-base font-bold tracking-normal">{t(p.title)}</h3>
                  <p className="text-sm text-ink-soft">{t(p.text)}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>

        <Reveal>
          <div className="rounded-2xl border border-line bg-surface p-6 shadow-lift sm:p-8">
            <h3 className="text-xl font-bold">{t("Book Your Free Site Consultation")}</h3>
            <p className="mt-2 text-sm leading-relaxed text-ink-soft">
              {t("Our quote request takes about two minutes and lets you pick a visit date. Prefer to talk? WhatsApp us for an urgent inspection within 24 hours.")}
            </p>
            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              <Button href="/quote" size="lg">{t("Request a Free Quote")}</Button>
              <Button href={whatsappLink("Salam Zain & Co, I would like to book a free site visit in Lahore.")} variant="whatsapp" size="lg">
                <WhatsAppIcon className="size-5" /> {t("Chat on WhatsApp")}
              </Button>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
