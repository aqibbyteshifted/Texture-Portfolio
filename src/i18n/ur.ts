import { urData } from "@/i18n/ur-data";
import { urExtra } from "@/i18n/ur-extra";
import { urMore } from "@/i18n/ur-more";
import { urPolicy } from "@/i18n/ur-policy";
import { urRates } from "@/i18n/ur-rates";
import { urUi1 } from "@/i18n/ur-ui-1";
import { urUi2 } from "@/i18n/ur-ui-2";

/**
 * Urdu dictionary keyed by the exact English source string.
 * Run `npm run i18n:check` to list English strings that still have no Urdu entry
 * (they simply fall back to English until added).
 */
export const ur: Record<string, string> = { ...urUi1, ...urUi2, ...urData, ...urExtra, ...urMore, ...urPolicy, ...urRates };
