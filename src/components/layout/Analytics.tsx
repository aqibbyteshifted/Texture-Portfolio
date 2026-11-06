"use client";

import { useEffect, useState } from "react";
import Script from "next/script";
import { usePathname } from "next/navigation";
import { Cookie } from "lucide-react";
import { useT } from "@/i18n/client";
import {
  analyticsEnabled,
  CONSENT_KEY,
  CONSENT_RESET_EVENT,
  flushPending,
  GA_ID,
  META_PIXEL_ID,
  setConsentGranted,
  track,
  trackPageView,
} from "@/lib/analytics";

type Consent = "granted" | "denied" | null;

const readConsent = (): Consent => {
  try {
    const v = localStorage.getItem(CONSENT_KEY);
    return v === "granted" || v === "denied" ? v : null;
  } catch {
    return null;
  }
};

/**
 * Cookie-consent banner + consent-gated GA4 / Meta Pixel scripts + click tracking for WhatsApp, phone and email links.
 * Renders nothing at all unless NEXT_PUBLIC_GA_ID or NEXT_PUBLIC_META_PIXEL_ID is set.
 */
export function Analytics() {
  const t = useT();
  const pathname = usePathname();
  const [consent, setConsent] = useState<Consent>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setConsent(readConsent());
    setReady(true);
    const reset = () => setConsent(null);
    window.addEventListener(CONSENT_RESET_EVENT, reset);
    return () => window.removeEventListener(CONSENT_RESET_EVENT, reset);
  }, []);

  // keep the tracking module in sync with the visitor's choice and flush events queued while scripts load
  useEffect(() => {
    setConsentGranted(consent === "granted");
    if (consent !== "granted") return;
    const id = setInterval(flushPending, 250);
    const stop = setTimeout(() => clearInterval(id), 20_000);
    return () => {
      clearInterval(id);
      clearTimeout(stop);
    };
  }, [consent]);

  // page views: GA is configured with send_page_view:false, so every page (including the first) is sent here
  useEffect(() => {
    if (consent === "granted") trackPageView(pathname);
  }, [pathname, consent]);

  // delegated click tracking
  useEffect(() => {
    if (consent !== "granted") return;
    const onClick = (e: MouseEvent) => {
      const a = (e.target as Element | null)?.closest?.("a[href]") as HTMLAnchorElement | null;
      if (!a) return;
      const href = a.getAttribute("href") ?? "";
      if (/^https:\/\/(wa\.me|api\.whatsapp\.com)/.test(href)) track("whatsapp_click", { link_url: href.split("?")[0], page: location.pathname });
      else if (href.startsWith("tel:")) track("phone_click", { page: location.pathname });
      else if (href.startsWith("mailto:")) track("email_click", { page: location.pathname });
    };
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, [consent]);

  if (!analyticsEnabled) return null;

  const choose = (value: "granted" | "denied") => {
    try {
      localStorage.setItem(CONSENT_KEY, value);
    } catch {
      /* private mode: choice just lasts for this page view */
    }
    setConsent(value);
  };

  return (
    <>
      {consent === "granted" && GA_ID && (
        <>
          <Script src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`} strategy="afterInteractive" />
          <Script id="ga4-init" strategy="afterInteractive">
            {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}window.gtag=gtag;gtag('js',new Date());gtag('config','${GA_ID}',{anonymize_ip:true,send_page_view:false});`}
          </Script>
        </>
      )}
      {consent === "granted" && META_PIXEL_ID && (
        <Script id="meta-pixel" strategy="afterInteractive">
          {`!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');fbq('init','${META_PIXEL_ID}');`}
        </Script>
      )}

      {ready && consent === null && (
        <div
          role="dialog"
          aria-label={t("Cookie preferences")}
          className="no-print fixed inset-x-3 bottom-[4.75rem] z-[60] mx-auto max-w-xl rounded-2xl border border-line bg-surface p-4 shadow-modal sm:p-5 lg:start-5 lg:end-auto lg:bottom-5 lg:mx-0"
        >
          <p className="flex items-start gap-3 text-sm leading-relaxed text-ink-soft">
            <Cookie aria-hidden="true" className="mt-0.5 size-5 shrink-0 text-clay-500" />
            <span>{t("We use cookies for analytics and advertising to understand which pages and ads bring enquiries. You can accept or decline.")}</span>
          </p>
          <div className="mt-4 flex justify-end gap-2">
            <button type="button" onClick={() => choose("denied")} className="h-10 rounded-control border border-line-strong px-4 text-sm font-semibold hover:bg-sunken">
              {t("Decline")}
            </button>
            <button type="button" onClick={() => choose("granted")} className="h-10 rounded-control bg-clay-500 px-4 text-sm font-semibold text-white hover:bg-clay-600">
              {t("Accept")}
            </button>
          </div>
        </div>
      )}
    </>
  );
}

/** Footer link that reopens the banner. Renders nothing when analytics is not configured. */
export function ManageCookies() {
  const t = useT();
  if (!analyticsEnabled) return null;
  return (
    <button type="button" onClick={() => window.dispatchEvent(new Event(CONSENT_RESET_EVENT))} className="text-xs underline-offset-2 hover:text-clay-600 hover:underline">
      {t("Cookie settings")}
    </button>
  );
}
