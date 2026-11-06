"use client";

import { useMemo, useState } from "react";
import { CircleCheck, Send } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Field } from "@/components/ui/Field";
import { WhatsAppIcon } from "@/components/ui/icons";
import { useLeadSubmit } from "@/hooks/useLeadSubmit";
import { useT } from "@/i18n/client";
import { waMessages, whatsappLink } from "@/lib/whatsapp";
import { msg } from "@/i18n/config";

const windows = [msg("Morning (10am-1pm)"), msg("Afternoon (1pm-4pm)"), msg("Evening (4pm-7pm)")];

const toDateInput = (d: Date) => new Date(d.getTime() - d.getTimezoneOffset() * 60_000).toISOString().slice(0, 10);

export function ConsultationForm() {
  const t = useT();
  const { status, error, fieldErrors, lead, submit, reset, submitting } = useLeadSubmit();
  const [values, setValues] = useState({ name: "", phone: "", area: "", date: "", window: windows[0], message: "", hp: "" });
  const today = useMemo(() => toDateInput(new Date()), []);

  const set = (key: keyof typeof values) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
    setValues((v) => ({ ...v, [key]: e.target.value }));
  const err = (key: string) => (fieldErrors[key] ? t(fieldErrors[key]) : undefined);

  if (status === "success" && lead) {
    return (
      <div role="status" className="rounded-xl border border-emerald-200 bg-emerald-50 p-6 text-center">
        <CircleCheck aria-hidden="true" className="mx-auto size-12 text-emerald-600" />
        <h3 className="mt-3 text-xl font-bold text-ink">{t("Site visit request recorded")}</h3>
        <p className="mt-2 text-sm text-ink-soft">
          {t("Thank you, {name}! Our site supervisor will call you within 2 hours. Your reference is", { name: lead.name.split(" ")[0] })}{" "}
          <strong className="ltr-run text-ink">#{lead.ref}</strong>.
        </p>
        <div className="mt-5 flex flex-col justify-center gap-3 sm:flex-row">
          <Button href={whatsappLink(waMessages.followUp(lead.ref))} variant="whatsapp">
            <WhatsAppIcon className="size-4" /> {t("Share photos on WhatsApp")}
          </Button>
          <Button variant="secondary" onClick={reset}>
            {t("Book another visit")}
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
        void submit({ type: "visit", ...values, date: values.date || undefined });
      }}
      className="grid gap-4"
    >
      <Field label={t("Full Name")} required autoComplete="name" value={values.name} onChange={set("name")} error={err("name")} placeholder={t("e.g. Ahmed Khan")} />
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label={t("WhatsApp / Phone Number")} required type="tel" autoComplete="tel" inputMode="tel" value={values.phone} onChange={set("phone")} error={err("phone")} placeholder="0300 1234567" dir="ltr" />
        <Field label={t("Lahore Area / Sector")} required value={values.area} onChange={set("area")} error={err("area")} placeholder={t("e.g. DHA Phase 6")} />
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label={t("Preferred Date")} type="date" min={today} value={values.date} onChange={set("date")} error={err("date")} />
        <Field label={t("Preferred Inspection Window")} as="select" options={windows.map((w) => ({ value: w, label: t(w) }))} value={values.window} onChange={set("window")} />
      </div>
      <Field label={t("Textures of Interest / Project Details")} as="textarea" value={values.message} onChange={set("message")} error={err("message")} placeholder={t("e.g. Front elevation, 3,500 sq ft, Italian Travertine")} />
      {/* honeypot: hidden from people, bots fill it */}
      <input tabIndex={-1} autoComplete="off" aria-hidden="true" value={values.hp} onChange={set("hp")} className="absolute -left-[9999px] h-0 w-0 opacity-0" name="website" />

      {error && (
        <p role="alert" className="rounded-lg bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
          {t(error)}
        </p>
      )}

      <div className="grid gap-3 sm:grid-cols-[1.4fr_1fr]">
        <Button type="submit" size="lg" disabled={submitting}>
          {submitting ? t("Sending…") : t("Schedule Free On-Site Audit")} <Send aria-hidden="true" className="size-4 rtl:-scale-x-100" />
        </Button>
        <Button href={whatsappLink(waMessages.visit)} variant="whatsapp" size="lg">
          <WhatsAppIcon className="size-5" /> {t("WhatsApp Instantly")}
        </Button>
      </div>
    </form>
  );
}
