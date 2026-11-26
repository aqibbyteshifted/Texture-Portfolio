import type { Metadata } from "next";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { HouseEstimator } from "@/components/features/HouseEstimator";
import { getI18n } from "@/i18n/server";

export const metadata: Metadata = {
  title: "Whole-House Estimate: Walls, Floors, Mumty & Boundary",
  description: "Enter the width and height of your front, side, upper-floor, mumty, parapet and boundary walls and get one combined wall-texture estimate for the whole house.",
  alternates: { canonical: "/house-estimator" },
};

export default async function HouseEstimatorPage() {
  const { t } = await getI18n();
  return (
    <div className="container-page py-12 sm:py-16">
      <div className="no-print">
        <SectionHeading
          as="h1"
          eyebrow={t("Help & Tools")}
          title={t("Whole-House Estimate")}
          description={t("Add each part of your house: front, sides, upper floors, mumty, roof boundary and boundary walls. Know only a rough total? Use a lump-sum row instead.")}
        />
      </div>
      <div className="mt-10">
        <HouseEstimator />
      </div>
    </div>
  );
}
