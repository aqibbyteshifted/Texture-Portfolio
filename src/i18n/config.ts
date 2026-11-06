import { ur } from "@/i18n/ur";

export const LOCALES = ["en", "ur"] as const;
export type Locale = (typeof LOCALES)[number];

export const DEFAULT_LOCALE: Locale = "en";
export const LOCALE_COOKIE = "zc-lang";

export const isLocale = (value: unknown): value is Locale => value === "en" || value === "ur";
export const dirOf = (locale: Locale) => (locale === "ur" ? "rtl" : "ltr");

export type TParams = Record<string, string | number>;

/** Marks a string for translation without translating it yet (for constants). `npm run i18n:check` picks these up. */
export const msg = (s: string) => s;

/**
 * Translations are keyed by the English source string, so components stay readable and any
 * string without an Urdu entry simply falls back to English. `{name}` placeholders are filled from `params`.
 */
export function translate(locale: Locale, key: string, params?: TParams) {
  let out = locale === "ur" ? (ur[key] ?? key) : key;
  if (params) out = out.replace(/\{(\w+)\}/g, (_, k: string) => String(params[k] ?? `{${k}}`));
  return out;
}
