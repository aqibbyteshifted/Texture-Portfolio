import type { Metadata } from "next";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { WallDoctor } from "@/components/features/WallDoctor";
import { getI18n } from "@/i18n/server";

export const metadata: Metadata = {
  title: "Wall Doctor: Find the Problem Before You Texture",
  description: "Tick the damp, cracks or peeling you can see and get a step-by-step repair plan and the finishes that suit your wall.",
  alternates: { canonical: "/wall-doctor" },
};

export default async function Page() {
  const { t } = await getI18n();
  return (
    <div className="container-page py-12 sm:py-16">
      <SectionHeading as="h1" eyebrow={t("Help & Tools")} title={t("Wall Doctor")} description={t("Tick what you see on your wall and we will tell you what to fix first and which finishes suit it.")} />
      <div className="mt-10">
        <WallDoctor />
      </div>
    </div>
  );
}
