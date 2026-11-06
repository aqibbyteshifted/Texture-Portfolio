"use client";

import { useEffect, useState } from "react";
import { useT } from "@/i18n/client";
import { getOpenState, type OpenState } from "@/lib/hours";
import { cn } from "@/lib/cn";

/** Live "Open now / Closed" indicator based on Lahore time. Renders nothing until mounted to avoid hydration mismatch. */
export function OpenStatus({ className, tone = "light" }: { className?: string; tone?: "light" | "dark" }) {
  const t = useT();
  const [state, setState] = useState<OpenState | null>(null);

  useEffect(() => {
    const update = () => setState(getOpenState());
    update();
    const id = setInterval(update, 60_000);
    return () => clearInterval(id);
  }, []);

  if (!state) return <span className={cn("inline-block h-4 w-32", className)} aria-hidden="true" />;

  const label = state.open
    ? t("Open now • closes {time}", { time: state.closesAt })
    : state.opensDay === "today"
      ? t("Closed • opens today {time}", { time: state.opensAt })
      : state.opensDay === "tomorrow"
        ? t("Closed • opens tomorrow {time}", { time: state.opensAt })
        : t("Closed • opens {day} {time}", { day: t(state.opensDay), time: state.opensAt });

  return (
    <span className={cn("inline-flex items-center gap-1.5 text-xs font-semibold", className)} role="status">
      <span className={cn("size-2 rounded-full", state.open ? "bg-whatsapp" : "bg-red-500")} aria-hidden="true" />
      <span className={cn(tone === "dark" ? "text-white/85" : state.open ? "text-emerald-700" : "text-red-600")}>{label}</span>
    </span>
  );
}
