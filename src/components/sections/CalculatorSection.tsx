import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import { CostCalculator } from "@/components/features/CostCalculator";
import { getI18n } from "@/i18n/server";

export async function CalculatorSection() {
  const { t } = await getI18n();
  return (
    <section id="estimate" className="border-y border-line bg-sunken/60 py-16 sm:py-24">
      <div className="container-page">
        <SectionHeading
          align="center"
          eyebrow={t("Live Project Budgeting")}
          title={t("Instant Cost & Material Calculator")}
          description={t("Calculate turnkey expenditure including imported raw materials, primer preparation coats, scaffolding, and artisan labour in Lahore.")}
        />
        <Reveal className="mt-10">
          <CostCalculator />
        </Reveal>
      </div>
    </section>
  );
}
