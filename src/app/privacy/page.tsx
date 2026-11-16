import type { Metadata } from "next";
import { LegalDoc } from "@/components/ui/LegalDoc";
import { privacySections } from "@/data/legal";
import { getI18n } from "@/i18n/server";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "What personal information Zain & Co collects through this website, why we collect it and how you can control it.",
  alternates: { canonical: "/privacy" },
};

export default async function PrivacyPage() {
  const { t } = await getI18n();
  return (
    <LegalDoc
      title={t("Privacy Policy")}
      intro={t("What we collect through this website, why, and the choices you have.")}
      sections={privacySections}
    />
  );
}
