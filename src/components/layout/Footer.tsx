import Link from "next/link";
import { CircleCheck, Mail, MapPin, Phone } from "lucide-react";
import { Logo } from "@/components/layout/Logo";
import { coverageAreas, site } from "@/data/site";
import { textures } from "@/data/textures";

const quickLinks = [
  { label: "Home Overview", href: "/" },
  { label: "Explore All Finishes", href: "/textures" },
  { label: "Rockwall Specification", href: "/textures/rockwall-aggregates" },
  { label: "Request Free Estimate", href: "/quote" },
  { label: "Our Work", href: "/#work" },
  { label: "Frequently Asked Questions", href: "/#faq" },
];

export function Footer() {
  return (
    <footer className="no-print border-t border-line bg-surface">
      <div className="container-page grid gap-10 py-14 sm:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1fr]">
        <div>
          <Logo />
          <p className="mt-5 max-w-sm text-sm leading-relaxed text-ink-soft">
            Lahore&apos;s premier architectural surface finishing contractor specializing in rockwall textures, travertine
            plastering, custom color crete applications, and exterior monolithic facades for luxury villas and commercial
            landmarks.
          </p>
          <ul className="mt-5 grid gap-2.5 text-sm text-ink-soft">
            <li className="flex gap-2.5">
              <MapPin aria-hidden="true" className="mt-0.5 size-4 shrink-0 text-clay-500" /> {site.addressShort}
            </li>
            <li>
              <a href={`tel:${site.phone.replace(/\s/g, "")}`} className="flex gap-2.5 hover:text-clay-600">
                <Phone aria-hidden="true" className="mt-0.5 size-4 shrink-0 text-clay-500" /> {site.phone}
              </a>
            </li>
            <li>
              <a href={`mailto:${site.email}`} className="flex gap-2.5 hover:text-clay-600">
                <Mail aria-hidden="true" className="mt-0.5 size-4 shrink-0 text-clay-500" /> {site.email}
              </a>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="text-base font-bold">Architectural Finishes</h3>
          <ul className="mt-4 grid gap-2.5 text-sm text-ink-soft">
            {textures.map((t) => (
              <li key={t.slug}>
                <Link href={`/textures/${t.slug}`} className="hover:text-clay-600">
                  {t.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="text-base font-bold">Lahore Coverage</h3>
          <ul className="mt-4 grid gap-2.5 text-sm text-ink-soft">
            {coverageAreas.map((item) => (
              <li key={item} className="flex gap-2">
                <CircleCheck aria-hidden="true" className="mt-0.5 size-4 shrink-0 text-clay-500" /> {item}
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="text-base font-bold">Quick Navigation</h3>
          <ul className="mt-4 grid gap-2.5 text-sm text-ink-soft">
            {quickLinks.map((item) => (
              <li key={item.label}>
                <Link href={item.href} className="hover:text-clay-600">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="border-t border-line">
        <div className="container-page flex flex-col gap-2 py-5 pb-24 text-xs text-ink-muted sm:flex-row sm:items-center sm:justify-between lg:pb-5">
          <p>
            © {new Date().getFullYear()} {site.group} Lahore. All rights reserved. Licensed Surface Engineering Contractor.
          </p>
          <p className="flex flex-wrap gap-x-5 gap-y-1">
            <span>PEC Registration #{site.pec}</span>
            <span>DHA Approved Contractor</span>
          </p>
        </div>
      </div>
    </footer>
  );
}
