"use client";

import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/cn";
import { useT } from "@/i18n/client";
import { site } from "@/data/site";

/** The company emblem (public/images/logo.jpg) next to the wordmark. The round crop hides the photo's white corners. */
export function Logo({ className, light = false, size = "md" }: { className?: string; light?: boolean; size?: "md" | "lg" }) {
  const t = useT();
  return (
    <Link href="/" aria-label={t("{name} home", { name: site.name })} className={cn("flex items-center gap-3", className)}>
      <Image
        src="/images/logo.jpg"
        alt=""
        width={160}
        height={160}
        priority
        className={cn("shrink-0 rounded-full bg-white object-cover ring-1 ring-line-strong", size === "lg" ? "size-14" : "size-11")}
      />
      <span className="leading-tight">
        <span dir="ltr" className={cn("font-display block text-start text-lg font-extrabold tracking-tight", light ? "text-white" : "text-ink")}>
          ZAIN &amp; CO
        </span>
        <span
          className={cn(
            "block text-[10px] font-medium tracking-[0.14em] uppercase",
            light ? "text-white/60" : "text-ink-muted",
          )}
        >
          {t(site.tagline)}
        </span>
      </span>
    </Link>
  );
}
