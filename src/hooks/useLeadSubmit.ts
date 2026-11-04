"use client";

import { useCallback, useState } from "react";
import type { LeadInput } from "@/lib/validation";
import type { LeadRecord } from "@/types";

type Status = "idle" | "submitting" | "success" | "error";

interface ApiResult {
  ok: boolean;
  error?: string;
  fields?: Record<string, string>;
  lead?: LeadRecord;
}

export const LAST_LEAD_KEY = "zc:last-lead";

export function useLeadSubmit() {
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState<string>();
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [lead, setLead] = useState<LeadRecord>();

  const submit = useCallback(async (payload: LeadInput): Promise<LeadRecord | null> => {
    setStatus("submitting");
    setError(undefined);
    setFieldErrors({});
    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = (await res.json()) as ApiResult;
      if (!res.ok || !data.ok || !data.lead) {
        setStatus("error");
        setError(data.error ?? "Something went wrong. Please try again or WhatsApp us.");
        setFieldErrors(data.fields ?? {});
        return null;
      }
      try {
        sessionStorage.setItem(LAST_LEAD_KEY, JSON.stringify(data.lead));
      } catch {
        /* storage unavailable (private mode): confirmation page falls back gracefully */
      }
      setLead(data.lead);
      setStatus("success");
      return data.lead;
    } catch {
      setStatus("error");
      setError("Network error. Check your connection or WhatsApp us directly.");
      return null;
    }
  }, []);

  const reset = useCallback(() => {
    setStatus("idle");
    setError(undefined);
    setFieldErrors({});
    setLead(undefined);
  }, []);

  return { status, error, fieldErrors, lead, submit, reset, submitting: status === "submitting" };
}
