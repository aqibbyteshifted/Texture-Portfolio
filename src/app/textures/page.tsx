import type { Metadata } from "next";
import { Columns3 } from "lucide-react";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { TextureCatalog } from "@/components/features/TextureCatalog";
import { Button } from "@/components/ui/Button";
import { textures } from "@/data/textures";
import { getI18n } from "@/i18n/server";
import { quoteHref } from "@/lib/quoteLink";

export const metadata: Metadata = {
  title: "Textures Catalog: Rockwall, Travertine, Microcement, Epoxy & More",
  description:
    "Browse Zain & Co's finishes for Lahore: rockwall, stucco, graffiato, wash terrazzo, travertine, nugdi, velvet paint, limewash, microcement and epoxy flooring with transparent per sq ft pricing.",
  alternates: { canonical: "/textures" },
};

export default async function TexturesPage() {
  const { t } = await getI18n();
  return (
    <div className="container-page py-12 sm:py-16">
      <SectionHeading
        as="h1"
        eyebrow={t("Architectural Portfolio")}
        title={t("Textures Catalog")}
        description={t("{n} signature finishes, each engineered for Lahore's monsoon humidity and summer heat. Filter by environment, compare turnkey rates, and open any finish for full specifications.", { n: textures.length })}
        action={
          <div className="flex flex-wrap gap-2">
            <Button href="/compare" variant="secondary">
              <Columns3 aria-hidden="true" className="size-4" /> {t("Compare finishes")}
            </Button>
            <Button href={quoteHref()}>{t("Get Free Quote")}</Button>
          </div>
        }
      />
      <div className="mt-10">
        <TextureCatalog items={textures} />
      </div>
    </div>
  );
}
