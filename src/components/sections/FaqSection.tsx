import { SectionHeading } from "@/components/ui/SectionHeading";
import { Accordion } from "@/components/ui/Accordion";
import { faqs } from "@/data/content";

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqs.map((f) => ({
    "@type": "Question",
    name: f.question,
    acceptedAnswer: { "@type": "Answer", text: f.answer },
  })),
};

export function FaqSection() {
  return (
    <section id="faq" className="border-y border-line bg-sunken/60 py-16 sm:py-24">
      <div className="container-page max-w-3xl">
        <SectionHeading
          align="center"
          eyebrow="Common Queries"
          title="Frequently Asked Questions"
          description="Transparent guidelines on texture longevity, square foot calculations, and application technicalities."
        />
        <div className="mt-10">
          <Accordion items={faqs} />
        </div>
      </div>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
    </section>
  );
}
