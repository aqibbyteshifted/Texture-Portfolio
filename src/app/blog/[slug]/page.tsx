import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, Clock, House, Lightbulb } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { WhatsAppIcon } from "@/components/ui/icons";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { PostCard } from "@/components/features/PostCard";
import { getPost, posts } from "@/data/blog";
import { site } from "@/data/site";
import { getI18n } from "@/i18n/server";
import { formatDate } from "@/lib/format";
import { quoteHref } from "@/lib/quoteLink";
import { whatsappLink } from "@/lib/whatsapp";

type Params = { slug: string };

export function generateStaticParams(): Params[] {
  return posts.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const post = getPost((await params).slug);
  if (!post) return {};
  return {
    title: post.title,
    description: post.description,
    alternates: { canonical: `/blog/${post.slug}` },
    openGraph: { type: "article", publishedTime: post.date, images: [{ url: post.cover }] },
  };
}

export default async function PostPage({ params }: { params: Promise<Params> }) {
  const post = getPost((await params).slug);
  if (!post) notFound();
  const { t } = await getI18n();
  const related = posts.filter((p) => p.slug !== post.slug).slice(0, 3);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.description,
    datePublished: post.date,
    image: `${site.url}${post.cover}`,
    author: { "@type": "Organization", name: site.group },
    publisher: { "@type": "Organization", name: site.group },
    mainEntityOfPage: `${site.url}/blog/${post.slug}`,
  };

  return (
    <>
      <div className="container-page pt-6">
        <nav aria-label={t("Breadcrumb")} className="flex flex-wrap items-center gap-2 text-xs text-ink-muted">
          <Link href="/" className="flex items-center gap-1 hover:text-clay-600"><House aria-hidden="true" className="size-3.5" /> {t("Home")}</Link>
          <span aria-hidden="true">/</span>
          <Link href="/blog" className="hover:text-clay-600">{t("Wall Texture Guides")}</Link>
        </nav>
      </div>

      <article className="container-page max-w-3xl py-10 sm:py-14" lang="en" dir="auto">
        <p className="text-xs font-semibold tracking-[0.14em] text-clay-500 uppercase">{post.category}</p>
        <h1 className="mt-2 text-3xl leading-[1.1] font-extrabold sm:text-5xl">{post.title}</h1>
        <p className="mt-3 flex items-center gap-2 text-sm text-ink-muted">
          <Clock aria-hidden="true" className="size-4" /> {post.readMinutes} min read · {formatDate(post.date, { dateStyle: "long" })}
        </p>
        <div className="relative mt-8 aspect-[16/9] overflow-hidden rounded-2xl">
          <Image src={post.cover} alt="" fill priority sizes="(min-width: 768px) 768px, 100vw" className="object-cover" />
        </div>

        <div className="mt-8 space-y-5 text-[17px] leading-relaxed text-ink-soft">
          {post.body.map((b, i) => {
            if (b.type === "h2") return <h2 key={i} className="pt-4 text-2xl font-bold text-ink">{b.text}</h2>;
            if (b.type === "p") return <p key={i}>{b.text}</p>;
            if (b.type === "ul")
              return (
                <ul key={i} className="list-disc space-y-2 ps-6 marker:text-clay-500">
                  {b.items.map((it) => <li key={it}>{it}</li>)}
                </ul>
              );
            return (
              <aside key={i} className="flex gap-3 rounded-xl border border-clay-300/50 bg-clay-50 p-5 text-ink">
                <Lightbulb aria-hidden="true" className="mt-0.5 size-5 shrink-0 text-clay-500" />
                <p>{b.text}</p>
              </aside>
            );
          })}
        </div>

        <div className="mt-10 grid gap-3 rounded-2xl border border-line bg-surface p-6 shadow-card sm:grid-cols-2">
          <Button href={quoteHref({ texture: post.cta })} size="lg">
            {t("Get Free Quote")} <ArrowRight aria-hidden="true" className="size-4 rtl:-scale-x-100" />
          </Button>
          <Button href={whatsappLink(`Salam Zain & Co, I read your guide "${post.title}" and have a question.`)} variant="whatsapp" size="lg">
            <WhatsAppIcon className="size-5" /> {t("Ask our engineer")}
          </Button>
        </div>
      </article>

      <section className="border-t border-line bg-sunken/60 py-16">
        <div className="container-page">
          <SectionHeading title={t("More guides")} />
          <ul className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {related.map((p) => (
              <li key={p.slug}>
                <PostCard post={p} />
              </li>
            ))}
          </ul>
        </div>
      </section>

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
    </>
  );
}
