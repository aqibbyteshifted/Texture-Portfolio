import { textures } from "@/data/textures";
import { paymentFaq } from "@/data/policy";
import { effectiveRate, maxRate } from "@/lib/rates";
import type { Faq, Testimonial } from "@/types";

const cheapest = [...textures].sort((a, b) => effectiveRate(a) - effectiveRate(b))[0];
const priciest = [...textures].sort((a, b) => maxRate(b) - maxRate(a))[0];

/** Used by the FAQ so the price answer can be translated with live numbers. */
export const priceExtremes = { cheapest, priciest };

export const testimonials: Testimonial[] = [
  { id: "t1", rating: 5, name: "Ahmed Khan", meta: "DHA Phase 5, Lahore • 1 Kanal Elevation", quote: "We hired Zain & Co for the Italian Travertine elevation on our 1-Kanal villa in DHA Phase 5. The karigars were extremely respectful, protected our aluminum windows, and the depth of the finish looks like genuine imported stone. Delivered exactly on day eight." },
  { id: "t2", rating: 5, name: "Sana Malik", meta: "Gulberg III, Lahore • Interior Accent", quote: "Finding a team in Lahore that can execute authentic terracotta micro-cement color crete without cracking seemed impossible. Zain and his team created our drawing room feature wall in Gulberg with zero seams. Outstanding craftsmanship." },
  { id: "t3", rating: 5, name: "Bilal Raza", meta: "Bahria Town Sector C, Lahore • Boundary Walls", quote: "Our boundary walls kept blistering every monsoon season. Zain & Co applied their Rockwall aggregate with waterproof primer in Bahria Town. Two years later through heavy Lahore rains, not a single chip or water mark. 10/10 recommend!" },
];

export const faqs: Faq[] = [
  { id: "f1", question: "What is the average cost per square foot for wall texturing in Lahore?", answer: `Our turnkey rates range from PKR ${effectiveRate(cheapest)} / sq ft for ${cheapest.name} up to PKR ${maxRate(priciest)} / sq ft for ${priciest.name}. This rate is all-inclusive, covering base preparation, imported materials, skilled karigar labor, and final protective sealing. See each finish's page for its exact rate.` },
  { id: "f2", question: "How long does it take to finish a typical 1-Kanal exterior elevation?", answer: "A standard 1-Kanal villa elevation in Lahore (approx. 3,500 – 4,500 sq ft of surface area) typically requires 7 to 10 working days. This timeframe accounts for essential curing intervals between the penetrating primer, base coat mesh embedding, and final artisan hand-trowel layers." },
  { id: "f3", question: "Can textures like Travertine or Rockwall be applied over old painted walls?", answer: "Yes. For existing renovations, our team first conducts an adhesion audit. We mechanically scrape off loose distemper or plastic paint, treat any seepages with moisture-resistant bonders, and apply our quartz keying primer to create a strong mechanical bond before texturing." },
  { id: "f4", question: "How do these finishes withstand Lahore's intense monsoon rains?", answer: "Our formulations use elastomeric polymers that bridge micro-settlement cracks, combined with anti-fungal silicon sealers that shed rainwater like a lotus leaf. This prevents rainwater penetration, dark algae streaks, and moisture peeling." },
  { id: "f5", question: "What does the 3-Year Warranty cover?", answer: "Our warranty covers delamination, flaking, hollow spots, and color fading caused by UV light. In the unlikely event of any issue, our maintenance crew visits within 48 hours to re-trowel and seal the section at zero cost to you." },
  { id: "f6", question: "Do you take projects outside Lahore across Punjab?", answer: "Yes. For larger estates and commercial projects above 3,000 sq ft, we routinely mobilize teams to Islamabad/Rawalpindi, Faisalabad, Gujranwala, Sialkot, and Multan with dedicated on-site boarding and engineering supervision." },
  paymentFaq,
];
