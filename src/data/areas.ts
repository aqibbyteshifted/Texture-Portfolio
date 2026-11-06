import type { Project } from "@/types";
import { msg } from "@/i18n/config";

export interface Area {
  slug: string;
  name: string;
  /** Sector names used by data/projects.ts */
  sectors: Project["sector"][];
  /** Matches a value in locationOptions (data/site.ts) so the quote form is prefilled */
  locationValue: string;
  neighbourhoods: string[];
  /** Words that identify this area inside a testimonial's `meta` text */
  keywords: string[];
}

/**
 * Pages at /areas/[slug]. Local detail (projects, reviews) is pulled from the other data files, so these pages
 * improve automatically as you add projects and reviews for each area.
 */
export const areas: Area[] = [
  {
    slug: "dha-lahore",
    name: msg("DHA Lahore"),
    sectors: ["DHA Lahore"],
    locationValue: "dha",
    neighbourhoods: ["DHA Phase 1", "DHA Phase 2", "DHA Phase 3", "DHA Phase 4", "DHA Phase 5", "DHA Phase 6", "DHA Phase 7", "DHA Phase 8", "DHA Phase 9 Prism"],
    keywords: ["DHA"],
  },
  {
    slug: "bahria-town",
    name: msg("Bahria Town"),
    sectors: ["Bahria Town"],
    locationValue: "bahria",
    neighbourhoods: ["Sector A", "Sector B", "Sector C", "Sector D", "Sector E", "Bahria Orchard"],
    keywords: ["Bahria"],
  },
  {
    slug: "gulberg-mm-alam",
    name: msg("Gulberg & MM Alam Road"),
    sectors: ["Gulberg"],
    locationValue: "gulberg",
    neighbourhoods: ["Gulberg I", "Gulberg II", "Gulberg III", "Gulberg V", "MM Alam Road"],
    keywords: ["Gulberg", "MM Alam"],
  },
  {
    slug: "model-town-garden-town",
    name: msg("Model Town & Garden Town"),
    sectors: ["Model Town"],
    locationValue: "model",
    neighbourhoods: ["Model Town Block A–R", "Garden Town"],
    keywords: ["Model Town", "Garden Town"],
  },
  {
    slug: "johar-town-lake-city",
    name: msg("Johar Town & Lake City"),
    sectors: ["Johar Town", "Lake City"],
    locationValue: "johar",
    neighbourhoods: ["Johar Town Phase 1", "Johar Town Phase 2", "Lake City Sector M"],
    keywords: ["Johar", "Lake City"],
  },
  {
    slug: "wapda-town-valencia",
    name: msg("WAPDA Town & Valencia"),
    sectors: ["WAPDA Town"],
    locationValue: "johar",
    neighbourhoods: ["WAPDA Town Phase 1", "WAPDA Town Phase 2", "Valencia Town"],
    keywords: ["WAPDA", "Valencia"],
  },
];

export const getArea = (slug: string) => areas.find((a) => a.slug === slug);
