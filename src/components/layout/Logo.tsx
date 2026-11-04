import Link from "next/link";
import { Landmark } from "lucide-react";
import { cn } from "@/lib/cn";
import { site } from "@/data/site";

export function Logo({ className, light = false }: { className?: string; light?: boolean }) {
  return (
    <Link href="/" aria-label={`${site.name} home`} className={cn("flex items-center gap-3", className)}>
      <span className="grid size-10 place-items-center rounded-lg bg-clay-500 text-white shadow-sm">
        <Landmark aria-hidden="true" className="size-5" />
      </span>
      <span className="leading-tight">
        <span className={cn("font-display block text-lg font-extrabold tracking-tight", light ? "text-white" : "text-ink")}>
          ZAIN &amp; CO
        </span>
        <span
          className={cn(
            "block text-[10px] font-medium tracking-[0.14em] uppercase",
            light ? "text-white/60" : "text-ink-muted",
          )}
        >
          {site.tagline}
        </span>
      </span>
    </Link>
  );
}
