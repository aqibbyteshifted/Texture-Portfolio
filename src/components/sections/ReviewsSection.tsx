import { Star } from "lucide-react";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ReviewsCarousel } from "@/components/features/ReviewsCarousel";
import { testimonials } from "@/data/content";

export function ReviewsSection() {
  return (
    <section id="reviews" className="container-page py-16 sm:py-24">
      <div className="mb-8 flex justify-center">
        <p className="inline-flex items-center gap-2 rounded-full border border-line bg-surface px-4 py-2 text-sm font-semibold shadow-card">
          <Star aria-hidden="true" className="size-4 fill-amber-500 text-amber-500" />
          Google Rating 4.9 / 5.0 (120+ Verified Lahore Reviews)
        </p>
      </div>
      <SectionHeading
        align="center"
        title="Trusted by Lahore Homeowners"
        description="Hear how our precision texture systems transformed prestigious residential villas and corporate architecture across the city."
      />
      <div className="mt-10">
        <ReviewsCarousel items={testimonials} />
      </div>
    </section>
  );
}
