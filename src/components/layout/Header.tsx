"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowRight, Clock, Menu, Phone, ShieldCheck, X } from "lucide-react";
import { LanguageToggle } from "@/components/layout/LanguageToggle";
import { Logo } from "@/components/layout/Logo";
import { Button } from "@/components/ui/Button";
import { OpenStatus } from "@/components/ui/OpenStatus";
import { WhatsAppIcon } from "@/components/ui/icons";
import { navLinks, site } from "@/data/site";
import { useT } from "@/i18n/client";
import { waMessages, whatsappLink } from "@/lib/whatsapp";
import { cn } from "@/lib/cn";

export function Header() {
  const t = useT();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [hash, setHash] = useState("");

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    const onHash = () => setHash(window.location.hash);
    onScroll();
    onHash();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("hashchange", onHash);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("hashchange", onHash);
    };
  }, []);

  useEffect(() => setOpen(false), [pathname]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/" && !hash;
    if (href.startsWith("/#")) return pathname === "/" && hash === href.slice(1);
    return pathname === href || pathname.startsWith(`${href}/`);
  };

  return (
    <>
      <div className="no-print hidden bg-ink text-[12px] text-white/80 lg:block">
        <div className="container-page flex h-9 items-center justify-between">
          <div className="flex items-center gap-5">
            <a href={`tel:${site.phone.replace(/\s/g, "")}`} className="flex items-center gap-1.5 hover:text-white">
              <Phone aria-hidden="true" className="size-3.5" /> <span className="ltr-run">{site.phone}</span>
            </a>
            <span className="flex items-center gap-1.5">
              <Clock aria-hidden="true" className="size-3.5" /> {t(site.hours)}
            </span>
            <OpenStatus tone="dark" />
            <span className="text-white/40">•</span>
            <span>{t("Lahore Premier Architectural Contractors")}</span>
          </div>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5">
              <ShieldCheck aria-hidden="true" className="size-3.5 text-sand-500" /> {t("PEC Compliant • DHA Registered")}
            </span>
            <LanguageToggle tone="dark" />
          </div>
        </div>
      </div>

      <header
        className={cn(
          "no-print sticky top-0 z-50 border-b bg-canvas/85 backdrop-blur-xl transition-shadow",
          scrolled ? "border-line shadow-card" : "border-transparent",
        )}
      >
        <div className="container-page flex h-[68px] items-center justify-between gap-4">
          <Logo />

          <nav aria-label={t("Primary")} className="hidden items-center gap-0.5 xl:flex">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                aria-current={isActive(link.href) ? "page" : undefined}
                className={cn(
                  "rounded-md px-3 py-2 text-[13.5px] font-medium text-ink-soft transition-colors hover:text-ink",
                  isActive(link.href) && "bg-clay-50 text-clay-600",
                )}
              >
                {t(link.label)}
              </Link>
            ))}
          </nav>

          <div className="hidden items-center gap-2 md:flex">
            <LanguageToggle className="lg:hidden" />
            <Button href={whatsappLink(waMessages.consult)} variant="whatsapp" size="sm" aria-label={t("Chat on WhatsApp")}>
              <WhatsAppIcon className="size-4" /> <span className="hidden lg:inline">{t("WhatsApp")}</span>
            </Button>
            <Button href="/quote" size="sm">
              {t("Get Free Quote")} <ArrowRight aria-hidden="true" className="size-4 rtl:-scale-x-100" />
            </Button>
          </div>

          <button
            type="button"
            className="grid size-11 place-items-center rounded-lg border border-line-strong bg-surface text-ink xl:hidden"
            aria-label={open ? t("Close menu") : t("Open menu")}
            aria-expanded={open}
            aria-controls="mobile-menu"
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>
      </header>

      <div
        id="mobile-menu"
        className={cn(
          "no-print fixed inset-0 top-[68px] z-40 xl:hidden",
          open ? "visible" : "pointer-events-none invisible",
        )}
      >
        <div
          className={cn("absolute inset-0 bg-ink/40 backdrop-blur-sm transition-opacity", open ? "opacity-100" : "opacity-0")}
          onClick={() => setOpen(false)}
        />
        <nav
          aria-label={t("Mobile")}
          className={cn(
            "absolute inset-x-0 top-0 max-h-[calc(100dvh-68px)] overflow-y-auto border-b border-line bg-canvas p-4 shadow-modal transition-transform duration-300",
            open ? "translate-y-0" : "-translate-y-4",
          )}
        >
          <ul className="grid gap-1">
            {navLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className={cn(
                    "flex items-center justify-between rounded-lg px-4 py-3.5 text-base font-medium text-ink hover:bg-sunken",
                    isActive(link.href) && "bg-clay-50 text-clay-600",
                  )}
                >
                  {t(link.label)}
                  <ArrowRight aria-hidden="true" className="size-4 opacity-40 rtl:-scale-x-100" />
                </Link>
              </li>
            ))}
          </ul>
          <div className="mt-4 grid grid-cols-2 gap-3 border-t border-line pt-4">
            <Button href={whatsappLink(waMessages.consult)} variant="whatsapp" size="lg">
              <WhatsAppIcon className="size-5" /> {t("WhatsApp")}
            </Button>
            <Button href="/quote" size="lg" onClick={() => setOpen(false)}>
              {t("Free Quote")}
            </Button>
          </div>
          <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
            <a href={`tel:${site.phone.replace(/\s/g, "")}`} className="flex items-center gap-2 text-sm font-medium text-ink-soft">
              <Phone aria-hidden="true" className="size-4" /> <span className="ltr-run">{site.phone}</span>
            </a>
            <LanguageToggle />
          </div>
          <OpenStatus className="mt-3" />
        </nav>
      </div>
    </>
  );
}
