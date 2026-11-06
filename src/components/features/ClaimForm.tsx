"use client";

import { useState } from "react";
import { CircleCheck, Send } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Field } from "@/components/ui/Field";
import { WhatsAppIcon } from "@/components/ui/icons";
import { claimIssues } from "@/data/care";
import { useLeadSubmit } from "@/hooks/useLeadSubmit";
import { useT } from "@/i18n/client";
import { whatsappLink } from "@/lib/whatsapp";

const toDateInput = (d: Date) => new Date(d.getTime() - d.getTimezoneOffset() * 60_000).toISOString().slice(0, 10);

export function ClaimForm() {
  const t = useT();
  const { status, error, fieldErrors, lead, submit, reset, submitting } = useLeadSubmit();
  const [values, setValues] = useState({ name: "", phone: "", email: "", quoteRef: "", area: "", issue: claimIssues[0] as string, date: "", message: "", hp: "" });
  const set = (key: keyof typeof values) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
    setValues((v) => ({ ...v, [key]: e.target.value }));
  const err = (key: string) => (fieldErrors[key] ? t(fieldErrors[key]) : undefined);

  if (status === "success" && lead) {
    return (
      <div role="status" className="rounded-xl border border-emerald-200 bg-emerald-50 p-6 text-center">
        <CircleCheck aria-hidden="true" className="mx-auto size-12 text-emerald-600" />
        <h3 className="mt-3 text-xl font-bold text-ink">{t("Warranty claim received")}</h3>
        <p className="mt-2 text-sm text-ink-soft">
          {t("Thank you, {name}. Our maintenance crew will contact you to arrange an inspection, usually within 48 hours. Your claim reference is", { name: lead.name.split(" ")[0] })}{" "}
          <strong className="ltr-run text-ink">#{lead.ref}</strong>.
        </p>
        <div className="mt-5 flex flex-col justify-center gap-3 sm:flex-row">
          <Button href={whatsappLink(`Salam Zain & Co, I submitted warranty claim #${lead.ref}. Sharing photos of the issue here.`)} variant="whatsapp">
            <WhatsAppIcon className="size-4" /> {t("Send photos on WhatsApp")}
          </Button>
          <Button variant="secondary" onClick={reset}>
            {t("Submit another claim")}
          </Button>
        </div>
      </div>
    );
  }

  return (
    <form
      noValidate
      onSubmit={(e) => {
        e.preventDefault();
        void submit({ type: "claim", ...values, date: values.date || undefined });
      }}
      className="grid gap-4"
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label={t("Full Name")} required autoComplete="name" value={values.name} onChange={set("name")} error={err("name")} />
        <Field label={t("WhatsApp / Phone Number")} required type="tel" inputMode="tel" autoComplete="tel" value={values.phone} onChange={set("phone")} error={err("phone")} placeholder="0300 1234567" dir="ltr" />
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label={t("Email (optional)")} type="email" autoComplete="email" value={values.email} onChange={set("email")} error={err("email")} dir="ltr" />
        <Field label={t("Original quote reference (optional)")} value={values.quoteRef} onChange={set("quoteRef")} placeholder="ZC-2026-1234" dir="ltr" />
      </div>
      <Field label={t("Site address")} required value={values.area} onChange={set("area")} error={err("area")} placeholder={t("e.g. House 42, DHA Phase 6")} />
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label={t("What is the issue?")} as="select" value={values.issue} onChange={set("issue")} options={claimIssues.map((i) => ({ value: i, label: t(i) }))} error={err("issue")} />
        <Field label={t("When did you notice it? (optional)")} type="date" max={toDateInput(new Date())} value={values.date} onChange={set("date")} />
      </div>
      <Field label={t("Describe the problem")} required as="textarea" value={values.message} onChange={set("message")} error={err("message")} placeholder={t("Which wall, how big is the affected area, has it got worse after rain…")} />
      <input tabIndex={-1} autoComplete="off" aria-hidden="true" value={values.hp} onChange={set("hp")} className="absolute -left-[9999px] h-0 w-0 opacity-0" name="website" />
      {error && (
        <p role="alert" className="rounded-lg bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
          {t(error)}
        </p>
      )}
      <Button type="submit" size="lg" disabled={submitting}>
        {submitting ? t("Sending…") : t("Submit warranty claim")} <Send aria-hidden="true" className="size-4 rtl:-scale-x-100" />
      </Button>
    </form>
  );
}
