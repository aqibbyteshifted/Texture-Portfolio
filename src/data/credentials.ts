import { site } from "@/data/site";

export interface Credential {
  id: string;
  icon: "shield" | "badge" | "award";
  title: string;
  detail: string;
  description: string;
  /** Path to a scanned certificate in /public (e.g. "/images/pec-certificate.jpg"). Shown as a preview when set. */
  document?: string;
}

/** Add `document: "/images/<scan>.jpg"` to show the actual certificate scan next to each card. */
export const credentials: Credential[] = [
  {
    id: "pec",
    icon: "shield",
    title: "PEC Registered Contractor",
    detail: `Registration #${site.pec}`,
    description: "Registered with the Pakistan Engineering Council as a surface finishing contractor.",
  },
  {
    id: "dha",
    icon: "badge",
    title: "DHA Approved Contractor",
    detail: "Approved for DHA Lahore projects",
    description: "Approved to execute facade and boundary-wall finishing inside DHA Lahore phases.",
  },
  {
    id: "warranty",
    icon: "award",
    title: "3-Year Written Warranty",
    detail: "Stamped warranty card on every project",
    description: "Covers flaking, debonding, hollow spots and UV colour fading, with a 48-hour repair response.",
  },
];

export const warrantyCoverage = [
  "Flaking, peeling and debonding",
  "Micro-cracking and hollow spots",
  "UV colour fading",
  "Complimentary annual touch-up audit",
] as const;
