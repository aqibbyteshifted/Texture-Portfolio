import { SectionHeading } from "@/components/ui/SectionHeading";
import { Accordion } from "@/components/ui/Accordion";
import { faqs, priceExtremes } from "@/data/content";
import { getI18n } from "@/i18n/server";

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqs.map((f) => ({
    "@type": "Question",
    name: f.question,
    acceptedAnswer: { "@type": "Answer", text: f.answer },
  })),
};

export async function FaqSection() {
  const { t } = await getI18n();
  const { cheapest, priciest } = priceExtremes;
  const items = faqs.map((f) => ({
    ...f,
    question: t(f.question),
    answer:
      f.id === "f1"
        ? t("Our turnkey rates range from PKR {min} / sq ft for {minName} up to PKR {max} / sq ft for {maxName}. This rate is all-inclusive, covering base preparation, imported materials, skilled karigar labor, and final protective sealing. See each finish's page for its exact rate.", {
            min: cheapest.rate,
            max: priciest.rate,
            minName: t(cheapest.name),
            maxName: t(priciest.name),
          })
        : t(f.answer),
  }));
  return (
    <section id="faq" className="border-y border-line bg-sunken/60 py-16 sm:py-24">
      <div className="container-page max-w-3xl">
        <SectionHeading
          align="center"
          eyebrow={t("Common Queries")}
          title={t("Frequently Asked Questions")}
          description={t("Transparent guidelines on texture longevity, square foot calculations, and application technicalities.")}
        />
        <div className="mt-10">
          <Accordion items={items} />
        </div>
      </div>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
    </section>
  );
}
