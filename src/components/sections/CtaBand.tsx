import { Check } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { WhatsAppIcon } from "@/components/ui/icons";
import { getI18n } from "@/i18n/server";
import { waMessages, whatsappLink } from "@/lib/whatsapp";
import { quoteHref } from "@/lib/quoteLink";

const assurances = ["No Advance for Site Survey", "Real Touch Sample Boards", "Lahore City-Wide Coverage"];

export async function CtaBand() {
  const { t } = await getI18n();
  return (
    <section className="container-page py-16 sm:py-24">
      <div className="relative isolate overflow-hidden rounded-3xl bg-clay-600 px-6 py-14 text-center text-white sm:px-12 sm:py-20">
        <div aria-hidden="true" className="absolute -end-24 -top-24 -z-10 size-96 rounded-full bg-clay-500/60 blur-3xl" />
        <div aria-hidden="true" className="absolute -start-20 -bottom-32 -z-10 size-96 rounded-full bg-ink/40 blur-3xl" />
        <p className="text-xs font-semibold tracking-[0.14em] text-sand-300 uppercase">{t("Start Your Project Today")}</p>
        <h2 className="mx-auto mt-3 max-w-3xl text-3xl leading-[1.1] font-extrabold sm:text-5xl">
          {t("Ready to Transform Your Ordinary Walls into Architectural Works of Art?")}
        </h2>
        <p className="mx-auto mt-5 max-w-2xl text-white/80 sm:text-lg">
          {t("Book your complimentary site audit in Lahore today. Our lead engineer will visit with physical sample boards and provide an exact, itemized quotation within 24 hours.")}
        </p>
        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <Button href={quoteHref()} variant="dark" size="lg">
            {t("Book Free On-Site Visit")}
          </Button>
          <Button href={whatsappLink(waMessages.visit)} variant="whatsapp" size="lg">
            <WhatsAppIcon className="size-5" /> {t("Chat Directly on WhatsApp")}
          </Button>
        </div>
        <ul className="mt-8 flex flex-wrap justify-center gap-x-8 gap-y-2 text-sm font-medium text-white/85">
          {assurances.map((a) => (
            <li key={a} className="flex items-center gap-2">
              <Check aria-hidden="true" className="size-4 text-sand-300" strokeWidth={3} /> {t(a)}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
