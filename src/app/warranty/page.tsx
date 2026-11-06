import type { Metadata } from "next";
import { BadgeCheck, ClipboardCheck, Hammer, Send } from "lucide-react";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { CareGuide } from "@/components/features/CareGuide";
import { PaymentPolicy } from "@/components/features/PaymentPolicy";
import { ClaimForm } from "@/components/features/ClaimForm";
import { WarrantyCard } from "@/components/features/WarrantyCard";
import { careTips } from "@/data/care";
import { warrantyCoverage } from "@/data/credentials";
import { textures } from "@/data/textures";
import { getI18n } from "@/i18n/server";
import { msg } from "@/i18n/config";

export const metadata: Metadata = {
  title: "3-Year Warranty, Claims & Care Guide",
  description: "What the Zain & Co 3-year written warranty covers, how to make a claim, and how to care for each finish.",
  alternates: { canonical: "/warranty" },
};

const steps = [
  { icon: Send, title: msg("Submit your claim"), text: msg("Tell us what you see and where. Photos on WhatsApp help.") },
  { icon: ClipboardCheck, title: msg("We inspect"), text: msg("Our maintenance crew visits, usually within 48 hours, to assess the wall.") },
  { icon: Hammer, title: msg("We repair"), text: msg("Covered issues are re-troweled and sealed at no cost to you.") },
] as const;

export default async function WarrantyPage() {
  const { t } = await getI18n();
  const care = textures.map((x) => ({ slug: x.slug, name: x.name, tips: careTips(x) }));

  return (
    <>
      <section className="container-page grid gap-10 py-12 sm:py-16 lg:grid-cols-[1fr_1.05fr] lg:items-center lg:gap-16">
        <div>
          <SectionHeading
            as="h1"
            eyebrow={t("Credentials & Warranty")}
            title={t("Our 3-Year Written Warranty")}
            description={t("Every project comes with a stamped warranty card. Here is what it covers and how to claim.")}
          />
          <ul className="mt-6 grid gap-2.5">
            {warrantyCoverage.map((c) => (
              <li key={c} className="flex items-center gap-2.5 text-ink-soft">
                <BadgeCheck aria-hidden="true" className="size-5 shrink-0 text-clay-500" /> {t(c)}
              </li>
            ))}
          </ul>
          <p className="mt-5 text-sm text-ink-muted">{t("The full terms are printed on your warranty card. Ask your site engineer if anything is unclear.")}</p>
        </div>
        <WarrantyCard />
      </section>

      <section className="border-y border-line bg-sunken/60 py-16 sm:py-20">
        <div className="container-page">
          <SectionHeading align="center" eyebrow={t("How it works")} title={t("Making a warranty claim")} />
          <ol className="mt-10 grid gap-5 sm:grid-cols-3">
            {steps.map((s, i) => (
              <li key={s.title} className="rounded-card border border-line bg-surface p-6 shadow-card">
                <span className="grid size-12 place-items-center rounded-full bg-clay-500 text-white">
                  <s.icon aria-hidden="true" className="size-5" />
                </span>
                <p className="mt-4 text-xs font-bold tracking-wider text-clay-600 uppercase">{t("Step {n}", { n: i + 1 })}</p>
                <h2 className="mt-1 text-lg font-bold">{t(s.title)}</h2>
                <p className="mt-2 text-sm leading-relaxed text-ink-soft">{t(s.text)}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="container-page pb-4">
        <PaymentPolicy />
      </section>

      <section id="claim" className="container-page grid gap-10 py-16 sm:py-20 lg:grid-cols-[1fr_1.2fr] lg:gap-16">
        <div>
          <SectionHeading eyebrow={t("Warranty claim")} title={t("Report a problem")} description={t("Fill in the form and we will arrange an inspection. You can also send photos on WhatsApp after submitting.")} />
        </div>
        <div className="rounded-2xl border border-line bg-surface p-5 shadow-lift sm:p-8">
          <ClaimForm />
        </div>
      </section>

      <section id="care" className="container-page max-w-3xl pb-20">
        <SectionHeading align="center" eyebrow={t("Care guide")} title={t("Keeping each finish looking its best")} description={t("Simple habits that make your finish last. Pick your finish below.")} />
        <div className="mt-8">
          <CareGuide items={care} />
        </div>
      </section>
    </>
  );
}
