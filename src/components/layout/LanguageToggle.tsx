"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { Languages } from "lucide-react";
import { LOCALE_COOKIE, type Locale } from "@/i18n/config";
import { useLocale } from "@/i18n/client";
import { cn } from "@/lib/cn";

/** Switches between English and Urdu by setting a cookie and re-rendering the server components. */
export function LanguageToggle({ className, tone = "light" }: { className?: string; tone?: "light" | "dark" }) {
  const locale = useLocale();
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const next: Locale = locale === "en" ? "ur" : "en";

  return (
    <button
      type="button"
      lang={next}
      disabled={pending}
      aria-label={next === "ur" ? "Switch to Urdu" : "Switch to English"}
      onClick={() => {
        document.cookie = `${LOCALE_COOKIE}=${next}; path=/; max-age=31536000; samesite=lax`;
        startTransition(() => router.refresh());
      }}
      className={cn(
        "inline-flex items-center gap-1.5 rounded-md px-2.5 py-1 text-[13px] font-semibold transition-colors disabled:opacity-60",
        tone === "dark" ? "text-white/80 hover:bg-white/10 hover:text-white" : "border border-line-strong bg-surface text-ink hover:bg-sunken",
        className,
      )}
    >
      <Languages aria-hidden="true" className="size-3.5" />
      {next === "ur" ? "اردو" : "English"}
    </button>
  );
}
