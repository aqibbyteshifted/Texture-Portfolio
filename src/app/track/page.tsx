import type { Metadata } from "next";
import { Circle, CircleCheck, Search } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { WhatsAppIcon } from "@/components/ui/icons";
import { findProject, trackingStages } from "@/data/tracking";
import { site } from "@/data/site";
import { getI18n } from "@/i18n/server";
import { cn } from "@/lib/cn";
import { whatsappLink } from "@/lib/whatsapp";

export const metadata: Metadata = {
  title: "Track Your Project",
  description: "Enter your Zain & Co project code to see which stage your wall texture work has reached.",
  alternates: { canonical: "/track" },
  robots: { index: false, follow: true },
};

const fmt = (iso: string) =>
  new Date(iso).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric", timeZone: "Asia/Karachi" });

export default async function TrackPage({ searchParams }: { searchParams: Promise<{ code?: string }> }) {
  const { t } = await getI18n();
  const { code } = await searchParams;
  const project = findProject(code);
  const searched = Boolean(code?.trim());

  return (
    <div className="container-page max-w-3xl py-12 sm:py-16">
      <SectionHeading
        as="h1"
        eyebrow={t("Help & Tools")}
        title={t("Track Your Project")}
        description={t("Enter the project code from your quotation or warranty card to see which stage your work has reached.")}
      />

      <form method="get" action="/track" role="search" className="mt-8 flex flex-col gap-3 sm:flex-row">
        <label htmlFor="track-code" className="sr-only">{t("Project code")}</label>
        <input
          id="track-code"
          name="code"
          defaultValue={code ?? ""}
          dir="ltr"
          autoComplete="off"
          placeholder="ZC-2026-1234"
          className="h-12 flex-1 rounded-control border border-line-strong bg-surface px-4 text-sm font-semibold tracking-wide text-ink uppercase focus:border-brand-500 focus:shadow-[0_0_0_3px_rgba(154,116,31,0.15)] focus:outline-none"
        />
        <button type="submit" className="inline-flex h-12 items-center justify-center gap-2 rounded-control bg-brand-500 px-6 text-sm font-semibold text-white hover:bg-brand-600">
          <Search aria-hidden="true" className="size-4" /> {t("Check status")}
        </button>
      </form>

      <div className="mt-8" aria-live="polite">
        {project && (
          <section className="rounded-2xl border border-line bg-surface p-5 shadow-card sm:p-7">
            {project.demo && (
              <p className="mb-4 rounded-lg bg-amber-50 px-3 py-2 text-xs font-semibold text-amber-900">{t("Demo project: shown only to illustrate how updates look.")}</p>
            )}
            <dl className="grid gap-4 text-sm sm:grid-cols-2">
              <div><dt className="text-xs font-semibold text-ink-muted uppercase">{t("Client")}</dt><dd className="font-semibold"><bdi>{project.firstName}</bdi></dd></div>
              <div><dt className="text-xs font-semibold text-ink-muted uppercase">{t("Site")}</dt><dd className="font-semibold"><bdi>{project.area}</bdi></dd></div>
              <div><dt className="text-xs font-semibold text-ink-muted uppercase">{t("Finish")}</dt><dd className="font-semibold"><bdi>{project.finish}</bdi></dd></div>
              <div><dt className="text-xs font-semibold text-ink-muted uppercase">{t("Expected handover")}</dt><dd className="font-semibold"><bdi>{fmt(project.eta)}</bdi></dd></div>
            </dl>

            <ol className="mt-6 grid gap-0">
              {trackingStages.map((s, i) => {
                const done = i < project.stage;
                const now = i === project.stage;
                return (
                  <li key={s} className="flex gap-3">
                    <div className="flex flex-col items-center">
                      {done ? (
                        <CircleCheck aria-hidden="true" className="size-6 text-brand-500" />
                      ) : (
                        <Circle aria-hidden="true" className={cn("size-6", now ? "fill-brand-100 text-brand-500" : "text-line-strong")} />
                      )}
                      {i < trackingStages.length - 1 && <span className={cn("my-1 w-0.5 flex-1", done ? "bg-brand-500" : "bg-line-strong")} />}
                    </div>
                    <div className="pb-5">
                      <p className={cn("text-sm font-semibold", now ? "text-ink" : done ? "text-ink-soft" : "text-ink-muted")}>
                        {t(s)} {now && <span className="ms-2 rounded-full bg-brand-50 px-2 py-0.5 text-[11px] font-bold text-brand-600">{t("In progress")}</span>}
                      </p>
                    </div>
                  </li>
                );
              })}
            </ol>
            <p className="text-xs text-ink-muted">{t("Last updated")}: <bdi>{fmt(project.updated)}</bdi></p>
            {project.note && <p className="mt-3 text-sm text-ink-soft"><bdi>{project.note}</bdi></p>}
          </section>
        )}

        {searched && !project && (
          <section className="rounded-2xl border border-line bg-surface p-6 text-center shadow-card">
            <h2 className="text-lg font-bold">{t("We could not find that code")}</h2>
            <p className="mt-2 text-sm text-ink-soft">{t("Check the spelling, or contact the office with your name and site address and we will update you.")}</p>
            <div className="mt-4 flex flex-wrap justify-center gap-2">
              <Button href={whatsappLink("Salam Zain & Co, I would like an update on my project.")} variant="whatsapp" size="sm">
                <WhatsAppIcon className="size-4" /> {t("Ask on WhatsApp")}
              </Button>
              <Button href={`tel:${site.phone.replace(/\s/g, "")}`} variant="secondary" size="sm"><span className="ltr-run">{site.phone}</span></Button>
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
