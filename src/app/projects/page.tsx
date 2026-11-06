import type { Metadata } from "next";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ProjectGrid } from "@/components/features/ProjectGrid";
import { allProjects } from "@/data/projects";
import { getI18n } from "@/i18n/server";

export const metadata: Metadata = {
  title: "Our Projects: Facades, Boundary Walls & Interiors in Lahore",
  description:
    "Completed wall texture, facade and interior finishing projects by Zain & Co across DHA, Bahria Town, Gulberg, Model Town, Johar Town and WAPDA Town.",
  alternates: { canonical: "/projects" },
};

export default async function ProjectsPage() {
  const { t } = await getI18n();
  return (
    <div className="container-page py-12 sm:py-16">
      <SectionHeading
        as="h1"
        eyebrow={t("Execution Portfolio")}
        title={t("Our Projects")}
        description={t("Completed facades, boundary walls and interiors across Lahore. Open any project for its finishes, scope and a quote for a similar wall.")}
      />
      <div className="mt-10">
        <ProjectGrid projects={allProjects} filterBy="sector" />
      </div>
    </div>
  );
}
