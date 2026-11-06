import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Clock } from "lucide-react";
import { getI18n } from "@/i18n/server";
import { formatDate } from "@/lib/format";
import type { BlogPost } from "@/data/blog";

export async function PostCard({ post }: { post: BlogPost }) {
  const { t } = await getI18n();
  return (
    <article className="group relative flex h-full flex-col overflow-hidden rounded-card border border-line bg-surface shadow-card transition-shadow hover:shadow-lift">
      <div className="relative aspect-[16/10] overflow-hidden">
        <Image src={post.cover} alt="" fill sizes="(min-width: 1024px) 380px, (min-width: 640px) 50vw, 100vw" className="object-cover transition-transform duration-700 group-hover:scale-105" />
        <span className="absolute start-3 top-3 rounded-md bg-surface/95 px-2.5 py-1 text-[11px] font-bold text-ink shadow-sm">{t(post.category)}</span>
      </div>
      <div className="flex flex-1 flex-col p-5">
        <h3 className="text-lg leading-snug font-bold text-ink">
          <Link href={`/blog/${post.slug}`} className="after:absolute after:inset-0 after:content-[''] hover:text-clay-600">
            <span dir="auto">{post.title}</span>
          </Link>
        </h3>
        <p dir="auto" className="mt-2 flex-1 text-sm leading-relaxed text-ink-soft">{post.description}</p>
        <p className="mt-4 flex items-center justify-between border-t border-line pt-3 text-xs text-ink-muted">
          <span className="flex items-center gap-1.5">
            <Clock aria-hidden="true" className="size-3.5" /> {t("{n} min read", { n: post.readMinutes })} · {formatDate(post.date, { dateStyle: "medium" })}
          </span>
          <ArrowRight aria-hidden="true" className="size-4 text-clay-500 transition-transform group-hover:translate-x-0.5 rtl:-scale-x-100" />
        </p>
      </div>
    </article>
  );
}
