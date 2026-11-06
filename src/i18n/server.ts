import "server-only";
import { cookies } from "next/headers";
import { DEFAULT_LOCALE, isLocale, LOCALE_COOKIE, translate, type Locale, type TParams } from "@/i18n/config";

export async function getLocale(): Promise<Locale> {
  const value = (await cookies()).get(LOCALE_COOKIE)?.value;
  return isLocale(value) ? value : DEFAULT_LOCALE;
}

/** Server-component helper: `const { t } = await getI18n();` */
export async function getI18n() {
  const locale = await getLocale();
  return { locale, t: (key: string, params?: TParams) => translate(locale, key, params) };
}
