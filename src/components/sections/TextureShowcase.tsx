import { Columns3 } from "lucide-react";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import { TextureCatalog } from "@/components/features/TextureCatalog";
import { Button } from "@/components/ui/Button";
import { WhatsAppIcon } from "@/components/ui/icons";
import { textures } from "@/data/textures";
import { getI18n } from "@/i18n/server";
import { waMessages, whatsappLink } from "@/lib/whatsapp";

export async function TextureShowcase() {
  const { t } = await getI18n();
  return (
    <section id="textures" className="container-page py-16 sm:py-24">
      <SectionHeading
        eyebrow={t("Architectural Portfolio")}
        title={t("Our Texture Finishes")}
        description={t("Engineered for Lahore's monsoon humidity and blistering summer heat. Breathable, UV-protected, and mold-resistant surfaces applied by seasoned karigars.")}
        action={
          <div className="flex flex-wrap gap-2 self-start sm:self-auto">
            <Button href="/compare" variant="secondary">
              <Columns3 aria-hidden="true" className="size-4" /> {t("Compare finishes")}
            </Button>
            <Button href={whatsappLink(waMessages.consult)} variant="whatsapp">
              <WhatsAppIcon className="size-4" /> {t("Consult an expert")}
            </Button>
          </div>
        }
      />
      <Reveal className="mt-10">
        <TextureCatalog items={textures} />
      </Reveal>
    </section>
  );
}
