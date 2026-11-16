import type { Metadata } from "next";
import { LegalDoc } from "@/components/ui/LegalDoc";
import { PaymentPolicy } from "@/components/features/PaymentPolicy";
import { termsSections } from "@/data/legal";
import { getI18n } from "@/i18n/server";

export const metadata: Metadata = {
  title: "Terms & Conditions",
  description: "How Zain & Co quotes, schedules, invoices and warrants wall-texture work, including our rule to pay only the company, never the workers.",
  alternates: { canonical: "/terms" },
};

export default async function TermsPage() {
  const { t } = await getI18n();
  return (
    <LegalDoc
      title={t("Terms & Conditions")}
      intro={t("Plain-language terms for estimates, payments, scheduling and warranty on every Zain & Co project.")}
      sections={termsSections}
      inject={{ afterId: "payments", node: <PaymentPolicy /> }}
    />
  );
}
