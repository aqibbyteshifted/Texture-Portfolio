export interface TeamMember {
  id: string;
  name: string;
  role: string;
  bio: string;
  /** Optional portrait in /public. Without it, initials are shown. */
  photo?: string;
  highlight?: string;
}

/**
 * PLACEHOLDER TEAM: only the names and roles already mentioned in the original designs and reviews
 * ("Lead Engineer Akib", "Zain and his team") are used. Replace with your real team, bios and photos.
 * Leave the array empty to hide the section.
 */
export const team: TeamMember[] = [
  {
    id: "zain",
    name: "Zain",
    role: "Founder & Master Craftsman",
    bio: "Oversees every project from first sample board to final handover and trains the in-house karigar crew.",
    highlight: "10+ years of masonry & texture work",
  },
  {
    id: "akib",
    name: "Akib",
    role: "Lead Site Engineer",
    bio: "Runs the laser measurement, moisture checks and sample-board visits, and sends daily WhatsApp site updates.",
    highlight: "Free site survey across Lahore",
  },
  {
    id: "crew",
    name: "The Karigar Crew",
    role: "Master Karigars",
    bio: "Seasoned in-house craftsmen who hand-trowel every wall. No day-labourers on your finished surfaces.",
    highlight: "100% in-house trained",
  },
];
