import { msg } from "@/i18n/config";

/** Standard opening sizes (sq ft) deducted from a wall. Rough averages; the survey measures exactly. */
export const OPENING_SQFT = { door: 20, window: 12, gate: 60 } as const;

export type OpeningKind = keyof typeof OPENING_SQFT;

export interface HouseGroup {
  id: string;
  title: string;
  hint: string;
  /** Rows created when the group is first shown */
  defaultRows: string[];
  /** Ask which side(s) of the wall get finished (boundary and parapet walls are often done inside and outside) */
  faces: boolean;
  /** Which openings can be deducted */
  openings: OpeningKind[];
  /** Ticked by default */
  on: boolean;
  /** Rough warning shown when the group is on (scaffold, etc.) */
  scaffold?: boolean;
}

/**
 * The parts of a house a client can describe. Order is the order shown on screen and in the PDF/WhatsApp summary.
 * Add a group here and it appears in the calculator automatically.
 */
export const houseGroups: HouseGroup[] = [
  {
    id: "front",
    title: msg("Front elevation (ground floor)"),
    hint: msg("The face of the house that looks at the road. Width of the house and height up to the first-floor slab."),
    defaultRows: [msg("Front wall")],
    faces: false,
    openings: ["door", "window"],
    on: true,
  },
  {
    id: "sides",
    title: msg("Side walls (ground floor)"),
    hint: msg("Left and right walls of the building. Enter each side separately if they differ."),
    defaultRows: [msg("Left side"), msg("Right side")],
    faces: false,
    openings: ["door", "window"],
    on: true,
  },
  {
    id: "back",
    title: msg("Back wall (ground floor)"),
    hint: msg("The wall at the rear of the house."),
    defaultRows: [msg("Back wall")],
    faces: false,
    openings: ["door", "window"],
    on: false,
  },
  {
    id: "first",
    title: msg("First floor (double storey)"),
    hint: msg("Front, sides and back of the upper floor. Use the height of that floor only."),
    defaultRows: [msg("Front"), msg("Left side"), msg("Right side"), msg("Back")],
    faces: false,
    openings: ["door", "window"],
    on: false,
    scaffold: true,
  },
  {
    id: "second",
    title: msg("Second floor (third storey)"),
    hint: msg("Same as above for the next floor up."),
    defaultRows: [msg("Front"), msg("Left side"), msg("Right side"), msg("Back")],
    faces: false,
    openings: ["door", "window"],
    on: false,
    scaffold: true,
  },
  {
    id: "mumty",
    title: msg("Mumty (stair head-room on the roof)"),
    hint: msg("The small room over the staircase. Enter the outside walls; add the inside too if it will be finished."),
    defaultRows: [msg("Mumty wall 1"), msg("Mumty wall 2"), msg("Mumty wall 3"), msg("Mumty wall 4")],
    faces: true,
    openings: ["door", "window"],
    on: false,
    scaffold: true,
  },
  {
    id: "parapet",
    title: msg("Terrace / roof boundary (parapet)"),
    hint: msg("The low wall around the roof. Choose outside, inside or both faces."),
    defaultRows: [msg("Roof boundary")],
    faces: true,
    openings: [],
    on: false,
    scaffold: true,
  },
  {
    id: "boundary",
    title: msg("Boundary wall"),
    hint: msg("The wall around the plot. Choose outside only, inside only or both faces for each stretch."),
    defaultRows: [msg("Front boundary"), msg("Left boundary"), msg("Right boundary"), msg("Back boundary")],
    faces: true,
    openings: ["gate"],
    on: true,
  },
  {
    id: "retaining",
    title: msg("Retaining and garden walls (sloped plots)"),
    hint: msg("Walls that hold back soil on a sloping plot, and garden or terrace walls. Choose one or both faces."),
    defaultRows: [msg("Retaining wall"), msg("Garden wall")],
    faces: true,
    openings: [],
    on: false,
  },
  {
    id: "extras",
    title: msg("Extras (pillars, porch, columns, planters)"),
    hint: msg("Anything else. If you only know a rough total, use the lump-sum option on a row."),
    defaultRows: [msg("Extras")],
    faces: true,
    openings: [],
    on: false,
  },
];

export interface HouseLayout {
  id: string;
  label: string;
  hint: string;
  /** Group ids switched on by this preset */
  groups: string[];
}

/** Starting points that match how homes are built in each city (see data/cities.ts for which suit where). */
export const houseLayouts: HouseLayout[] = [
  {
    id: "house",
    label: msg("Independent house, all sides open"),
    hint: msg("Front, both sides, back and a boundary wall."),
    groups: ["front", "sides", "back", "boundary"],
  },
  {
    id: "double",
    label: msg("Double storey with mumty"),
    hint: msg("Ground and first floor, mumty, roof boundary and boundary wall."),
    groups: ["front", "sides", "back", "first", "mumty", "parapet", "boundary"],
  },
  {
    id: "portion",
    label: msg("Portion or house with shared side walls"),
    hint: msg("Only the front and upper floors are finished; side walls are shared."),
    groups: ["front", "first", "mumty", "parapet"],
  },
  {
    id: "sloped",
    label: msg("Sloped plot with retaining walls"),
    hint: msg("Front, sides, boundary and retaining or garden walls."),
    groups: ["front", "sides", "boundary", "retaining"],
  },
  {
    id: "boundary",
    label: msg("Boundary wall only"),
    hint: msg("Just the wall around the plot."),
    groups: ["boundary"],
  },
];
