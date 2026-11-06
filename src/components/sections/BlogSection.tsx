import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import { PostCard } from "@/components/features/PostCard";
import { latestPosts } from "@/data/blog";
import { getI18n } from "@/i18n/server";

export async function BlogSection() {
  const { t } = await getI18n();
  return (
    <section id="guides" className="container-page py-16 sm:py-24">
      <SectionHeading
        eyebrow={t("Guides & Advice")}
        title={t("Wall Texture Guides")}
        description={t("Plain-language advice on choosing finishes, understanding quotes, measuring walls and keeping them looking good.")}
        action={
          <Button href="/blog" variant="secondary" className="self-start sm:self-auto">
            {t("All guides")} <ArrowRight aria-hidden="true" className="size-4 rtl:-scale-x-100" />
          </Button>
        }
      />
      <ul className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {latestPosts(3).map((p, i) => (
          <li key={p.slug}>
            <Reveal delay={i * 80} className="h-full">
              <PostCard post={p} />
            </Reveal>
          </li>
        ))}
      </ul>
    </section>
  );
}
