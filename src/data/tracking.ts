/**
 * Project status shown on /track. There is no database: when a project starts, add an entry here
 * (or load it from your own API later) and update `stage` and `updated` as work progresses.
 * Give each client a hard-to-guess code, and show only their first name.
 *
 * "ZC-DEMO" is an example entry so the page can be tried. Delete it before launch.
 */
export const trackingStages = [
  "Site survey and quotation",
  "Surface preparation",
  "Primer and base coat",
  "Texture and final finish",
  "Sealing and curing",
  "Handover and warranty card",
] as const;

export interface TrackedProject {
  code: string;
  firstName: string;
  area: string;
  finish: string;
  /** Index into trackingStages of the stage being worked on now */
  stage: number;
  /** Date of the latest update, ISO format */
  updated: string;
  /** Expected handover, ISO format */
  eta: string;
  note?: string;
  demo?: boolean;
}

export const trackedProjects: TrackedProject[] = [
  {
    code: "ZC-DEMO",
    firstName: "Sample client",
    area: "DHA Phase 5, Lahore",
    finish: "Rockwall Aggregates",
    stage: 2,
    updated: "2026-11-14",
    eta: "2026-11-24",
    note: "This is a demo entry that shows how project updates look.",
    demo: true,
  },
];

export function findProject(code: string | undefined) {
  if (!code) return undefined;
  const c = code.trim().toUpperCase();
  return trackedProjects.find((p) => p.code === c);
}
