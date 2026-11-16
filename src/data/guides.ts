/**
 * Content for the customer help tools (/wall-doctor, /finish-finder, /measure, /prepare).
 * Original wording, English only. Review the technical advice against Zain & Co's own site practice before launch.
 */

export interface Symptom {
  id: string;
  label: string;
  /** Water-related: the source must be fixed before ANY finish goes on. */
  water?: boolean;
  /** Visible cracks: favour textured finishes that hide hairlines. */
  cracks?: boolean;
  cause: string;
  action: string;
}

export const symptoms: Symptom[] = [
  {
    id: "damp",
    label: "Damp patches or seelan on the wall",
    water: true,
    cause: "Moisture rising from the ground, a leaking pipe or water getting in from the roof or the outside face.",
    action: "Find and repair the water source first, let the wall dry fully, then treat with a damp-proof primer. A finish applied over a wet wall will blister.",
  },
  {
    id: "white-powder",
    label: "White powdery salt deposits",
    water: true,
    cause: "Salts carried to the surface by moisture (efflorescence).",
    action: "Dry-brush the salts off, correct the moisture source, and use a salt-resistant primer before texturing.",
  },
  {
    id: "fungus",
    label: "Black or green patches (fungus, algae)",
    water: true,
    cause: "Long-term dampness and poor sunlight or ventilation.",
    action: "Scrub with an anti-fungal wash, let dry, then seal with an anti-fungal primer. Improve ventilation where possible.",
  },
  {
    id: "hairline",
    label: "Fine hairline cracks",
    cracks: true,
    cause: "Normal shrinkage of plaster, or small temperature movement.",
    action: "Rake and fill the cracks, add mesh over repaired joints, and choose a finish with some texture that bridges them.",
  },
  {
    id: "wide-cracks",
    label: "Wide or growing cracks (over 3 mm)",
    cracks: true,
    cause: "Structural settlement or movement between different materials.",
    action: "Have a site engineer look at it before finishing. Cracks that keep growing need repair of the cause, not just filling.",
  },
  {
    id: "peeling",
    label: "Old paint is peeling or flaking",
    cause: "Poor adhesion, trapped moisture or paint that has aged out.",
    action: "Scrape back to a firm edge, sand, and apply a keying primer so the new layer bonds mechanically.",
  },
  {
    id: "hollow",
    label: "Plaster sounds hollow when tapped",
    cause: "The plaster has lost its grip on the wall behind it.",
    action: "Cut out and re-plaster the hollow patches. Texture over hollow plaster will crack and lift.",
  },
  {
    id: "oily",
    label: "Old oil paint, glossy or chalky surface",
    cause: "Glossy or chalky layers do not accept a new coat well.",
    action: "Sand to a matt key (or strip), wash off chalk dust, then prime with a bonding primer.",
  },
  {
    id: "fresh",
    label: "New plaster, less than 4 weeks old",
    cause: "Fresh plaster still holds moisture and alkali.",
    action: "Let it cure fully (about 28 days) before finishing, or we will advise a suitable alkali-resistant primer.",
  },
  {
    id: "uneven",
    label: "Rough, wavy or uneven surface",
    cause: "Poor original plastering.",
    action: "Skim or level the worst areas. Heavier textures hide minor waviness; smooth finishes such as microcement show every flaw.",
  },
];

/** Finishes that cope best with damp-prone walls (breathable or heavily textured). */
export const dampTolerant = ["limewash", "rockwall-aggregates", "sand-texture", "color-crete"];
/** Finishes with enough texture to hide hairline cracks. */
export const crackHiding = ["rockwall-aggregates", "nugdi-texture", "mediterranean-graffiato", "sand-texture", "stucco-antico"];

export type Zone = "interior" | "exterior" | "floor";

export interface Look {
  id: string;
  label: string;
  hint: string;
}

export const looks: Look[] = [
  { id: "stone", label: "Natural stone", hint: "Rugged, earthy, like cut rock or travertine" },
  { id: "smooth", label: "Smooth and modern", hint: "Clean, seamless, minimal" },
  { id: "concrete", label: "Raw concrete", hint: "Industrial, honest, architectural" },
  { id: "classic", label: "Classic hand-worked", hint: "Swirls and trowel marks with character" },
  { id: "soft", label: "Soft matte", hint: "Gentle, calm, warm" },
];

/** Which looks each finish delivers. Slugs must exist in data/textures.ts. */
export const looksBySlug: Record<string, string[]> = {
  "rockwall-aggregates": ["stone"],
  "stucco-antico": ["classic", "soft", "smooth"],
  "mediterranean-graffiato": ["classic"],
  "wash-terrazzo": ["stone", "classic"],
  "italian-travertine": ["stone"],
  "nugdi-texture": ["classic"],
  "nova-paint": ["soft", "smooth"],
  limewash: ["soft", "classic"],
  microcement: ["smooth", "concrete"],
  "color-crete": ["concrete", "smooth"],
  "fair-face": ["concrete"],
  "sand-texture": ["stone", "soft"],
  "epoxy-flooring": ["smooth", "concrete"],
};

export interface PrepGroup {
  id: string;
  title: string;
  items: string[];
}

export const prepChecklist: PrepGroup[] = [
  {
    id: "before",
    title: "A week before work starts",
    items: [
      "Confirm the finish, shade code and sample board in writing with the office.",
      "Confirm the start date and the number of working days on your quotation.",
      "Fix any leaking pipes, tank overflows or roof seepage near the walls to be finished.",
      "Decide who will be on site to approve colour and answer questions.",
      "Keep milestone payments ready for the company office only. Never pay workers.",
    ],
  },
  {
    id: "site",
    title: "The day before",
    items: [
      "Move furniture, plants and fragile items away from the working walls, or cover them.",
      "Remove wall hangings, nameplates, lights and fixtures that are easy to take down.",
      "Make sure water and a working electrical socket are available.",
      "Clear a path for ladders and materials, and tell security or the gate about the crew.",
      "Park cars away from the exterior walls being worked on.",
    ],
  },
  {
    id: "during",
    title: "While work is in progress",
    items: [
      "Do not touch or lean on freshly applied coats; curing time is part of the job.",
      "Keep children and pets away from the working area.",
      "Ask the supervisor, not individual workers, about progress, and raise concerns with the office.",
      "Take dated photos of each stage for your own records.",
      "Agree any extra work with the office in writing before it starts.",
    ],
  },
  {
    id: "handover",
    title: "At handover",
    items: [
      "Walk every wall in daylight with the supervisor and note anything to correct.",
      "Check the shade against your approved sample board.",
      "Receive the signed warranty card and keep it safe.",
      "Pay the final milestone only to the company and collect an official receipt.",
      "Save the office number for any warranty claim.",
    ],
  },
];

export const measureSteps: { title: string; text: string }[] = [
  { title: "Measure length and height", text: "Use a tape or a laser meter. For each wall write length and height in feet. Round up to the nearest half foot." },
  { title: "Do each wall separately", text: "Break the house into rectangles: front, back, sides, boundary, porch columns. One row per wall is easier to check than one big guess." },
  { title: "Subtract big openings", text: "Take off large doors, windows and garage gates. As a rough guide, a standard door is about 20 sq ft and a window about 12 sq ft. Small openings can be ignored." },
  { title: "Add what is often forgotten", text: "Return faces of columns, parapet walls, boundary wall tops and the inside face of balconies all count if they will be finished." },
  { title: "Confirm at the free survey", text: "Our team measures again on site before the final quote, so a small mistake here does not become a bill." },
];
