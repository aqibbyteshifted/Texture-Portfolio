import { SectionHeading } from "@/components/ui/SectionHeading";
import { Gallery } from "@/components/features/Gallery";
import { Reveal } from "@/components/ui/Reveal";
import { galleryItems } from "@/data/gallery";
import { getI18n } from "@/i18n/server";

export async function GallerySection() {
  const { t } = await getI18n();
  return (
    <section id="gallery" className="container-page py-16 sm:py-24">
      <SectionHeading
        align="center"
        eyebrow={t("Project Gallery")}
        title={t("Walls We've Finished Across Lahore")}
        description={t("Tap any project to view it full screen. Photos and videos from real DHA, Bahria, Gulberg and Model Town sites.")}
      />
      <Reveal className="mt-10">
        <Gallery items={galleryItems} />
      </Reveal>
    </section>
  );
}
