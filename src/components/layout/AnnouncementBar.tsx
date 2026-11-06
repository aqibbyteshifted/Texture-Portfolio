"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight, Sparkles, X } from "lucide-react";
import { site } from "@/data/site";
import { useT } from "@/i18n/client";

const storageKey = (id: string) => `zc:announcement:${id}`;

/** Dismissible promo bar, configured in data/site.ts. Visible on first paint, hidden on return visits once dismissed. */
export function AnnouncementBar() {
  const t = useT();
  const { enabled, id, text, cta, href } = site.announcement;
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    try {
      if (localStorage.getItem(storageKey(id)) === "1") setHidden(true);
    } catch {
      /* storage blocked: keep showing */
    }
  }, [id]);

  if (!enabled || hidden) return null;

  return (
    <div className="no-print relative bg-clay-600 text-white" role="region" aria-label={t("Announcement")}>
      <div className="container-page flex min-h-10 items-center justify-center gap-3 py-2 pe-10 text-center text-[13px] font-medium">
        <Sparkles aria-hidden="true" className="hidden size-4 shrink-0 text-sand-300 sm:block" />
        <p>{t(text)}</p>
        <Link href={href} className="inline-flex shrink-0 items-center gap-1 font-bold underline underline-offset-2 hover:text-sand-300">
          {t(cta)} <ArrowRight aria-hidden="true" className="size-3.5 rtl:-scale-x-100" />
        </Link>
      </div>
      <button
        type="button"
        aria-label={t("Dismiss announcement")}
        onClick={() => {
          setHidden(true);
          try {
            localStorage.setItem(storageKey(id), "1");
          } catch {
            /* ignore */
          }
        }}
        className="absolute end-2 top-1/2 grid size-8 -translate-y-1/2 place-items-center rounded-full hover:bg-white/15"
      >
        <X aria-hidden="true" className="size-4" />
      </button>
    </div>
  );
}
