import type { Metadata } from "next";
import { Suspense } from "react";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { CompareTool } from "@/components/features/CompareTool";
import { getI18n } from "@/i18n/server";

export const metadata: Metadata = {
  title: "Compare Wall Texture Finishes",
  description:
    "Compare Zain & Co finishes side by side: rate, estimated cost for your wall area, thickness, curing time, performance and shades.",
  alternates: { canonical: "/compare" },
};

export default async function ComparePage() {
  const { t } = await getI18n();
  return (
    <div className="container-page py-10 sm:py-14">
      <SectionHeading
        as="h1"
        eyebrow={t("Texture Ecosystem")}
        title={t("Compare Finishes Side by Side")}
        description={t("Choose up to three finishes and see rate, estimated cost for your wall, durability and shades together.")}
        className="mb-8"
      />
      <Suspense fallback={<div className="h-96 animate-pulse rounded-2xl bg-sunken" aria-busy="true" />}>
        <CompareTool />
      </Suspense>
    </div>
  );
}
