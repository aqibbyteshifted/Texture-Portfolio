import { Hero } from "@/components/sections/Hero";
import { TextureShowcase } from "@/components/sections/TextureShowcase";
import { CalculatorSection } from "@/components/sections/CalculatorSection";
import { WhyUs } from "@/components/sections/WhyUs";
import { CredentialsSection } from "@/components/sections/CredentialsSection";
import { Transformation } from "@/components/sections/Transformation";
import { GallerySection } from "@/components/sections/GallerySection";
import { TeamSection } from "@/components/sections/TeamSection";
import { ProcessSection } from "@/components/sections/ProcessSection";
import { ConsultationSection } from "@/components/sections/ConsultationSection";
import { ReviewsSection } from "@/components/sections/ReviewsSection";
import { FaqSection } from "@/components/sections/FaqSection";
import { CtaBand } from "@/components/sections/CtaBand";
import { ContactSection } from "@/components/sections/ContactSection";

export default function HomePage() {
  return (
    <>
      <Hero />
      <TextureShowcase />
      <CalculatorSection />
      <WhyUs />
      <CredentialsSection />
      <Transformation />
      <GallerySection />
      <TeamSection />
      <ProcessSection />
      <ConsultationSection />
      <ReviewsSection />
      <FaqSection />
      <CtaBand />
      <ContactSection />
    </>
  );
}
