import Link from "next/link";
import { ClipboardCheck, House, ListChecks, Route, Ruler, Sparkles, Stethoscope, type LucideIcon } from "lucide-react";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { getI18n } from "@/i18n/server";
import { msg } from "@/i18n/config";

export const helpTools: { href: string; icon: LucideIcon; title: string; text: string }[] = [
  { href: "/house-estimator", icon: House, title: msg("Whole-House Estimate"), text: msg("Front, sides, upper floors, mumty and boundary walls in one estimate.") },
  { href: "/wall-doctor", icon: Stethoscope, title: msg("Wall Doctor"), text: msg("Damp, cracks or peeling? Tick what you see and get a repair plan.") },
  { href: "/finish-finder", icon: Sparkles, title: msg("Finish Finder"), text: msg("Three questions, three finishes that fit your budget and taste.") },
  { href: "/measure", icon: Ruler, title: msg("Measure & Convert"), text: msg("Add up your walls and switch between sq ft, marla and sq m.") },
  { href: "/prepare", icon: ListChecks, title: msg("Pre-Work Checklist"), text: msg("What to do before, during and after the crew arrives. Printable.") },
  { href: "/track", icon: Route, title: msg("Track Your Project"), text: msg("Enter your project code to see which stage your work is at.") },
  { href: "/warranty#claim", icon: ClipboardCheck, title: msg("Warranty Claim"), text: msg("Report a problem and get a claim reference number.") },
];

/** Grid of customer help tools. `heading` switches the h2 to an h1 on the /help page. */
export async function HelpTools({ asPage = false }: { asPage?: boolean }) {
  const { t } = await getI18n();
  return (
    <section id="help" className="container-page py-16 sm:py-24">
      <SectionHeading
        as={asPage ? "h1" : "h2"}
        align="center"
        eyebrow={t("Help & Tools")}
        title={t("Solve it before you call us")}
        description={t("Free tools that answer the questions customers ask us most, in a couple of minutes.")}
      />
      <ul className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {helpTools.map((x) => (
          <li key={x.href}>
            <Link href={x.href} className="group flex h-full gap-4 rounded-card border border-line bg-surface p-5 shadow-card transition-shadow hover:shadow-lift">
              <span className="grid size-12 shrink-0 place-items-center rounded-lg bg-brand-50 text-brand-500 transition-colors group-hover:bg-brand-500 group-hover:text-white">
                <x.icon aria-hidden="true" className="size-6" />
              </span>
              <span>
                <span className="block font-display text-base font-bold">{t(x.title)}</span>
                <span className="mt-1 block text-sm text-ink-soft">{t(x.text)}</span>
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
