import { Star } from "lucide-react";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ReviewsCarousel } from "@/components/features/ReviewsCarousel";
import { VideoTestimonials } from "@/components/features/VideoTestimonials";
import { testimonials } from "@/data/content";
import { site } from "@/data/site";
import { getI18n } from "@/i18n/server";
import { getGoogleReviews } from "@/lib/googleReviews";

export async function ReviewsSection() {
  const { t } = await getI18n();
  const google = await getGoogleReviews();

  const rating = google?.rating ?? site.google.rating;
  const count = google?.count ?? site.google.count;
  const link = google?.url || site.google.url;
  const live = [...(google?.reviews ?? []), ...testimonials];
  const hasVideos = testimonials.some((x) => x.video);

  const badge = (
    <>
      <Star aria-hidden="true" className="size-4 fill-amber-500 text-amber-500" />
      {t("Google Rating {rating} / 5.0 ({count}+ Verified Lahore Reviews)", { rating: rating.toFixed(1), count })}
    </>
  );

  return (
    <section id="reviews" className="container-page py-16 sm:py-24">
      <div className="mb-8 flex justify-center">
        {link ? (
          <a href={link} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 rounded-full border border-line bg-surface px-4 py-2 text-sm font-semibold shadow-card hover:bg-sunken">
            {badge}
          </a>
        ) : (
          <p className="inline-flex items-center gap-2 rounded-full border border-line bg-surface px-4 py-2 text-sm font-semibold shadow-card">{badge}</p>
        )}
      </div>
      <SectionHeading
        align="center"
        title={t("Trusted by Lahore Homeowners")}
        description={t("Hear how our precision texture systems transformed prestigious residential villas and corporate architecture across the city.")}
      />

      {hasVideos && (
        <div className="mt-10">
          <VideoTestimonials items={testimonials} />
        </div>
      )}

      <div className="mt-10">
        <ReviewsCarousel items={live} />
      </div>
    </section>
  );
}
