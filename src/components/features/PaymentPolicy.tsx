"use client";

import Link from "next/link";
import { Ban, Phone, ShieldAlert } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { WhatsAppIcon } from "@/components/ui/icons";
import { paymentRule } from "@/data/policy";
import { site } from "@/data/site";
import { useT } from "@/i18n/client";
import { whatsappLink } from "@/lib/whatsapp";
import { cn } from "@/lib/cn";

/** "No money dealings with workers: contact the company directly" notice. Use `compact` in side columns. */
export function PaymentPolicy({ compact = false, className }: { compact?: boolean; className?: string }) {
  const t = useT();
  return (
    <aside
      aria-labelledby="payment-rule-title"
      className={cn("rounded-2xl border border-brand-300/60 bg-brand-50 text-ink", compact ? "p-5 text-sm" : "p-6 sm:p-8", className)}
    >
      <div className="flex items-start gap-3">
        <span className={cn("grid shrink-0 place-items-center rounded-full bg-brand-500 text-white", compact ? "size-9" : "size-11")}>
          <Ban aria-hidden="true" className={compact ? "size-4" : "size-5"} />
        </span>
        <div>
          <h3 id="payment-rule-title" className={cn("font-bold", compact ? "text-base" : "text-xl sm:text-2xl")}>
            {t(paymentRule.title)}
          </h3>
          <p className={cn("mt-1 leading-relaxed text-ink-soft", compact ? "text-[13px]" : "text-[15px]")}>{t(paymentRule.summary)}</p>
        </div>
      </div>

      {!compact && (
        <ul className="mt-5 grid gap-2.5">
          {paymentRule.points.map((p) => (
            <li key={p} className="flex gap-2.5 text-[15px] leading-relaxed text-ink-soft">
              <ShieldAlert aria-hidden="true" className="mt-1 size-4 shrink-0 text-brand-500" /> {t(p)}
            </li>
          ))}
        </ul>
      )}

      <div className={cn("flex flex-wrap items-center gap-3", compact ? "mt-4" : "mt-6")}>
        <p className={cn("font-semibold", compact ? "text-[13px]" : "text-sm")}>{t(paymentRule.report)}</p>
        <div className="flex flex-wrap gap-2">
          <Button href={`tel:${site.phone.replace(/\s/g, "")}`} variant="secondary" size="sm">
            <Phone aria-hidden="true" className="size-4" /> <span className="ltr-run">{site.phone}</span>
          </Button>
          <Button href={whatsappLink(paymentRule.whatsappMessage)} variant="whatsapp" size="sm">
            <WhatsAppIcon className="size-4" /> {t("Report on WhatsApp")}
          </Button>
        </div>
      </div>
      {compact && (
        <Link href="/terms#payments" className="mt-3 inline-block text-[13px] font-semibold text-brand-600 underline-offset-2 hover:underline">
          {t("Read the full payment terms")}
        </Link>
      )}
    </aside>
  );
}
