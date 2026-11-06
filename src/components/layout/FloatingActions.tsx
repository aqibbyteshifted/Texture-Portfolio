"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowUp, Calculator, Headset, Phone, Send, X } from "lucide-react";
import { OpenStatus } from "@/components/ui/OpenStatus";
import { WhatsAppIcon } from "@/components/ui/icons";
import { site } from "@/data/site";
import { useT } from "@/i18n/client";
import { track } from "@/lib/analytics";
import { whatsappLink } from "@/lib/whatsapp";
import { cn } from "@/lib/cn";
import { msg } from "@/i18n/config";

interface Topic {
  id: string;
  label: string;
  /** Message sent to the business (kept in English, which the team reads) */
  message: string;
  askDetails: boolean;
}

const topics: Topic[] = [
  { id: "visit", label: msg("Book a free site visit"), message: "Salam Zain & Co, I would like to book a free site visit in Lahore.", askDetails: true },
  { id: "price", label: msg("Get a price for my walls"), message: "Salam Zain & Co, I would like a price estimate for my walls.", askDetails: true },
  { id: "choose", label: msg("Help me choose a texture"), message: "Salam Zain & Co, please help me choose the right texture for my project.", askDetails: true },
  { id: "warranty", label: msg("Warranty & process questions"), message: "Salam Zain & Co, I have questions about your warranty and application process.", askDetails: false },
];

/**
 * Desktop: floating chat button + panel, plus back-to-top. Mobile: sticky Call / Quote / WhatsApp bar
 * whose WhatsApp button opens the same chat panel as a bottom sheet.
 */
export function FloatingActions() {
  const t = useT();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [showTop, setShowTop] = useState(false);
  const [topic, setTopic] = useState<Topic | null>(null);
  const [details, setDetails] = useState({ area: "", size: "" });
  const [free, setFree] = useState("");
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onScroll = () => setShowTop(window.scrollY > 700);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    panelRef.current?.querySelector<HTMLElement>("button, input")?.focus();
    return () => window.removeEventListener("keydown", onKey);
  }, [open, topic]);

  if (pathname === "/quote/confirmation") return null;

  const reset = () => {
    setTopic(null);
    setDetails({ area: "", size: "" });
    setFree("");
  };

  const send = (message: string) => {
    track("whatsapp_click", { source: "chat_widget", topic: topic?.id ?? "free_text" });
    window.open(whatsappLink(message), "_blank", "noopener,noreferrer");
    setOpen(false);
    reset();
  };

  const sendTopic = () => {
    if (!topic) return;
    const extra = [
      details.area.trim() && `Area / sector: ${details.area.trim()}`,
      details.size.trim() && `Approx. wall size: ${details.size.trim()} sq ft`,
    ].filter(Boolean);
    send([topic.message, ...extra].join("\n"));
  };

  const toggle = () => {
    setOpen((v) => !v);
    if (open) reset();
  };

  const input =
    "h-10 w-full rounded-lg border border-line-strong bg-surface px-3 text-sm text-ink placeholder:text-ink-muted/70 focus:border-clay-500 focus:outline-none";

  return (
    <div className="no-print">
      {/* Chat panel */}
      <div
        ref={panelRef}
        role="dialog"
        aria-label={t("Chat with our site team on WhatsApp")}
        inert={!open}
        className={cn(
          "fixed z-50 flex max-h-[min(34rem,72dvh)] flex-col overflow-hidden rounded-2xl border border-line bg-surface shadow-modal transition-all duration-300",
          "inset-x-3 bottom-[4.75rem] lg:inset-x-auto lg:end-5 lg:bottom-[5.5rem] lg:w-[22rem]",
          open ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-4 opacity-0",
        )}
      >
        <div className="flex items-center gap-3 bg-[#128c4a] px-4 py-3 text-white">
          <span className="grid size-10 shrink-0 place-items-center rounded-full bg-white/15">
            <Headset aria-hidden="true" className="size-5" />
          </span>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-bold">{t("Zain & Co Site Team")}</p>
            <OpenStatus tone="dark" className="[&_span]:text-white/85" />
          </div>
          <button type="button" onClick={toggle} aria-label={t("Close")} className="grid size-9 place-items-center rounded-full hover:bg-white/15">
            <X aria-hidden="true" className="size-5" />
          </button>
        </div>

        <div className="min-h-0 flex-1 space-y-3 overflow-y-auto bg-[#efeae2] p-4">
          <p className="max-w-[85%] rounded-2xl rounded-ss-sm bg-white px-3.5 py-2.5 text-sm shadow-sm">
            {t("Salam! 👋 How can we help you today?")}
            <span className="mt-1 block text-[11px] text-ink-muted">{t("We usually reply within 15 minutes during opening hours.")}</span>
          </p>

          {!topic ? (
            <div className="flex flex-col items-end gap-2">
              {topics.map((x) => (
                <button
                  key={x.id}
                  type="button"
                  onClick={() => (x.askDetails ? setTopic(x) : send(x.message))}
                  className="rounded-full border border-[#128c4a]/40 bg-white px-4 py-2 text-sm font-semibold text-[#0b6b38] shadow-sm transition-colors hover:bg-[#d9fdd3]"
                >
                  {t(x.label)}
                </button>
              ))}
              <a
                href={`tel:${site.phone.replace(/\s/g, "")}`}
                className="inline-flex items-center gap-1.5 rounded-full border border-line-strong bg-white px-4 py-2 text-sm font-semibold text-ink shadow-sm hover:bg-sunken"
              >
                <Phone aria-hidden="true" className="size-4" /> {t("Call us now")}
              </a>
            </div>
          ) : (
            <>
              <p className="ms-auto max-w-[85%] rounded-2xl rounded-se-sm bg-[#d9fdd3] px-3.5 py-2.5 text-sm shadow-sm">{t(topic.label)}</p>
              <div className="max-w-[92%] space-y-2.5 rounded-2xl rounded-ss-sm bg-white p-3.5 shadow-sm">
                <p className="text-sm">{t("Great! Share these if you know them. Both are optional.")}</p>
                <input className={input} value={details.area} onChange={(e) => setDetails((d) => ({ ...d, area: e.target.value }))} placeholder={t("Your area / sector, e.g. DHA Phase 6")} aria-label={t("Your area / sector")} />
                <input className={input} inputMode="numeric" value={details.size} onChange={(e) => setDetails((d) => ({ ...d, size: e.target.value }))} placeholder={t("Approx. wall size in sq ft")} aria-label={t("Approx. wall size in sq ft")} />
                <button type="button" onClick={sendTopic} className="flex h-10 w-full items-center justify-center gap-2 rounded-lg bg-whatsapp text-sm font-semibold text-white hover:bg-whatsapp-dark">
                  <WhatsAppIcon className="size-4" /> {t("Continue on WhatsApp")}
                </button>
                <button type="button" onClick={reset} className="w-full text-center text-xs font-semibold text-ink-muted hover:text-ink">
                  {t("Back")}
                </button>
              </div>
            </>
          )}
        </div>

        <form
          className="flex items-center gap-2 border-t border-line bg-surface p-3"
          onSubmit={(e) => {
            e.preventDefault();
            if (free.trim()) send(free.trim());
          }}
        >
          <input className={input} value={free} onChange={(e) => setFree(e.target.value)} placeholder={t("Type your message…")} aria-label={t("Type your message…")} />
          <button type="submit" disabled={!free.trim()} aria-label={t("Send")} className="grid size-10 shrink-0 place-items-center rounded-full bg-whatsapp text-white hover:bg-whatsapp-dark disabled:opacity-50">
            <Send aria-hidden="true" className="size-4 rtl:-scale-x-100" />
          </button>
        </form>
      </div>

      {/* Desktop launcher */}
      <div className="fixed end-5 bottom-6 z-40 hidden flex-col items-end gap-3 lg:flex">
        <button
          type="button"
          aria-label={t("Back to top")}
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className={cn(
            "grid size-11 place-items-center rounded-full border border-line-strong bg-surface text-ink shadow-lift transition-all hover:bg-sunken",
            showTop ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-3 opacity-0",
          )}
        >
          <ArrowUp aria-hidden="true" className="size-5" />
        </button>
        <button
          type="button"
          aria-expanded={open}
          onClick={toggle}
          className={cn(
            "flex h-13 items-center gap-2.5 rounded-full bg-whatsapp px-5 text-sm font-semibold text-white shadow-lift transition-colors hover:bg-whatsapp-dark",
            !open && "animate-pulse-ring",
          )}
        >
          {open ? <X aria-hidden="true" className="size-5" /> : <WhatsAppIcon className="size-5" />}
          {open ? t("Close chat") : t("Chat with Site Engineer")}
        </button>
      </div>

      {/* Mobile action bar */}
      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-line bg-surface/95 px-3 pt-2 pb-[max(0.5rem,env(safe-area-inset-bottom))] backdrop-blur lg:hidden">
        <div className="mx-auto grid max-w-md grid-cols-[1fr_1fr_1.4fr] gap-2">
          <a
            href={`tel:${site.phone.replace(/\s/g, "")}`}
            className="flex h-11 items-center justify-center gap-1.5 rounded-control border border-line-strong text-sm font-semibold"
          >
            <Phone aria-hidden="true" className="size-4" /> {t("Call")}
          </a>
          <Link
            href="/quote"
            className="flex h-11 items-center justify-center gap-1.5 rounded-control bg-clay-500 text-sm font-semibold text-white"
          >
            <Calculator aria-hidden="true" className="size-4" /> {t("Quote")}
          </Link>
          <button
            type="button"
            aria-expanded={open}
            onClick={toggle}
            className="flex h-11 items-center justify-center gap-1.5 rounded-control bg-whatsapp text-sm font-semibold text-white"
          >
            <WhatsAppIcon className="size-4" /> {t("WhatsApp")}
          </button>
        </div>
      </div>
    </div>
  );
}
