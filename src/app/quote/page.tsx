import type { Metadata } from "next";
import { Suspense } from "react";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { QuoteWizard } from "@/components/features/QuoteWizard";
import { getI18n } from "@/i18n/server";

export const metadata: Metadata = {
  title: "Request a Free Quote & Site Visit",
  description:
    "Get an itemized wall texture estimate in 3 quick steps. Free laser measurement, moisture check and 1x1 ft physical sample boards anywhere in Lahore.",
  alternates: { canonical: "/quote" },
};

export default async function QuotePage() {
  const { t } = await getI18n();
  return (
    <div className="container-page py-10 sm:py-14">
      <SectionHeading
        as="h1"
        eyebrow={t("Free Estimate")}
        title={t("Request Your Itemized Quote")}
        description={t("Tell us about your walls in three quick steps. A senior surface engineer will call within 2 hours to confirm measurements.")}
        className="mb-8"
      />
      <Suspense fallback={<div className="h-96 animate-pulse rounded-2xl bg-sunken" aria-busy="true" />}>
        <QuoteWizard />
      </Suspense>
    </div>
  );
}
