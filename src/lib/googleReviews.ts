import "server-only";
import type { Testimonial } from "@/types";

export interface GoogleReviewsData {
  rating: number;
  count: number;
  url: string;
  reviews: Testimonial[];
}

interface PlacesResponse {
  rating?: number;
  userRatingCount?: number;
  googleMapsUri?: string;
  reviews?: {
    rating?: number;
    relativePublishTimeDescription?: string;
    text?: { text?: string };
    originalText?: { text?: string };
    googleMapsUri?: string;
    authorAttribution?: { displayName?: string };
  }[];
}

/**
 * Live rating + latest reviews from Google (Places API New). Requires GOOGLE_PLACES_API_KEY and GOOGLE_PLACE_ID.
 * Returns null when not configured or on any failure, so the site silently falls back to its own testimonials.
 * Cached for 24h.
 */
export async function getGoogleReviews(): Promise<GoogleReviewsData | null> {
  const key = process.env.GOOGLE_PLACES_API_KEY;
  const placeId = process.env.GOOGLE_PLACE_ID;
  if (!key || !placeId) return null;

  try {
    const res = await fetch(`https://places.googleapis.com/v1/places/${encodeURIComponent(placeId)}`, {
      headers: { "X-Goog-Api-Key": key, "X-Goog-FieldMask": "rating,userRatingCount,googleMapsUri,reviews" },
      next: { revalidate: 86_400 },
      signal: AbortSignal.timeout(6000),
    });
    if (!res.ok) return null;
    const data = (await res.json()) as PlacesResponse;
    if (typeof data.rating !== "number") return null;

    const reviews: Testimonial[] = (data.reviews ?? [])
      .map((r, i) => ({
        id: `google-${i}`,
        rating: Math.round(r.rating ?? 5),
        name: r.authorAttribution?.displayName ?? "Google user",
        meta: r.relativePublishTimeDescription ?? "Google review",
        quote: (r.text?.text ?? r.originalText?.text ?? "").trim(),
        source: "google" as const,
        url: r.googleMapsUri,
      }))
      .filter((r) => r.quote.length > 0)
      .slice(0, 5);

    return { rating: data.rating, count: data.userRatingCount ?? 0, url: data.googleMapsUri ?? "", reviews };
  } catch {
    return null;
  }
}
