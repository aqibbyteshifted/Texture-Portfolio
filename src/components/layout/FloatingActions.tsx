"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowUp, Calculator, Phone } from "lucide-react";
import { WhatsAppIcon } from "@/components/ui/icons";
import { site } from "@/data/site";
import { waMessages, whatsappLink } from "@/lib/whatsapp";
import { cn } from "@/lib/cn";

/** Desktop: floating WhatsApp pill + back-to-top. Mobile: sticky three-button action bar. */
export function FloatingActions() {
  const pathname = usePathname();
  const [showTop, setShowTop] = useState(false);

  useEffect(() => {
    const onScroll = () => setShowTop(window.scrollY > 700);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  if (pathname === "/quote/confirmation") return null;

  return (
    <div className="no-print">
      <div className="fixed right-5 bottom-6 z-40 hidden flex-col items-end gap-3 lg:flex">
        <button
          type="button"
          aria-label="Back to top"
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className={cn(
            "grid size-11 place-items-center rounded-full border border-line-strong bg-surface text-ink shadow-lift transition-all hover:bg-sunken",
            showTop ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-3 opacity-0",
          )}
        >
          <ArrowUp aria-hidden="true" className="size-5" />
        </button>
        <a
          href={whatsappLink(waMessages.engineer)}
          target="_blank"
          rel="noopener noreferrer"
          className="animate-pulse-ring flex h-13 items-center gap-2.5 rounded-full bg-whatsapp px-5 text-sm font-semibold text-white shadow-lift transition-colors hover:bg-whatsapp-dark"
        >
          <WhatsAppIcon className="size-5" /> Chat with Site Engineer
        </a>
      </div>

      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-line bg-surface/95 px-3 pt-2 pb-[max(0.5rem,env(safe-area-inset-bottom))] backdrop-blur lg:hidden">
        <div className="mx-auto grid max-w-md grid-cols-[1fr_1fr_1.4fr] gap-2">
          <a
            href={`tel:${site.phone.replace(/\s/g, "")}`}
            className="flex h-11 items-center justify-center gap-1.5 rounded-control border border-line-strong text-sm font-semibold"
          >
            <Phone aria-hidden="true" className="size-4" /> Call
          </a>
          <Link
            href="/quote"
            className="flex h-11 items-center justify-center gap-1.5 rounded-control bg-clay-500 text-sm font-semibold text-white"
          >
            <Calculator aria-hidden="true" className="size-4" /> Quote
          </Link>
          <a
            href={whatsappLink(waMessages.engineer)}
            target="_blank"
            rel="noopener noreferrer"
            className="flex h-11 items-center justify-center gap-1.5 rounded-control bg-whatsapp text-sm font-semibold text-white"
          >
            <WhatsAppIcon className="size-4" /> WhatsApp
          </a>
        </div>
      </div>
    </div>
  );
}
