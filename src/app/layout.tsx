import type { Metadata, Viewport } from "next";
import { Bricolage_Grotesque, Geist } from "next/font/google";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { FloatingActions } from "@/components/layout/FloatingActions";
import { site } from "@/data/site";
import { priceRange } from "@/data/textures";
import "./globals.css";

const geist = Geist({ subsets: ["latin"], variable: "--font-geist", display: "swap" });
const display = Bricolage_Grotesque({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
  axes: ["opsz"],
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: `${site.name} | Premium Wall Texture & Facade Finishes in Lahore`,
    template: `%s | ${site.name} Lahore`,
  },
  description: site.description,
  applicationName: site.name,
  keywords: [
    "wall texture Lahore",
    "rockwall texture Lahore",
    "Italian travertine plaster",
    "color crete microcement",
    "stucco Antico",
    "exterior facade finishes DHA",
    "Bahria Town wall texture",
  ],
  openGraph: {
    type: "website",
    locale: "en_PK",
    siteName: site.name,
    title: `${site.name} | Premium Wall Texture & Facade Finishes in Lahore`,
    description: site.description,
    images: [{ url: "/images/proj-dha-villa42.jpg", width: 1200, height: 630, alt: "Textured villa facade in DHA Lahore" }],
  },
  twitter: { card: "summary_large_image" },
  alternates: { canonical: "/" },
};

export const viewport: Viewport = {
  themeColor: "#faf8f5",
  width: "device-width",
  initialScale: 1,
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "HomeAndConstructionBusiness",
  name: site.group,
  description: site.description,
  url: site.url,
  telephone: site.phone,
  email: site.email,
  image: `${site.url}/images/proj-dha-villa42.jpg`,
  priceRange: `PKR ${priceRange.min} - PKR ${priceRange.max} / sq ft`,
  address: {
    "@type": "PostalAddress",
    streetAddress: "Plot 18-C, Commercial Broadway, DHA Phase 5",
    addressLocality: "Lahore",
    addressRegion: "Punjab",
    addressCountry: "PK",
  },
  geo: { "@type": "GeoCoordinates", latitude: site.geo.lat, longitude: site.geo.lng },
  openingHoursSpecification: {
    "@type": "OpeningHoursSpecification",
    dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
    opens: "09:00",
    closes: "19:00",
  },
  aggregateRating: { "@type": "AggregateRating", ratingValue: "4.9", reviewCount: "120" },
  areaServed: ["Lahore", "Islamabad", "Rawalpindi", "Faisalabad", "Multan"],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${geist.variable} ${display.variable}`}>
      <body className="min-h-dvh">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[100] focus:rounded-md focus:bg-clay-500 focus:px-4 focus:py-2 focus:text-white"
        >
          Skip to content
        </a>
        <Header />
        <main id="main">{children}</main>
        <Footer />
        <FloatingActions />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      </body>
    </html>
  );
}
