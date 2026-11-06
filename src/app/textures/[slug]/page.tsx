import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, Calculator, CircleCheck, Columns3, House, Layers, Mountain, Star } from "lucide-react";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Button } from "@/components/ui/Button";
import { Icon, WhatsAppIcon } from "@/components/ui/icons";
import { Reveal } from "@/components/ui/Reveal";
import { TextureImage } from "@/components/ui/TextureImage";
import { AreaCostCalculator } from "@/components/features/AreaCostCalculator";
import { ProjectGrid } from "@/components/features/ProjectGrid";
import { ShadePicker } from "@/components/features/ShadePicker";
import { TextureCard } from "@/components/features/TextureCard";
import { TextureGallery } from "@/components/features/TextureGallery";
import { homeProjects, projects } from "@/data/projects";
import { getShades } from "@/data/shades";
import { getTexture, textures } from "@/data/textures";
import { site } from "@/data/site";
import { getI18n } from "@/i18n/server";
import { quoteHref } from "@/lib/quoteLink";
import { waMessages, whatsappLink } from "@/lib/whatsapp";

type Params = { slug: string };

export function generateStaticParams(): Params[] {
  return textures.map((t) => ({ slug: t.slug }));
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const texture = getTexture((await params).slug);
  if (!texture) return {};
  return {
    title: `${texture.name} Finish in Lahore | PKR ${texture.rate} / sq ft`,
    description: `${texture.description.slice(0, 150)}…`,
    alternates: { canonical: `/textures/${texture.slug}` },
    ...(texture.image ? { openGraph: { images: [{ url: texture.image }] } } : {}),
  };
}

export default async function TextureDetailPage({ params }: { params: Promise<Params> }) {
  const texture = getTexture((await params).slug);
  if (!texture) notFound();
  const { t } = await getI18n();

  const related = textures.filter((x) => x.slug !== texture.slug).slice(0, 3);
  const caseStudies =
    texture.category === "Rockwall" ? projects : homeProjects.filter((p) => p.textures.includes(texture.category));
  const shades = getShades(texture.slug);

  const productJsonLd = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: `${texture.name} Finish`,
    provider: { "@type": "HomeAndConstructionBusiness", name: site.group },
    areaServed: "Lahore, Pakistan",
    description: texture.description,
    offers: { "@type": "Offer", priceCurrency: "PKR", price: texture.rate, unitText: "per sq ft" },
    aggregateRating: { "@type": "AggregateRating", ratingValue: texture.rating, reviewCount: texture.villas },
  };

  const specRows: [string, string][] = [
    [t("Application Zone"), texture.specs.zone],
    [t("Coating Thickness"), texture.specs.thickness],
    [t("Surface Tactility"), texture.specs.tactility],
    [t("Full Curing Time"), texture.specs.curing],
  ];

  return (
    <>
      <div className="container-page pt-6">
        <nav aria-label={t("Breadcrumb")} className="flex flex-wrap items-center gap-2 text-xs text-ink-muted">
          <Link href="/" className="flex items-center gap-1 hover:text-clay-600"><House aria-hidden="true" className="size-3.5" /> {t("Home")}</Link>
          <span aria-hidden="true">/</span>
          <Link href="/textures" className="hover:text-clay-600">{t("Textures Catalog")}</Link>
          <span aria-hidden="true">/</span>
          <span aria-current="page" className="font-semibold text-clay-600">{t(texture.name)}</span>
          <span className="ms-auto hidden rounded-full bg-clay-100 px-3 py-1 text-[11px] font-bold text-clay-600 sm:inline">{t("DHA & Bahria Batch Ready")}</span>
        </nav>
      </div>

      {/* Hero */}
      <section className="container-page grid gap-8 py-8 lg:grid-cols-2 lg:gap-14 lg:py-12">
        <TextureGallery
          title={texture.name}
          badge={t(texture.badge)}
          highlight={t(texture.feature)}
          swatch={texture.swatch}
          images={texture.gallery}
          main={texture.image}
        />

        <div>
          <p className="inline-flex items-center gap-1.5 rounded-full bg-clay-50 px-3 py-1 text-[11px] font-bold tracking-wider text-clay-600 uppercase">
            <Mountain aria-hidden="true" className="size-3.5" /> {t(texture.tagline)}
          </p>
          <h1 className="mt-3 text-4xl leading-[1.05] font-extrabold sm:text-5xl">{t(texture.name)}</h1>

          <div className="mt-4 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-ink-soft">
            <span className="flex items-center gap-1" role="img" aria-label={t("Rated {rating} out of 5", { rating: texture.rating })}>
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} aria-hidden="true" className={`size-4 ${i < Math.round(texture.rating) ? "fill-amber-500 text-amber-500" : "text-line-strong"}`} />
              ))}
              <strong className="ms-1 text-ink">{texture.rating} / 5</strong>
            </span>
            <span aria-hidden="true">•</span>
            <span>{t("{n}+ Lahore Villas", { n: texture.villas })}</span>
            <span aria-hidden="true">•</span>
            <span>{t("PEC Certified")}</span>
          </div>

          <div className="mt-6 rounded-xl border border-line bg-surface p-5 shadow-card">
            <p className="text-[11px] font-bold tracking-wider text-ink-muted uppercase">{t("Contractor Supply & Application Rate")}</p>
            <p className="mt-1 flex flex-wrap items-baseline gap-2">
              <span className="font-display text-4xl font-extrabold text-clay-600 tnum">PKR {texture.rate}</span>
              <span className="text-ink-soft">/ {t("sq ft")}</span>
              <span className="ms-auto rounded-md bg-clay-100 px-2 py-1 text-[11px] font-bold text-clay-600">{t("Material + Master Karigar Labour")}</span>
            </p>
          </div>

          <p dir="auto" className="mt-5 leading-relaxed text-ink-soft">{t(texture.description)}</p>
          <ul className="mt-5 grid gap-2.5">
            {texture.highlights.map((h) => (
              <li key={h} dir="auto" className="flex gap-2.5 text-sm text-ink-soft">
                <CircleCheck aria-hidden="true" className="mt-0.5 size-5 shrink-0 text-clay-500" /> {t(h)}
              </li>
            ))}
          </ul>

          <dl className="mt-6 grid grid-cols-2 gap-px overflow-hidden rounded-xl border border-line bg-line">
            {specRows.map(([k, v]) => (
              <div key={k} className="bg-surface p-4">
                <dt className="text-[11px] font-semibold tracking-wider text-ink-muted uppercase">{k}</dt>
                <dd dir="auto" className="mt-1 text-sm font-bold">{t(v)}</dd>
              </div>
            ))}
          </dl>

          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            <Button href="#estimator" size="lg">
              <Calculator aria-hidden="true" className="size-4" /> {t("Calculate Project Estimate")}
            </Button>
            <Button href={whatsappLink(waMessages.sample(texture.name))} variant="whatsapp" size="lg">
              <WhatsAppIcon className="size-5" /> {t("Request 1x1 ft Sample Board")}
            </Button>
          </div>
          {shades.length > 0 && (
            <Link href="#shades" className="mt-3 inline-flex items-center gap-2 text-sm font-semibold text-clay-600 hover:text-clay-700">
              <span className="flex -space-x-1.5 rtl:space-x-reverse">
                {shades.slice(0, 5).map((s) => (
                  <span key={s.code} className="size-5 rounded-full border-2 border-white" style={{ backgroundColor: s.hex }} />
                ))}
              </span>
              {t("{n} shades available", { n: shades.length })}
            </Link>
          )}
          <p className="mt-3 flex items-center gap-1.5 text-xs text-ink-muted">
            <Layers aria-hidden="true" className="size-3.5" /> {t("Spec Ref")}: <span className="ltr-run">{texture.specRef}</span>
          </p>
        </div>
      </section>

      {/* Performance */}
      <section className="border-y border-line bg-sunken/60 py-16 sm:py-20">
        <div className="container-page">
          <SectionHeading
            eyebrow={t("Engineering Rigor")}
            title={t("Durability & Technical Performance")}
            description={t("Tested against Punjab's extreme atmospheric variance, from sub-tropical monsoon showers to intense dry heatwaves.")}
          />
          <ul className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {texture.performance.map((m, i) => (
              <li key={m.title}>
                <Reveal delay={i * 70} className="h-full">
                  <div className="flex h-full flex-col rounded-card border border-line bg-surface p-6 shadow-card">
                    <span className="grid size-11 place-items-center rounded-lg bg-clay-50 text-clay-500">
                      <Icon name={m.icon} className="size-6" />
                    </span>
                    <h3 dir="auto" className="mt-4 text-lg font-bold">{t(m.title)}</h3>
                    <p dir="auto" className="mt-2 flex-1 text-sm leading-relaxed text-ink-soft">{t(m.description)}</p>
                    <div className="mt-4 flex items-center justify-between gap-3 border-t border-line pt-3 text-xs">
                      <span className="text-ink-muted">{t(m.label)}</span>
                      <strong dir="auto" className="text-clay-600 tnum">{t(m.value)}</strong>
                    </div>
                  </div>
                </Reveal>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Use areas */}
      <section className="container-page py-16 sm:py-20">
        <SectionHeading eyebrow={t("Architectural Placement")} title={t("Recommended Use Areas")} description={t(texture.useAreasIntro)} />
        <ul className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {texture.useAreas.map((u) => (
            <li key={u.title} className="group overflow-hidden rounded-card border border-line bg-surface shadow-card">
              <div className="relative aspect-[4/3] overflow-hidden">
                <TextureImage
                  src={u.image}
                  alt={u.title}
                  swatch={texture.swatch}
                  sizes="(min-width: 1024px) 280px, (min-width: 640px) 50vw, 100vw"
                  className="transition-transform duration-700 group-hover:scale-105"
                />
                <span className="absolute start-3 bottom-3 rounded-md bg-black/55 px-2.5 py-1 text-[11px] font-semibold text-white backdrop-blur">{t(u.tag)}</span>
              </div>
              <div className="p-5">
                <h3 className="text-lg font-bold">{t(u.title)}</h3>
                <p className="mt-2 text-sm leading-relaxed text-ink-soft">{t(u.description)}</p>
                <Link href={quoteHref({ texture: texture.slug })} className="mt-4 inline-flex items-center gap-1 text-[13px] font-bold text-clay-600 hover:text-clay-700">
                  {t(u.cta)} <ArrowRight aria-hidden="true" className="size-4 rtl:-scale-x-100" />
                </Link>
              </div>
            </li>
          ))}
        </ul>
      </section>

      <ShadePicker texture={texture} shades={shades} />

      {/* Projects */}
      {caseStudies.length > 0 && (
        <section className="border-y border-line bg-sunken/60 py-16 sm:py-20">
          <div className="container-page">
            <SectionHeading eyebrow={t("Execution Portfolio")} title={t("Recent Projects in Lahore")} />
            <div className="mt-8">
              <ProjectGrid projects={caseStudies} variant="spec" filterBy="sector" />
            </div>
          </div>
        </section>
      )}

      {/* Compare */}
      <section className="container-page py-16 sm:py-20">
        <SectionHeading
          eyebrow={t("Texture Ecosystem")}
          title={t("Compare With Other Finishes")}
          description={t("Pair this finish with complementary internal and external textures designed and executed by Zain & Co.")}
          action={
            <Button href={`/compare?t=${[texture.slug, ...related.map((r) => r.slug)].slice(0, 3).join(",")}`} variant="secondary">
              <Columns3 aria-hidden="true" className="size-4" /> {t("Compare side by side")}
            </Button>
          }
        />
        <ul className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {related.map((x) => (
            <li key={x.slug}>
              <TextureCard texture={x} />
            </li>
          ))}
        </ul>
      </section>

      {/* Estimator */}
      <section className="container-page pb-28 lg:pb-24">
        <AreaCostCalculator texture={texture} />
      </section>

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd) }} />
    </>
  );
}
