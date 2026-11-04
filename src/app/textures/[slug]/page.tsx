import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, Calculator, CircleCheck, House, Layers, Star, Mountain } from "lucide-react";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Button } from "@/components/ui/Button";
import { Icon, WhatsAppIcon } from "@/components/ui/icons";
import { Reveal } from "@/components/ui/Reveal";
import { TextureImage } from "@/components/ui/TextureImage";
import { AreaCostCalculator } from "@/components/features/AreaCostCalculator";
import { ProjectGrid } from "@/components/features/ProjectGrid";
import { TextureCard } from "@/components/features/TextureCard";
import { TextureGallery } from "@/components/features/TextureGallery";
import { homeProjects, projects } from "@/data/projects";
import { getTexture, textures } from "@/data/textures";
import { site } from "@/data/site";
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

  const related = textures.filter((t) => t.slug !== texture.slug).slice(0, 3);
  const caseStudies =
    texture.category === "Rockwall" ? projects : homeProjects.filter((p) => p.textures.includes(texture.category));

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

  return (
    <>
      <div className="container-page pt-6">
        <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-2 text-xs text-ink-muted">
          <Link href="/" className="flex items-center gap-1 hover:text-clay-600"><House aria-hidden="true" className="size-3.5" /> Home</Link>
          <span aria-hidden="true">/</span>
          <Link href="/textures" className="hover:text-clay-600">Textures Catalog</Link>
          <span aria-hidden="true">/</span>
          <span aria-current="page" className="font-semibold text-clay-600">{texture.name}</span>
          <span className="ml-auto hidden rounded-full bg-clay-100 px-3 py-1 text-[11px] font-bold text-clay-600 sm:inline">DHA &amp; Bahria Batch Ready</span>
        </nav>
      </div>

      {/* Hero */}
      <section className="container-page grid gap-8 py-8 lg:grid-cols-2 lg:gap-14 lg:py-12">
        <TextureGallery
          title={texture.name}
          badge={texture.badge}
          highlight={texture.feature}
          swatch={texture.swatch}
          images={texture.gallery}
          main={texture.image}
        />

        <div>
          <p className="inline-flex items-center gap-1.5 rounded-full bg-clay-50 px-3 py-1 text-[11px] font-bold tracking-wider text-clay-600 uppercase">
            <Mountain aria-hidden="true" className="size-3.5" /> {texture.tagline}
          </p>
          <h1 className="mt-3 text-4xl leading-[1.05] font-extrabold sm:text-5xl">{texture.name}</h1>

          <div className="mt-4 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-ink-soft">
            <span className="flex items-center gap-1" role="img" aria-label={`Rated ${texture.rating} out of 5`}>
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} aria-hidden="true" className={`size-4 ${i < Math.round(texture.rating) ? "fill-amber-500 text-amber-500" : "text-line-strong"}`} />
              ))}
              <strong className="ml-1 text-ink">{texture.rating} / 5</strong>
            </span>
            <span aria-hidden="true">•</span>
            <span>{texture.villas}+ Lahore Villas</span>
            <span aria-hidden="true">•</span>
            <span>PEC Certified</span>
          </div>

          <div className="mt-6 rounded-xl border border-line bg-surface p-5 shadow-card">
            <p className="text-[11px] font-bold tracking-wider text-ink-muted uppercase">Contractor Supply &amp; Application Rate</p>
            <p className="mt-1 flex items-baseline gap-2">
              <span className="font-display text-4xl font-extrabold text-clay-600 tnum">PKR {texture.rate}</span>
              <span className="text-ink-soft">/ sq ft</span>
              <span className="ml-auto rounded-md bg-clay-100 px-2 py-1 text-[11px] font-bold text-clay-600">Material + Master Karigar Labour</span>
            </p>
          </div>

          <p className="mt-5 leading-relaxed text-ink-soft">{texture.description}</p>
          <ul className="mt-5 grid gap-2.5">
            {texture.highlights.map((h) => (
              <li key={h} className="flex gap-2.5 text-sm text-ink-soft">
                <CircleCheck aria-hidden="true" className="mt-0.5 size-5 shrink-0 text-clay-500" /> {h}
              </li>
            ))}
          </ul>

          <dl className="mt-6 grid grid-cols-2 gap-px overflow-hidden rounded-xl border border-line bg-line">
            {[
              ["Application Zone", texture.specs.zone],
              ["Coating Thickness", texture.specs.thickness],
              ["Surface Tactility", texture.specs.tactility],
              ["Full Curing Time", texture.specs.curing],
            ].map(([k, v]) => (
              <div key={k} className="bg-surface p-4">
                <dt className="text-[11px] font-semibold tracking-wider text-ink-muted uppercase">{k}</dt>
                <dd className="mt-1 text-sm font-bold">{v}</dd>
              </div>
            ))}
          </dl>

          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            <Button href="#estimator" size="lg">
              <Calculator aria-hidden="true" className="size-4" /> Calculate Project Estimate
            </Button>
            <Button href={whatsappLink(waMessages.sample(texture.name))} variant="whatsapp" size="lg">
              <WhatsAppIcon className="size-5" /> Request 1x1 ft Sample Board
            </Button>
          </div>
          <p className="mt-3 flex items-center gap-1.5 text-xs text-ink-muted">
            <Layers aria-hidden="true" className="size-3.5" /> Spec Ref: {texture.specRef}
          </p>
        </div>
      </section>

      {/* Performance */}
      <section className="border-y border-line bg-sunken/60 py-16 sm:py-20">
        <div className="container-page">
          <SectionHeading
            eyebrow="Engineering Rigor"
            title="Durability & Technical Performance"
            description="Tested against Punjab's extreme atmospheric variance, from sub-tropical monsoon showers to intense dry heatwaves."
          />
          <ul className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {texture.performance.map((m, i) => (
              <li key={m.title}>
                <Reveal delay={i * 70} className="h-full">
                  <div className="flex h-full flex-col rounded-card border border-line bg-surface p-6 shadow-card">
                    <span className="grid size-11 place-items-center rounded-lg bg-clay-50 text-clay-500">
                      <Icon name={m.icon} className="size-6" />
                    </span>
                    <h3 className="mt-4 text-lg font-bold">{m.title}</h3>
                    <p className="mt-2 flex-1 text-sm leading-relaxed text-ink-soft">{m.description}</p>
                    <div className="mt-4 flex items-center justify-between border-t border-line pt-3 text-xs">
                      <span className="text-ink-muted">{m.label}</span>
                      <strong className="text-clay-600 tnum">{m.value}</strong>
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
        <SectionHeading
          eyebrow="Architectural Placement"
          title="Recommended Use Areas"
          description={texture.useAreasIntro}
        />
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
                <span className="absolute bottom-3 left-3 rounded-md bg-black/55 px-2.5 py-1 text-[11px] font-semibold text-white backdrop-blur">{u.tag}</span>
              </div>
              <div className="p-5">
                <h3 className="text-lg font-bold">{u.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-ink-soft">{u.description}</p>
                <Link href={quoteHref({ texture: texture.slug })} className="mt-4 inline-flex items-center gap-1 text-[13px] font-bold text-clay-600 hover:text-clay-700">
                  {u.cta} <ArrowRight aria-hidden="true" className="size-4" />
                </Link>
              </div>
            </li>
          ))}
        </ul>
      </section>

      {/* Projects */}
      {caseStudies.length > 0 && (
        <section className="border-y border-line bg-sunken/60 py-16 sm:py-20">
          <div className="container-page">
            <SectionHeading eyebrow="Execution Portfolio" title="Recent Projects in Lahore" />
            <div className="mt-8">
              <ProjectGrid projects={caseStudies} variant="spec" filterBy="sector" />
            </div>
          </div>
        </section>
      )}

      {/* Compare */}
      <section className="container-page py-16 sm:py-20">
        <SectionHeading
          eyebrow="Texture Ecosystem"
          title="Compare With Other Finishes"
          description={`Pair ${texture.shortName.toLowerCase()} with complementary internal and external plaster textures designed and executed by Zain & Co.`}
        />
        <ul className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {related.map((t) => (
            <li key={t.slug}>
              <TextureCard texture={t} />
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
