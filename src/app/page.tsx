import { Hero } from "@/components/sections/Hero";
import { TextureShowcase } from "@/components/sections/TextureShowcase";
import { CalculatorSection } from "@/components/sections/CalculatorSection";
import { VisualizerPromo } from "@/components/sections/VisualizerPromo";
import { BlogSection } from "@/components/sections/BlogSection";
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
      <VisualizerPromo />
      <WhyUs />
      <CredentialsSection />
      <Transformation />
      <GallerySection />
      <TeamSection />
      <ProcessSection />
      <ConsultationSection />
      <ReviewsSection />
      <FaqSection />
      <BlogSection />
      <CtaBand />
      <ContactSection />
    </>
  );
}
