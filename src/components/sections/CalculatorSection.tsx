import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import { CostCalculator } from "@/components/features/CostCalculator";
import { Button } from "@/components/ui/Button";
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
        <div className="mt-8 flex flex-col items-center gap-3 text-center">
          <p className="text-sm text-ink-soft">{t("Have a full house with upper floors, mumty and boundary walls?")}</p>
          <Button href="/house-estimator" variant="secondary" size="lg">{t("Try the Whole-House Estimate")}</Button>
        </div>
      </div>
    </section>
  );
}
