import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, House, MapPin } from "lucide-react";
import { Accordion } from "@/components/ui/Accordion";
import { Button } from "@/components/ui/Button";
import { WhatsAppIcon } from "@/components/ui/icons";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ProjectGrid } from "@/components/features/ProjectGrid";
import { ReviewsCarousel } from "@/components/features/ReviewsCarousel";
import { TextureCard } from "@/components/features/TextureCard";
import { areas, getArea } from "@/data/areas";
import { getCity } from "@/data/cities";
import { locationOptions } from "@/data/site";
import { testimonials } from "@/data/content";
import { allProjects } from "@/data/projects";
import { site } from "@/data/site";
import { priceRange, textures } from "@/data/textures";
import { getI18n } from "@/i18n/server";
import { quoteHref } from "@/lib/quoteLink";
import { whatsappLink } from "@/lib/whatsapp";

type Params = { slug: string };

export function generateStaticParams(): Params[] {
  return areas.map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const area = getArea((await params).slug);
  if (!area) return {};
  return {
    title: `Wall Texture & Facade Finishes in ${area.name}`,
    description: `Rockwall, travertine, stucco, microcement, limewash and epoxy finishes in ${area.name}, ${area.city[0].toUpperCase()}${area.city.slice(1)}. Laser measurement, sample boards and a written warranty from Zain & Co.`,
    alternates: { canonical: `/areas/${area.slug}` },
  };
}

export default async function AreaPage({ params }: { params: Promise<Params> }) {
  const area = getArea((await params).slug);
  if (!area) notFound();
  const { t } = await getI18n();
  const name = t(area.name);
  const city = getCity(area.city)!;
  const cityName = t(city.name);
  const isLahore = city.id === "lahore";
  const surcharge = locationOptions.find((l) => l.value === area.locationValue)?.surcharge ?? 0;

  const local = allProjects.filter((p) => area.sectors.includes(p.sector));
  const shown = local.length > 0 ? local : allProjects.slice(0, 3);
  const reviews = testimonials.filter((r) => area.keywords.some((k) => r.meta.includes(k)));

  const faqs = [
    {
      id: "a1",
      question: isLahore ? t("Do you offer free site visits in {area}?", { area: name }) : t("How does a site survey work in {area}?", { area: name }),
      answer: isLahore
        ? t("Yes. Our site engineer visits {area} with a laser meter and 1×1 ft sample boards to measure your walls and check them for dampness, at no cost and with no obligation.", { area: name })
        : t("Message us your plot size and location and we will arrange a survey with a laser meter and sample boards. Travel and logistics for projects outside Lahore are shown in your estimate.", { area: name }),
    },
    {
      id: "a2",
      question: t("Which finishes can you apply in {area}?", { area: name }),
      answer: `${textures.map((x) => t(x.name)).join(" • ")}.`,
    },
    {
      id: "a3",
      question: t("How much does wall texturing cost in {area}?", { area: name }),
      answer: isLahore
        ? t("Turnkey rates run from PKR {min} to PKR {max} per sq ft depending on the finish, with the same rates across Lahore. Use the calculator for an instant estimate for your wall.", { min: priceRange.min, max: priceRange.max })
        : t("Turnkey rates run from PKR {min} to PKR {max} per sq ft depending on the finish, plus a {pct}% logistics charge for projects outside Lahore. Use the calculator for an instant estimate for your wall.", { min: priceRange.min, max: priceRange.max, pct: Math.round(surcharge * 100) }),
    },
  ];

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: `Wall texture and facade finishes in ${area.name}`,
    provider: { "@type": "HomeAndConstructionBusiness", name: site.group, url: site.url },
    areaServed: { "@type": "Place", name: `${area.name}, ${city.id[0].toUpperCase()}${city.id.slice(1)}` },
    offers: { "@type": "AggregateOffer", priceCurrency: "PKR", lowPrice: priceRange.min, highPrice: priceRange.max, unitText: "per sq ft" },
  };
  const faqLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: `How does a site survey work in ${area.name}?`,
        acceptedAnswer: { "@type": "Answer", text: `Our site engineer visits ${area.name} with a laser meter and 1×1 ft sample boards to measure your walls and check them for dampness.` },
      },
    ],
  };

  return (
    <>
      <div className="container-page pt-6">
        <nav aria-label={t("Breadcrumb")} className="flex flex-wrap items-center gap-2 text-xs text-ink-muted">
          <Link href="/" className="flex items-center gap-1 hover:text-brand-600"><House aria-hidden="true" className="size-3.5" /> {t("Home")}</Link>
          <span aria-hidden="true">/</span>
          <Link href="/areas" className="hover:text-brand-600">{t("Areas We Serve")}</Link>
          <span aria-hidden="true">/</span>
          <span aria-current="page" className="font-semibold text-brand-600">{name}</span>
        </nav>
      </div>

      <section className="container-page py-10 sm:py-14">
        <p className="inline-flex items-center gap-1.5 rounded-full bg-brand-50 px-3 py-1 text-[11px] font-bold tracking-wider text-brand-600 uppercase">
          <MapPin aria-hidden="true" className="size-3.5" /> {isLahore ? t("Free site visits in {area}", { area: name }) : t("Now serving {area}", { area: name })}
        </p>
        <h1 className="mt-4 max-w-3xl text-4xl leading-[1.05] font-extrabold sm:text-5xl">
          {t("Wall Texture & Facade Finishes in {area}", { area: name })}
        </h1>
        <p className="mt-4 max-w-2xl text-lg leading-relaxed text-ink-soft">
          {isLahore
            ? t("Boundary walls, front elevations, porch pillars, feature walls and floors in {area}: finished by our in-house karigars with a free laser survey, physical sample boards and a stamped 3-year warranty.", { area: name })
            : t("Boundary walls, front elevations, porch pillars, feature walls and floors in {area}: finished by our trained karigars with a laser survey, physical sample boards and a stamped written warranty.", { area: name })}
        </p>
        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          <Button href={quoteHref({ location: area.locationValue })} size="lg">
            {t("Get Free Quote")} <ArrowRight aria-hidden="true" className="size-4 rtl:-scale-x-100" />
          </Button>
          <Button href={whatsappLink(`Salam Zain & Co, I have a project in ${area.name}. Please share details and book a free site visit.`)} variant="whatsapp" size="lg">
            <WhatsAppIcon className="size-5" /> {t("Chat on WhatsApp")}
          </Button>
        </div>
        <ul className="mt-8 flex flex-wrap gap-2" aria-label={t("Neighbourhoods covered")}>
          {area.neighbourhoods.map((n) => (
            <li key={n} className="rounded-full border border-line bg-surface px-3 py-1.5 text-xs font-semibold text-ink-soft">{n}</li>
          ))}
        </ul>
      </section>

      <section className="container-page pb-4">
        <div className="rounded-2xl border border-line bg-surface p-6 shadow-card sm:p-8">
          <h2 className="text-xl font-bold sm:text-2xl">{t("Homes in {city}: what to expect", { city: cityName })}</h2>
          <ul className="mt-4 grid list-disc gap-2 ps-5 text-[15px] leading-relaxed text-ink-soft marker:text-brand-500">
            {city.structure.map((x) => (
              <li key={x}>{t(x)}</li>
            ))}
          </ul>
          <p className="mt-4 rounded-lg bg-brand-50 p-3 text-sm font-medium text-ink">{t(city.climate)}</p>
          <Button href="/house-estimator" variant="secondary" className="mt-5">{t("Try the Whole-House Estimate")}</Button>
        </div>
      </section>

      <section className="border-y border-line bg-sunken/60 py-16 sm:py-20">
        <div className="container-page">
          <SectionHeading
            eyebrow={t("Architectural Finishes")}
            title={t("Finishes available in {area}", { area: name })}
            description={t("Every finish is priced per sq ft, turnkey. Open any one for specifications, shades and an instant estimate.")}
          />
          <ul className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {textures.map((x) => (
              <li key={x.slug}>
                <TextureCard texture={x} />
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="container-page py-16 sm:py-20">
        <SectionHeading
          eyebrow={t("Execution Portfolio")}
          title={local.length > 0 ? t("Recent work in {area}", { area: name }) : t("Recent work in Lahore")}
          description={local.length > 0 ? undefined : t("We are adding photos from {area} soon. Here is some of our recent work in Lahore.", { area: name })}
        />
        <div className="mt-8">
          <ProjectGrid projects={shown} filterBy="sector" />
        </div>
      </section>

      {reviews.length > 0 && (
        <section className="border-y border-line bg-sunken/60 py-16 sm:py-20">
          <div className="container-page">
            <SectionHeading title={t("What homeowners in {area} say", { area: name })} />
            <div className="mt-8">
              <ReviewsCarousel items={reviews} />
            </div>
          </div>
        </section>
      )}

      <section className="container-page max-w-3xl py-16 sm:py-20">
        <SectionHeading align="center" title={t("Frequently Asked Questions")} />
        <div className="mt-8">
          <Accordion items={faqs} />
        </div>
        <div className="mt-10 text-center">
          <Button href="/areas" variant="secondary">{t("See all areas we serve")}</Button>
        </div>
      </section>

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify([jsonLd, faqLd]) }} />
    </>
  );
}
