import { msg } from "@/i18n/config";

export type CityId = "lahore" | "islamabad" | "rawalpindi" | "karachi";

export interface City {
  id: CityId;
  name: string;
  /** What homes in this city typically look like, in general terms. Review against Zain & Co's own site experience. */
  structure: string[];
  /** One-line note on climate and what it means for finishes */
  climate: string;
  /** Layout presets (ids from houseLayouts in data/house.ts) most common here, in order */
  layouts: string[];
  /** Whether the free site survey is confirmed for this city. Set to true for a city once the team travels there for free. */
  freeVisit: boolean;
}

/**
 * The cities we cover. Homes differ from city to city (plot units, shared walls, number of floors, sloped sites), so
 * the whole-house calculator offers different starting layouts for each. Wording is deliberately general ("often",
 * "commonly"): edit it with what your crews actually see.
 */
export const cities: City[] = [
  {
    id: "lahore",
    name: msg("Lahore"),
    structure: [
      msg("Independent houses on marla and kanal plots, usually with boundary walls on all sides."),
      msg("Two or three storeys are common, with a flat roof, a parapet wall and a mumty over the stairs."),
      msg("Wide front elevations in DHA, Bahria Town and Gulberg that often combine two or more finishes."),
    ],
    climate: msg("Hot, dusty summers and a heavy monsoon: breathable, water-shedding exterior finishes matter most."),
    layouts: ["house", "double", "boundary"],
    freeVisit: true,
  },
  {
    id: "islamabad",
    name: msg("Islamabad"),
    structure: [
      msg("Sector and society homes, often large, with garden walls and stone-clad boundary walls."),
      msg("Many sites slope, so retaining walls and stepped boundary walls are common."),
      msg("Heavier rain and cooler winters than the plains, so water resistance and freeze-thaw tolerance matter."),
    ],
    climate: msg("Frequent rain and cold winters: choose weather-resistant exterior systems and seal well."),
    layouts: ["sloped", "double", "house"],
    freeVisit: false,
  },
  {
    id: "rawalpindi",
    name: msg("Rawalpindi"),
    structure: [
      msg("Older areas have narrow-frontage, multi-storey homes on small plots, often sharing side walls."),
      msg("There, mostly the front and upper floors need finishing."),
      msg("Newer societies such as Bahria Town and DHA have larger independent houses with boundary walls."),
    ],
    climate: msg("Heavy monsoon and cold winters, with dense areas where access and scaffolding need planning."),
    layouts: ["portion", "double", "sloped"],
    freeVisit: false,
  },
  {
    id: "karachi",
    name: msg("Karachi"),
    structure: [
      msg("Plots are measured in square yards (120, 240, 400, 500 and more)."),
      msg("Many homes are portions or bungalows with shared side walls, so the front and upper floors are the main job."),
      msg("Flat roofs with a mumty are common; apartment buildings need facade-only work."),
    ],
    climate: msg("Humid, salty sea air: use salt-tolerant, well-sealed finishes and expect more frequent maintenance near the coast."),
    layouts: ["portion", "double", "house"],
    freeVisit: false,
  },
];

export const getCity = (id: string) => cities.find((c) => c.id === id);
