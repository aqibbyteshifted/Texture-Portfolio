"use client";

import { useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { saveReferral } from "@/lib/referral";

/** Remembers `?referral=CODE` so it is attached to any enquiry the visitor submits within 30 days. */
export function ReferralCapture() {
  const params = useSearchParams();
  const code = params.get("referral");
  useEffect(() => {
    if (code) saveReferral(code);
  }, [code]);
  return null;
}
