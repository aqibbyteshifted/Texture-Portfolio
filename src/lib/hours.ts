import { site } from "@/data/site";

export type OpenState =
  | { open: true; closesAt: string }
  | { open: false; opensDay: "today" | "tomorrow" | string; opensAt: string };

const DAY_NAMES = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

const toMinutes = (hhmm: string) => {
  const [h, m] = hhmm.split(":").map(Number);
  return h * 60 + m;
};

export function formatClock(hhmm: string) {
  const [h, m] = hhmm.split(":").map(Number);
  const suffix = h >= 12 ? "PM" : "AM";
  return `${((h + 11) % 12) + 1}:${String(m).padStart(2, "0")} ${suffix}`;
}

/** Current weekday + minutes-since-midnight in the business time zone, independent of the visitor's clock. */
function nowInZone(date: Date) {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: site.hoursSchedule.timeZone,
    weekday: "short",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  }).formatToParts(date);
  const get = (type: string) => parts.find((p) => p.type === type)?.value ?? "";
  const day = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].indexOf(get("weekday"));
  return { day, minutes: Number(get("hour")) * 60 + Number(get("minute")) };
}

export function getOpenState(date: Date = new Date()): OpenState {
  const { opens, closes } = site.hoursSchedule;
  const openDays: readonly number[] = site.hoursSchedule.openDays;
  const { day, minutes } = nowInZone(date);
  const isOpenDay = openDays.includes(day);

  if (isOpenDay && minutes >= toMinutes(opens) && minutes < toMinutes(closes)) {
    return { open: true, closesAt: formatClock(closes) };
  }
  if (isOpenDay && minutes < toMinutes(opens)) {
    return { open: false, opensDay: "today", opensAt: formatClock(opens) };
  }
  for (let i = 1; i <= 7; i++) {
    const next = (day + i) % 7;
    if (openDays.includes(next)) {
      return { open: false, opensDay: i === 1 ? "tomorrow" : DAY_NAMES[next], opensAt: formatClock(opens) };
    }
  }
  return { open: false, opensDay: "today", opensAt: formatClock(opens) };
}
