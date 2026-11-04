import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import { TextureCatalog } from "@/components/features/TextureCatalog";
import { Button } from "@/components/ui/Button";
import { WhatsAppIcon } from "@/components/ui/icons";
import { textures } from "@/data/textures";
import { waMessages, whatsappLink } from "@/lib/whatsapp";

export function TextureShowcase() {
  return (
    <section id="textures" className="container-page py-16 sm:py-24">
      <SectionHeading
        eyebrow="Architectural Portfolio"
        title="Our Texture Finishes"
        description="Engineered for Lahore's monsoon humidity and blistering summer heat. Breathable, UV-protected, and mold-resistant surfaces applied by seasoned karigars."
        action={
          <Button href={whatsappLink(waMessages.consult)} variant="whatsapp" className="self-start sm:self-auto">
            <WhatsAppIcon className="size-4" /> Consult an expert
          </Button>
        }
      />
      <Reveal className="mt-10">
        <TextureCatalog items={textures} />
      </Reveal>
    </section>
  );
}
