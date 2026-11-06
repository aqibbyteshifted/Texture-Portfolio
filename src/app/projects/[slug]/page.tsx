import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, CalendarCheck, Hammer, House, Layers, MapPin, Ruler, Tag } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { WhatsAppIcon } from "@/components/ui/icons";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ProjectGrid } from "@/components/features/ProjectGrid";
import { TextureCard } from "@/components/features/TextureCard";
import { allProjects, getProject } from "@/data/projects";
import { site } from "@/data/site";
import { getTextureByCategory } from "@/data/textures";
import { getI18n } from "@/i18n/server";
import { formatNumber } from "@/lib/format";
import { quoteHref } from "@/lib/quoteLink";
import { whatsappLink } from "@/lib/whatsapp";
import type { Texture } from "@/types";

type Params = { slug: string };

export function generateStaticParams(): Params[] {
  return allProjects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const p = getProject((await params).slug);
  if (!p) return {};
  return {
    title: `${p.title}, ${p.location}`,
    description: `${p.description} ${p.type} project in ${p.location}, completed ${p.completed} by Zain & Co.`,
    alternates: { canonical: `/projects/${p.slug}` },
    openGraph: { images: [{ url: p.image }] },
  };
}

export default async function ProjectPage({ params }: { params: Promise<Params> }) {
  const project = getProject((await params).slug);
  if (!project) notFound();
  const { t } = await getI18n();

  const finishes = project.textures.map((c) => getTextureByCategory(c)).filter((x): x is Texture => Boolean(x));
  const similar = allProjects
    .filter((p) => p.slug !== project.slug && (p.sector === project.sector || p.textures.some((c) => project.textures.includes(c))))
    .slice(0, 3);

  const facts: { icon: typeof MapPin; label: string; value: string }[] = [
    { icon: MapPin, label: t("Location"), value: project.location },
    { icon: Tag, label: t("Project type"), value: t(project.type) },
    { icon: Hammer, label: t("Contract Scope"), value: t(project.scope) },
    { icon: CalendarCheck, label: t("Completed"), value: project.completed },
    { icon: Layers, label: t("Finishes used"), value: finishes.map((f) => t(f.name)).join(" + ") || project.textures.join(" + ") },
    ...(project.areaSqft ? [{ icon: Ruler, label: t("Surface area"), value: `${formatNumber(project.areaSqft)} ${t("sq ft")}` }] : []),
  ];

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    name: project.title,
    description: project.description,
    image: `${site.url}${project.image}`,
    locationCreated: { "@type": "Place", name: project.location },
    creator: { "@type": "HomeAndConstructionBusiness", name: site.group, url: site.url },
  };

  return (
    <>
      <div className="container-page pt-6">
        <nav aria-label={t("Breadcrumb")} className="flex flex-wrap items-center gap-2 text-xs text-ink-muted">
          <Link href="/" className="flex items-center gap-1 hover:text-clay-600"><House aria-hidden="true" className="size-3.5" /> {t("Home")}</Link>
          <span aria-hidden="true">/</span>
          <Link href="/projects" className="hover:text-clay-600">{t("Our Projects")}</Link>
          <span aria-hidden="true">/</span>
          <span aria-current="page" className="font-semibold text-clay-600">{t(project.title)}</span>
        </nav>
      </div>

      <section className="container-page grid gap-8 py-8 lg:grid-cols-[1.3fr_1fr] lg:gap-12 lg:py-12">
        <div className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-ink shadow-lift">
          <Image src={project.image} alt={`${t(project.title)}, ${project.location}`} fill priority sizes="(min-width: 1024px) 760px, 100vw" className="object-cover" />
        </div>
        <div className="flex flex-col">
          <p className="text-xs font-semibold tracking-[0.14em] text-clay-500 uppercase">{t("Case Study")}</p>
          <h1 className="mt-2 text-4xl leading-[1.05] font-extrabold">{t(project.title)}</h1>
          <p className="mt-4 leading-relaxed text-ink-soft">{t(project.description)}</p>
          <dl className="mt-6 grid grid-cols-2 gap-px overflow-hidden rounded-xl border border-line bg-line">
            {facts.map((f) => (
              <div key={f.label} className="bg-surface p-4">
                <dt className="flex items-center gap-1.5 text-[11px] font-semibold tracking-wider text-ink-muted uppercase">
                  <f.icon aria-hidden="true" className="size-3.5" /> {f.label}
                </dt>
                <dd className="mt-1 text-sm font-bold">{f.value}</dd>
              </div>
            ))}
          </dl>
          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            <Button href={quoteHref({ texture: finishes[0]?.slug })} size="lg">
              {t("Quote a similar wall")} <ArrowRight aria-hidden="true" className="size-4 rtl:-scale-x-100" />
            </Button>
            <Button href={whatsappLink(`Salam Zain & Co, I saw your "${project.title}" project (${project.location}) and want something similar.`)} variant="whatsapp" size="lg">
              <WhatsAppIcon className="size-5" /> {t("Ask about this project")}
            </Button>
          </div>
        </div>
      </section>

      {finishes.length > 0 && (
        <section className="border-y border-line bg-sunken/60 py-16 sm:py-20">
          <div className="container-page">
            <SectionHeading eyebrow={t("Architectural Finishes")} title={t("Finishes used on this project")} />
            <ul className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {finishes.map((x) => (
                <li key={x.slug}>
                  <TextureCard texture={x} />
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      {similar.length > 0 && (
        <section className="container-page py-16 sm:py-20">
          <SectionHeading eyebrow={t("Execution Portfolio")} title={t("Similar projects")} />
          <div className="mt-8">
            <ProjectGrid projects={similar} filterBy="sector" />
          </div>
        </section>
      )}

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
    </>
  );
}
