"use client";

import { useState } from "react";
import { CircleCheck, Send } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Field } from "@/components/ui/Field";
import { useLeadSubmit } from "@/hooks/useLeadSubmit";

export function ContactForm() {
  const { status, error, fieldErrors, lead, submit, reset, submitting } = useLeadSubmit();
  const [values, setValues] = useState({ name: "", phone: "", email: "", message: "", hp: "" });
  const set = (key: keyof typeof values) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
    setValues((v) => ({ ...v, [key]: e.target.value }));

  if (status === "success" && lead) {
    return (
      <div role="status" className="rounded-xl border border-emerald-200 bg-emerald-50 p-6 text-center">
        <CircleCheck aria-hidden="true" className="mx-auto size-10 text-emerald-600" />
        <p className="mt-3 text-sm text-ink-soft">
          Message dispatched successfully! A project manager will review your specs shortly. Reference{" "}
          <strong className="text-ink">#{lead.ref}</strong>.
        </p>
        <Button variant="secondary" size="sm" className="mt-4" onClick={reset}>
          Send another message
        </Button>
      </div>
    );
  }

  return (
    <form
      noValidate
      onSubmit={(e) => {
        e.preventDefault();
        void submit({ type: "message", ...values });
      }}
      className="grid gap-4"
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Your Name" required autoComplete="name" value={values.name} onChange={set("name")} error={fieldErrors.name} />
        <Field label="Phone / WhatsApp" required type="tel" inputMode="tel" autoComplete="tel" value={values.phone} onChange={set("phone")} error={fieldErrors.phone} placeholder="0300 1234567" />
      </div>
      <Field label="Email Address" type="email" autoComplete="email" value={values.email} onChange={set("email")} error={fieldErrors.email} />
      <Field label="Message or Project Scope" required as="textarea" value={values.message} onChange={set("message")} error={fieldErrors.message} />
      <input tabIndex={-1} autoComplete="off" aria-hidden="true" value={values.hp} onChange={set("hp")} className="absolute -left-[9999px] h-0 w-0 opacity-0" name="website" />
      {error && (
        <p role="alert" className="rounded-lg bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
          {error}
        </p>
      )}
      <Button type="submit" size="lg" disabled={submitting}>
        {submitting ? "Sending…" : "Send Message to Lead Estimator"} <Send aria-hidden="true" className="size-4" />
      </Button>
    </form>
  );
}
