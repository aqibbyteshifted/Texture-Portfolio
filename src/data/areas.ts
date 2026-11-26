import type { CityId } from "@/data/cities";
import type { Project } from "@/types";
import { msg } from "@/i18n/config";

export interface Area {
  slug: string;
  city: CityId;
  name: string;
  /** Sector names used by data/projects.ts (empty until there are projects in that area) */
  sectors: Project["sector"][];
  /** Matches a value in locationOptions (data/site.ts) so the quote form is prefilled */
  locationValue: string;
  neighbourhoods: string[];
  /** Words that identify this area inside a testimonial's `meta` text */
  keywords: string[];
}

/**
 * Pages at /areas/[slug]. Local detail (projects, reviews) is pulled from the other data files, so these pages
 * improve automatically as you add projects and reviews for each area. Islamabad, Rawalpindi and Karachi have no
 * projects listed yet: add them to data/projects.ts (and a matching `sectors` value) when you have real photos.
 */
export const areas: Area[] = [
  {
    slug: "dha-lahore",
    city: "lahore",
    name: msg("DHA Lahore"),
    sectors: ["DHA Lahore"],
    locationValue: "dha",
    neighbourhoods: ["DHA Phase 1", "DHA Phase 2", "DHA Phase 3", "DHA Phase 4", "DHA Phase 5", "DHA Phase 6", "DHA Phase 7", "DHA Phase 8", "DHA Phase 9 Prism"],
    keywords: ["DHA"],
  },
  {
    slug: "bahria-town",
    city: "lahore",
    name: msg("Bahria Town"),
    sectors: ["Bahria Town"],
    locationValue: "bahria",
    neighbourhoods: ["Sector A", "Sector B", "Sector C", "Sector D", "Sector E", "Bahria Orchard"],
    keywords: ["Bahria"],
  },
  {
    slug: "gulberg-mm-alam",
    city: "lahore",
    name: msg("Gulberg & MM Alam Road"),
    sectors: ["Gulberg"],
    locationValue: "gulberg",
    neighbourhoods: ["Gulberg I", "Gulberg II", "Gulberg III", "Gulberg V", "MM Alam Road"],
    keywords: ["Gulberg", "MM Alam"],
  },
  {
    slug: "model-town-garden-town",
    city: "lahore",
    name: msg("Model Town & Garden Town"),
    sectors: ["Model Town"],
    locationValue: "model",
    neighbourhoods: ["Model Town Block A–R", "Garden Town"],
    keywords: ["Model Town", "Garden Town"],
  },
  {
    slug: "johar-town-lake-city",
    city: "lahore",
    name: msg("Johar Town & Lake City"),
    sectors: ["Johar Town", "Lake City"],
    locationValue: "johar",
    neighbourhoods: ["Johar Town Phase 1", "Johar Town Phase 2", "Lake City Sector M"],
    keywords: ["Johar", "Lake City"],
  },
  {
    slug: "wapda-town-valencia",
    city: "lahore",
    name: msg("WAPDA Town & Valencia"),
    sectors: ["WAPDA Town"],
    locationValue: "johar",
    neighbourhoods: ["WAPDA Town Phase 1", "WAPDA Town Phase 2", "Valencia Town"],
    keywords: ["WAPDA", "Valencia"],
  },

  {
    slug: "islamabad-sectors",
    city: "islamabad",
    name: msg("Islamabad Sectors"),
    sectors: [],
    locationValue: "isb-sectors",
    neighbourhoods: ["F-6", "F-7", "F-8", "F-10", "F-11", "E-7", "E-11", "G-6", "G-9", "G-10", "G-11", "G-13", "D-12", "I-8", "I-10"],
    keywords: ["Islamabad"],
  },
  {
    slug: "islamabad-societies",
    city: "islamabad",
    name: msg("DHA Islamabad, Bahria Enclave & Gulberg Greens"),
    sectors: [],
    locationValue: "isb-societies",
    neighbourhoods: ["DHA Islamabad", "Bahria Enclave", "Gulberg Greens", "Park Road", "Chak Shahzad", "Bani Gala"],
    keywords: ["Islamabad DHA", "Bahria Enclave", "Gulberg Greens"],
  },

  {
    slug: "rawalpindi-city",
    city: "rawalpindi",
    name: msg("Rawalpindi City"),
    sectors: [],
    locationValue: "rwp-city",
    neighbourhoods: ["Satellite Town", "Chaklala Scheme III", "Saddar", "Westridge", "Peshawar Road", "Adiala Road"],
    keywords: ["Rawalpindi"],
  },
  {
    slug: "rawalpindi-societies",
    city: "rawalpindi",
    name: msg("Bahria Town & DHA Rawalpindi"),
    sectors: [],
    locationValue: "rwp-societies",
    neighbourhoods: ["Bahria Town Phases 1–8", "DHA Rawalpindi", "Gulraiz Housing Society", "Askari 14"],
    keywords: ["Rawalpindi Bahria", "DHA Rawalpindi"],
  },

  {
    slug: "karachi-dha-clifton",
    city: "karachi",
    name: msg("DHA & Clifton, Karachi"),
    sectors: [],
    locationValue: "khi-dha",
    neighbourhoods: ["DHA Phase 5", "DHA Phase 6", "DHA Phase 7", "DHA Phase 8", "Clifton Blocks 2–9"],
    keywords: ["Karachi DHA", "Clifton"],
  },
  {
    slug: "karachi-central",
    city: "karachi",
    name: msg("Gulshan, Jauhar & PECHS, Karachi"),
    sectors: [],
    locationValue: "khi-central",
    neighbourhoods: ["Gulshan-e-Iqbal", "Gulistan-e-Jauhar", "PECHS", "North Nazimabad", "Federal B Area"],
    keywords: ["Karachi"],
  },
  {
    slug: "karachi-bahria-scheme-33",
    city: "karachi",
    name: msg("Bahria Town & Scheme 33, Karachi"),
    sectors: [],
    locationValue: "khi-bahria",
    neighbourhoods: ["Bahria Town Karachi", "Scheme 33", "Malir Cantt", "Gadap"],
    keywords: ["Bahria Karachi", "Scheme 33"],
  },
];

export const getArea = (slug: string) => areas.find((a) => a.slug === slug);
