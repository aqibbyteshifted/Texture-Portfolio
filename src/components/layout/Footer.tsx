import Link from "next/link";
import { CircleCheck, Mail, MapPin, Phone } from "lucide-react";
import { Logo } from "@/components/layout/Logo";
import { OpenStatus } from "@/components/ui/OpenStatus";
import { ManageCookies } from "@/components/layout/Analytics";
import { cities } from "@/data/cities";
import { site } from "@/data/site";
import { textures } from "@/data/textures";
import { getI18n } from "@/i18n/server";
import { msg } from "@/i18n/config";

const quickLinks = [
  { label: msg("Home Overview"), href: "/" },
  { label: msg("Explore All Finishes"), href: "/textures" },
  { label: msg("Compare Finishes"), href: "/compare" },
  { label: msg("Colour Visualizer"), href: "/visualizer" },
  { label: msg("Our Projects"), href: "/projects" },
  { label: msg("Wall Texture Guides"), href: "/blog" },
  { label: msg("Warranty & Care"), href: "/warranty" },
  { label: msg("Request Free Estimate"), href: "/quote" },
  { label: msg("Help & Tools"), href: "/help" },
  { label: msg("Track Your Project"), href: "/track" },
  { label: msg("Frequently Asked Questions"), href: "/#faq" },
];

export async function Footer() {
  const { t } = await getI18n();
  return (
    <footer className="no-print border-t border-line bg-surface">
      <div className="container-page grid gap-10 py-14 sm:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1fr]">
        <div>
          <Logo size="lg" />
          <p className="mt-5 max-w-sm text-sm leading-relaxed text-ink-soft">
            {t("Premier architectural surface finishing contractor serving Lahore, Islamabad, Rawalpindi and Karachi, specializing in rockwall textures, travertine plastering, microcement, limewash, terrazzo, epoxy flooring and exterior monolithic facades for luxury villas and commercial landmarks.")}
          </p>
          <ul className="mt-5 grid gap-2.5 text-sm text-ink-soft">
            <li className="flex gap-2.5">
              <MapPin aria-hidden="true" className="mt-0.5 size-4 shrink-0 text-brand-500" /> <bdi>{site.addressShort}</bdi>
            </li>
            <li>
              <a href={`tel:${site.phone.replace(/\s/g, "")}`} className="flex gap-2.5 hover:text-brand-600">
                <Phone aria-hidden="true" className="mt-0.5 size-4 shrink-0 text-brand-500" /> <span className="ltr-run">{site.phone}</span>
              </a>
            </li>
            <li>
              <a href={`mailto:${site.email}`} className="flex gap-2.5 hover:text-brand-600">
                <Mail aria-hidden="true" className="mt-0.5 size-4 shrink-0 text-brand-500" /> <span className="ltr-run">{site.email}</span>
              </a>
            </li>
            <li className="ps-6.5">
              <OpenStatus />
            </li>
          </ul>
        </div>

        <div>
          <h3 className="text-base font-bold">{t("Architectural Finishes")}</h3>
          <ul className="mt-4 grid gap-2.5 text-sm text-ink-soft">
            {textures.map((x) => (
              <li key={x.slug}>
                <Link href={`/textures/${x.slug}`} className="hover:text-brand-600">
                  {t(x.name)}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="text-base font-bold">{t("Cities We Serve")}</h3>
          <ul className="mt-4 grid gap-2.5 text-sm text-ink-soft">
            {cities.map((c) => (
              <li key={c.id} className="flex gap-2">
                <CircleCheck aria-hidden="true" className="mt-0.5 size-4 shrink-0 text-brand-500" />
                <Link href={`/areas#${c.id}`} className="hover:text-brand-600">
                  {t(c.name)}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="text-base font-bold">{t("Quick Navigation")}</h3>
          <ul className="mt-4 grid gap-2.5 text-sm text-ink-soft">
            {quickLinks.map((item) => (
              <li key={item.label}>
                <Link href={item.href} className="hover:text-brand-600">
                  {t(item.label)}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="border-t border-line">
        <div className="container-page flex flex-col gap-2 py-5 pb-24 text-xs text-ink-muted sm:flex-row sm:items-center sm:justify-between lg:pb-5">
          <p>
            © {new Date().getFullYear()} {site.group} Lahore. {t("All rights reserved. Licensed Surface Engineering Contractor.")}
          </p>
          <p className="flex flex-wrap gap-x-5 gap-y-1">
            <span>
              {t("PEC Registration")} <span className="ltr-run">#{site.pec}</span>
            </span>
            <span>{t("DHA Approved Contractor")}</span>
            <Link href="/terms" className="hover:text-brand-600">{t("Terms & Conditions")}</Link>
            <Link href="/privacy" className="hover:text-brand-600">{t("Privacy Policy")}</Link>
            <ManageCookies />
          </p>
        </div>
      </div>
    </footer>
  );
}
