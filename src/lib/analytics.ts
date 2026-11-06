/**
 * Thin wrapper over Google Analytics 4 (gtag) and the Meta Pixel (fbq). Both are only loaded after the visitor
 * accepts cookies and only when the matching env var is set, so with no IDs configured this file does nothing.
 *
 * Events fired while the third-party scripts are still loading are queued and sent as soon as they are ready,
 * so nothing is lost on a fast first click. Without consent nothing is queued or sent.
 */
export const GA_ID = process.env.NEXT_PUBLIC_GA_ID ?? "";
export const META_PIXEL_ID = process.env.NEXT_PUBLIC_META_PIXEL_ID ?? "";
export const analyticsEnabled = Boolean(GA_ID || META_PIXEL_ID);

export const CONSENT_KEY = "zc:cookie-consent";
export const CONSENT_RESET_EVENT = "zc:consent-reset";

type Params = Record<string, string | number | boolean | undefined>;

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
    fbq?: (...args: unknown[]) => void;
    dataLayer?: unknown[];
  }
}

/** GA4 event name -> Meta standard event */
const META_EVENTS: Record<string, string> = {
  generate_lead: "Lead",
  whatsapp_click: "Contact",
  phone_click: "Contact",
};

let granted = false;
const pending: (() => void)[] = [];
const MAX_PENDING = 30;

const scriptsReady = () =>
  typeof window !== "undefined" && (!GA_ID || typeof window.gtag === "function") && (!META_PIXEL_ID || typeof window.fbq === "function");

/** Called by the consent banner. Revoking consent drops anything still queued. */
export function setConsentGranted(value: boolean) {
  granted = value;
  if (!value) pending.length = 0;
}

/** Sends queued events once the third-party scripts have loaded. Safe to call repeatedly. */
export function flushPending() {
  if (!granted || !scriptsReady()) return;
  while (pending.length) {
    try {
      pending.shift()?.();
    } catch {
      /* analytics must never break the page */
    }
  }
}

function run(fn: () => void) {
  if (typeof window === "undefined" || !granted) return;
  if (scriptsReady()) {
    try {
      fn();
    } catch {
      /* ignore */
    }
  } else if (pending.length < MAX_PENDING) {
    pending.push(fn);
  }
}

export function track(event: string, params: Params = {}) {
  run(() => {
    window.gtag?.("event", event, params);
    const standard = META_EVENTS[event];
    if (standard) window.fbq?.("track", standard, params);
    else window.fbq?.("trackCustom", event, params);
  });
}

export function trackPageView(path: string) {
  run(() => {
    window.gtag?.("event", "page_view", { page_path: path });
    window.fbq?.("track", "PageView");
  });
}
