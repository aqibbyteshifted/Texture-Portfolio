import type { Metadata } from "next";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { PrepChecklist } from "@/components/features/PrepChecklist";
import { getI18n } from "@/i18n/server";

export const metadata: Metadata = {
  title: "Pre-Work Checklist for Your Texture Project",
  description: "A printable checklist of what to do before, during and after a wall texture project in Lahore.",
  alternates: { canonical: "/prepare" },
};

export default async function Page() {
  const { t } = await getI18n();
  return (
    <div className="container-page py-12 sm:py-16">
      <SectionHeading as="h1" eyebrow={t("Help & Tools")} title={t("Pre-Work Checklist")} description={t("Tick items off as you go, or print the sheet and keep it on site.")} />
      <div className="mt-10">
        <PrepChecklist />
      </div>
    </div>
  );
}
