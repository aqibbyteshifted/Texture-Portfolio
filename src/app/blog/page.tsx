import type { Metadata } from "next";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { PostCard } from "@/components/features/PostCard";
import { latestPosts, posts } from "@/data/blog";
import { getI18n } from "@/i18n/server";

export const metadata: Metadata = {
  title: "Guides: Wall Texture Costs, Finishes & Care in Lahore",
  description: "Practical guides from Zain & Co on choosing wall finishes, understanding costs, measuring walls and protecting them from the monsoon.",
  alternates: { canonical: "/blog" },
};

export default async function BlogPage() {
  const { t } = await getI18n();
  return (
    <div className="container-page py-12 sm:py-16">
      <SectionHeading
        as="h1"
        eyebrow={t("Guides & Advice")}
        title={t("Wall Texture Guides")}
        description={t("Plain-language advice on choosing finishes, understanding quotes, measuring walls and keeping them looking good.")}
      />
      <ul className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {latestPosts(posts.length).map((p) => (
          <li key={p.slug}>
            <PostCard post={p} />
          </li>
        ))}
      </ul>
    </div>
  );
}
