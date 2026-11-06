const KEY = "zc:referral";
const MAX_AGE_MS = 30 * 24 * 60 * 60 * 1000;
const VALID = /^[A-Za-z0-9_-]{2,40}$/;

export const isValidReferral = (code: string) => VALID.test(code);

export function saveReferral(code: string) {
  if (!isValidReferral(code)) return;
  try {
    localStorage.setItem(KEY, JSON.stringify({ code, at: Date.now() }));
  } catch {
    /* storage blocked */
  }
}

/** The referral code from a `?referral=` link, if the visitor arrived through one in the last 30 days. */
export function getReferral(): string | undefined {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return undefined;
    const { code, at } = JSON.parse(raw) as { code: string; at: number };
    return Date.now() - at < MAX_AGE_MS && isValidReferral(code) ? code : undefined;
  } catch {
    return undefined;
  }
}
