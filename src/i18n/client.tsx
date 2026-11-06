"use client";

import { createContext, useCallback, useContext } from "react";
import { translate, type Locale, type TParams } from "@/i18n/config";

const LocaleContext = createContext<Locale>("en");

export function LocaleProvider({ locale, children }: { locale: Locale; children: React.ReactNode }) {
  return <LocaleContext.Provider value={locale}>{children}</LocaleContext.Provider>;
}

export const useLocale = () => useContext(LocaleContext);

/** Client-component helper: `const t = useT();` */
export function useT() {
  const locale = useLocale();
  return useCallback((key: string, params?: TParams) => translate(locale, key, params), [locale]);
}
