import type { Metadata } from "next";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { FinishFinder } from "@/components/features/FinishFinder";
import { getI18n } from "@/i18n/server";

export const metadata: Metadata = {
  title: "Finish Finder: Which Texture Suits You?",
  description: "Answer three questions and see the wall textures that fit your location, budget and look, with live prices.",
  alternates: { canonical: "/finish-finder" },
};

export default async function Page() {
  const { t } = await getI18n();
  return (
    <div className="container-page py-12 sm:py-16">
      <SectionHeading as="h1" eyebrow={t("Help & Tools")} title={t("Finish Finder")} description={t("Three quick questions. Prices come straight from our current price list.")} />
      <div className="mt-10">
        <FinishFinder />
      </div>
    </div>
  );
}
