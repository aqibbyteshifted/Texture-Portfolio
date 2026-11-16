import type { Metadata } from "next";
import { HelpTools } from "@/components/sections/HelpTools";

export const metadata: Metadata = {
  title: "Help & Tools",
  description: "Free tools from Zain & Co: wall problem checker, finish finder, area measurer, pre-work checklist and project tracker.",
  alternates: { canonical: "/help" },
};

export default function HelpPage() {
  return <HelpTools asPage />;
}
