const pkr = new Intl.NumberFormat("en-PK", { maximumFractionDigits: 0 });

export const formatNumber = (n: number) => pkr.format(Math.round(n));
export const formatPKR = (n: number) => `PKR ${pkr.format(Math.round(n))}`;

/** Accepts 03001234567, +923001234567, 0300-1234567 and returns +923001234567, or null if invalid. */
export function normalizePkPhone(input: string): string | null {
  const digits = input.replace(/[^\d+]/g, "");
  let national: string | null = null;
  if (/^\+?92\d{10}$/.test(digits)) national = digits.replace(/^\+?92/, "");
  else if (/^0\d{10}$/.test(digits)) national = digits.slice(1);
  else if (/^3\d{9}$/.test(digits)) national = digits;
  if (!national || !/^[2-9]\d{9}$/.test(national)) return null;
  return `+92${national}`;
}

export function formatDate(iso: string, opts?: Intl.DateTimeFormatOptions) {
  return new Intl.DateTimeFormat("en-PK", { timeZone: "Asia/Karachi", ...opts }).format(new Date(iso));
}
