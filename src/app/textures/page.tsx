import type { Metadata } from "next";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { TextureCatalog } from "@/components/features/TextureCatalog";
import { Button } from "@/components/ui/Button";
import { textures } from "@/data/textures";
import { quoteHref } from "@/lib/quoteLink";

export const metadata: Metadata = {
  title: "Textures Catalog: Rockwall, Travertine, Microcement, Epoxy & More",
  description:
    "Browse Zain & Co's finishes for Lahore: rockwall, stucco, graffiato, wash terrazzo, travertine, nugdi, velvet paint, limewash, microcement and epoxy flooring with transparent per sq ft pricing.",
  alternates: { canonical: "/textures" },
};

export default function TexturesPage() {
  return (
    <div className="container-page py-12 sm:py-16">
      <SectionHeading
        as="h1"
        eyebrow="Architectural Portfolio"
        title="Textures Catalog"
        description={`${textures.length} signature finishes, each engineered for Lahore's monsoon humidity and summer heat. Filter by environment, compare turnkey rates, and open any finish for full specifications.`}
        action={<Button href={quoteHref()}>Get Free Quote</Button>}
      />
      <div className="mt-10">
        <TextureCatalog items={textures} />
      </div>
    </div>
  );
}
