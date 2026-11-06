"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  ArrowLeft,
  Calendar,
  Check,
  CircleCheck,
  ClipboardCheck,
  Clock,
  Copy,
  Download,
  Hammer,
  Headset,
  Layers,
  MapPin,
  Palette,
  Phone,
  Send,
  ShieldCheck,
  Store,
  Zap,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { PaymentPolicy } from "@/components/features/PaymentPolicy";
import { WhatsAppIcon } from "@/components/ui/icons";
import { LAST_LEAD_KEY } from "@/hooks/useLeadSubmit";
import { site } from "@/data/site";
import { useT } from "@/i18n/client";
import { formatDate, formatPKR } from "@/lib/format";
import { quoteHref } from "@/lib/quoteLink";
import { waMessages, whatsappLink } from "@/lib/whatsapp";
import type { LeadRecord } from "@/types";
import { msg } from "@/i18n/config";

const nextSteps = [
  { n: 1, title: msg("Immediate Call"), tag: msg("< 2 Hours Response"), text: msg("Our lead site planner calls to review architectural facade blueprints, wall substrate conditions, and confirm parking/gate access.") },
  { n: 2, title: msg("Site Inspection"), tag: msg("Physical Mockups"), text: msg("Site engineer brings calibrated laser meters, performs wall moisture checks, and holds 1x1 ft sample boards directly against your facade.") },
  { n: 3, title: msg("Itemized Quote"), tag: msg("Fixed Price Guarantees"), text: msg("Receive a comprehensive, per-square-foot proposal covering materials, specialized labor, weather-proof basecoats, and 3-year warranty.") },
] as const;

export function ConfirmationView() {
  const t = useT();
  const ref = useSearchParams().get("ref");
  const [lead, setLead] = useState<LeadRecord | null>(null);
  const [ready, setReady] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    try {
      const raw = sessionStorage.getItem(LAST_LEAD_KEY);
      const parsed = raw ? (JSON.parse(raw) as LeadRecord) : null;
      if (parsed && (!ref || parsed.ref === ref)) setLead(parsed);
    } catch {
      /* ignore */
    }
    setReady(true);
  }, [ref]);

  const reference = lead?.ref ?? ref ?? "";
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(`#${reference}`);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* clipboard blocked */
    }
  };

  if (!ready) return <div className="container-page py-32" aria-busy="true" />;

  if (!reference) {
    return (
      <div className="container-page max-w-xl py-24 text-center">
        <ClipboardCheck aria-hidden="true" className="mx-auto size-12 text-clay-500" />
        <h1 className="mt-4 text-3xl font-bold">{t("No recent request found")}</h1>
        <p className="mt-3 text-ink-soft">{t("Start a free quote request and we'll confirm it here with a reference number.")}</p>
        <Button href={quoteHref()} size="lg" className="mt-6">
          {t("Request Free Estimate")}
        </Button>
      </div>
    );
  }

  const waRef = whatsappLink(waMessages.quoteRef(reference, lead?.name ?? "", lead?.area ?? ""));
  const firstName = lead?.name.split(" ")[0];

  return (
    <div className="bg-[radial-gradient(60rem_30rem_at_90%_-10%,rgba(253,186,116,0.2),transparent)]">
      <div className="container-page max-w-5xl py-8 sm:py-12">
        <ol className="no-print mb-6 flex flex-wrap items-center justify-between gap-3 text-xs font-medium text-ink-muted" aria-label={t("Progress")}>
          <li className="flex items-center gap-2">
            <Link href="/" className="hover:text-clay-600">{t("Home")}</Link> / <span>{t("Quote Request")}</span> /{" "}
            <span aria-current="page" className="font-semibold text-clay-600">{t("Confirmation")}</span>
          </li>
          <li className="flex items-center gap-2">
            {[msg("Project Scope"), msg("Texture Spec")].map((s, i) => (
              <span key={s} className="flex items-center gap-1.5">
                <span className="grid size-5 place-items-center rounded-full bg-clay-100 text-[11px] text-clay-600">{i + 1}</span> {t(s)} <span className="text-line-strong">—</span>
              </span>
            ))}
            <span className="flex items-center gap-1.5 font-semibold text-ink">
              <span className="grid size-5 place-items-center rounded-full bg-clay-500 text-white"><Check aria-hidden="true" className="size-3" strokeWidth={3} /></span> {t("Dispatched")}
            </span>
          </li>
        </ol>

        <section className="overflow-hidden rounded-2xl border border-line bg-surface p-6 shadow-lift sm:p-9">
          <div className="flex flex-col items-start gap-6 sm:flex-row sm:items-center">
            <div className="relative grid size-20 shrink-0 place-items-center rounded-full bg-clay-100 sm:size-24">
              <span className="grid size-14 place-items-center rounded-full bg-clay-500 text-white sm:size-16">
                <Check aria-hidden="true" className="size-8" strokeWidth={3} />
              </span>
              <span className="absolute -end-0.5 -bottom-0.5 grid size-7 place-items-center rounded-full bg-whatsapp text-white ring-4 ring-surface">
                <Zap aria-hidden="true" className="size-3.5" />
              </span>
            </div>
            <div>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-clay-100 px-3 py-1 text-[11px] font-bold tracking-wider text-clay-600 uppercase">
                <span className="size-1.5 rounded-full bg-clay-500" /> {t("Site Engineer Notification Queued")}
              </span>
              <h1 className="mt-3 text-2xl font-extrabold sm:text-4xl">
                {firstName ? t("Thank You, {name}! Your Request Has Been Dispatched", { name: firstName }) : t("Thank You! Your Request Has Been Dispatched")}
              </h1>
              <p className="mt-2 max-w-2xl text-ink-soft">
                {t("Our Senior Surface Engineer will contact you within 2 hours to confirm site measurements, verify elevation geometry, and coordinate complimentary physical 1x1 ft sample boards.")}
              </p>
            </div>
          </div>

          <dl className="mt-7 grid gap-4 rounded-xl bg-sunken p-5 sm:grid-cols-3">
            <div>
              <dt className="text-[11px] font-semibold tracking-wider text-ink-muted uppercase">{t("Quote Reference")}</dt>
              <dd className="mt-1 flex items-center gap-2 text-lg font-extrabold tnum">
                <span className="ltr-run">#{reference}</span>
                <button type="button" onClick={copy} className="no-print flex items-center gap-1 text-xs font-medium text-clay-600 hover:text-clay-700" aria-label={t("Copy reference number")}>
                  {copied ? <Check aria-hidden="true" className="size-3.5" /> : <Copy aria-hidden="true" className="size-3.5" />} {copied ? t("copied") : t("copy")}
                </button>
              </dd>
            </div>
            <div>
              <dt className="text-[11px] font-semibold tracking-wider text-ink-muted uppercase">{t("Submission Timestamp")}</dt>
              <dd className="mt-1 flex items-center gap-1.5 font-semibold">
                <Clock aria-hidden="true" className="size-4 text-ink-muted" />
                <span className="ltr-run">{lead ? formatDate(lead.createdAt, { dateStyle: "medium", timeStyle: "short" }) + " PKT" : t("Just now")}</span>
              </dd>
            </div>
            <div>
              <dt className="text-[11px] font-semibold tracking-wider text-ink-muted uppercase">{t("Assigned Operational Desk")}</dt>
              <dd className="mt-1 flex items-center gap-1.5 font-semibold">
                <MapPin aria-hidden="true" className="size-4 text-clay-500" /> {t("Lahore DHA & Gulberg Zone")}
              </dd>
            </div>
          </dl>
        </section>

        <div className="mt-6 grid gap-6 lg:grid-cols-[1.6fr_1fr]">
          <div className="grid gap-6">
            <section className="rounded-2xl border border-line bg-surface p-6 shadow-card sm:p-8">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-xs font-semibold tracking-[0.14em] text-clay-500 uppercase">{t("Submission Spec")}</p>
                  <h2 className="mt-1 text-2xl font-bold">{t("Itemized Request Summary")}</h2>
                </div>
                <span className="flex items-center gap-1.5 rounded-full bg-clay-100 px-3 py-1.5 text-xs font-bold text-clay-600">
                  <CircleCheck aria-hidden="true" className="size-3.5" /> {t("Verified Lead")}
                </span>
              </div>

              {lead ? (
                <div className="mt-6 grid gap-3">
                  <div className="grid gap-3 sm:grid-cols-2">
                    <Cell label={t("Client Name")} value={lead.name} />
                    <Cell label={t("Direct Contact")} value={lead.phone} ltr icon={<Phone aria-hidden="true" className="size-3.5 text-emerald-500" />} />
                  </div>
                  {lead.area && <Cell label={t("Site Location & Sub-Division")} value={lead.area} icon={<MapPin aria-hidden="true" className="size-4 text-clay-500" />} />}
                  <div className="grid gap-3 sm:grid-cols-2">
                    {lead.scope && <Cell label={t("Surface Coverage Scope")} value={t(lead.scope)} sub={lead.areaSqft ? `${t("Est.")} ${lead.areaSqft.toLocaleString("en-PK")} ${t("sq ft")}` : undefined} />}
                    {lead.texture && <Cell label={t("Selected Architectural Texture")} value={t(lead.texture)} accent />}
                  </div>
                  {lead.shade && <Cell label={t("Preferred Shade")} value={lead.shade} icon={<Palette aria-hidden="true" className="size-4 text-clay-500" />} />}
                  {lead.estimate ? <Cell label={t("Estimated Investment")} value={formatPKR(lead.estimate)} ltr sub={t("Final price confirmed after free site survey")} /> : null}
                  <div className="flex items-start gap-3 rounded-xl bg-clay-50 p-4">
                    <Layers aria-hidden="true" className="mt-0.5 size-5 shrink-0 text-clay-500" />
                    <div className="flex-1">
                      <p className="font-bold">{t("Requested Free Physical Samples")}</p>
                      <p className="text-sm text-ink-soft">{t("2x Hand-crafted 1×1 ft Sample Boards + Calibrated Laser Moisture Assessment")}</p>
                    </div>
                    <span className="rounded-full bg-surface px-2.5 py-1 text-[10px] font-bold text-clay-600 uppercase">{t("Included • PKR 0")}</span>
                  </div>
                  {(lead.date || lead.window) && (
                    <div className="flex flex-wrap items-center justify-between gap-2 rounded-xl bg-sunken p-4 text-sm">
                      <span className="text-[11px] font-semibold tracking-wider text-ink-muted uppercase">{t("Requested Site Window")}</span>
                      <span className="flex items-center gap-2 font-semibold">
                        <Calendar aria-hidden="true" className="size-4 text-clay-500" />
                        {[lead.date && formatDate(lead.date, { dateStyle: "medium" }), lead.window && t(lead.window)].filter(Boolean).join(" • ")}
                      </span>
                    </div>
                  )}
                </div>
              ) : (
                <p className="mt-6 rounded-xl bg-sunken p-4 text-sm text-ink-soft">
                  {t("Your request is recorded. Open this page on the same device you submitted from to see the full itemized summary.")}{" "}
                  <strong className="ltr-run">#{reference}</strong>
                </p>
              )}

              <button type="button" onClick={() => window.print()} className="no-print mt-5 flex items-center gap-2 text-sm font-semibold text-clay-600 hover:text-clay-700">
                <Download aria-hidden="true" className="size-4" /> {t("Download Summary Copy (PDF Specification Slip)")}
              </button>
              <p className="mt-1 text-xs text-ink-muted">
                {t("Ref ID logged in CRM")} <span className="ltr-run">#{reference.replace("ZC-", "ZC-LEAD-")}</span>
              </p>
            </section>

            <section className="rounded-2xl border border-line bg-surface p-6 shadow-card sm:p-8">
              <p className="text-xs font-semibold tracking-[0.14em] text-clay-500 uppercase">{t("Engineering Workflow")}</p>
              <h2 className="mt-1 text-2xl font-bold">{t("What Happens Next?")}</h2>
              <p className="mt-1 text-sm text-ink-soft">{t("Transparent milestones from physical inspection to precision execution.")}</p>
              <ol className="mt-6 grid gap-4 sm:grid-cols-3">
                {nextSteps.map((s) => (
                  <li key={s.n} className="rounded-xl bg-sunken p-4">
                    <span className={`grid size-8 place-items-center rounded-full text-sm font-bold text-white ${s.n === 3 ? "bg-ink" : "bg-clay-500"}`}>{s.n}</span>
                    <h3 className="mt-3 text-lg font-bold">{t(s.title)}</h3>
                    <p className="text-[11px] font-bold tracking-wider text-clay-600 uppercase">{t(s.tag)}</p>
                    <p className="mt-2 text-[13px] leading-relaxed text-ink-soft">{t(s.text)}</p>
                  </li>
                ))}
              </ol>
            </section>
          </div>

          <div className="no-print grid content-start gap-6">
            <section className="rounded-2xl border border-line bg-surface p-6 shadow-card">
              <div className="flex items-center gap-3">
                <span className="grid size-11 place-items-center rounded-lg bg-whatsapp text-white"><WhatsAppIcon className="size-6" /></span>
                <div>
                  <h2 className="text-lg font-bold">{t("Instant Project Dispatch")}</h2>
                  <p className="text-xs text-ink-muted">{t("Lead Engineer Akib is Online")}</p>
                </div>
              </div>
              <p className="mt-4 text-sm leading-relaxed text-ink-soft">
                {t("Want faster confirmation? Share your elevation sketches, house photos, or AutoCAD layouts directly via WhatsApp with your quote reference.")}{" "}
                <strong className="ltr-run text-clay-600">#{reference}</strong>
              </p>
              <Button href={waRef} variant="whatsapp" size="lg" className="mt-4 w-full">
                <WhatsAppIcon className="size-5" /> {t("Chat on WhatsApp Instantly")}
              </Button>
              <Button href="/textures" variant="secondary" className="mt-3 w-full">
                <ArrowLeft aria-hidden="true" className="size-4 rtl:-scale-x-100" /> {t("Back to Showcase Catalog")}
              </Button>
            </section>

            <section className="overflow-hidden rounded-2xl border border-line bg-surface shadow-card">
              <div className="relative aspect-[16/9]">
                <Image src="/images/bg-c-1.jpg" alt={t("DHA Phase 6 villa exterior finished in rockwall and travertine")} fill sizes="(min-width: 1024px) 340px, 100vw" className="object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/75 to-transparent" />
                <div className="absolute start-4 bottom-3 text-white">
                  <p className="text-[10px] font-bold tracking-wider text-sand-300 uppercase">{t("Reference Execution")}</p>
                  <p className="text-lg font-bold">{t("DHA Phase 6 Villa Exterior")}</p>
                </div>
              </div>
              <div className="p-5 text-sm text-ink-soft">
                <div className="flex justify-between text-xs"><span>{t("Contractor: Zain & Co Group")}</span><span>{t("Completed: Jan 2025")}</span></div>
                <p className="mt-3 leading-relaxed">{t("Your site will receive the same architectural grade binders, anti-fungal silicon primer, and UV-stable natural aggregates.")}</p>
                <p className="mt-3 flex items-center gap-1.5 text-xs font-bold text-clay-600"><ShieldCheck aria-hidden="true" className="size-4" /> {t("3-Year Written Warranty Backed")}</p>
              </div>
            </section>

            <PaymentPolicy compact />

            <section className="rounded-2xl border border-line bg-sunken p-5 text-sm">
              <p className="flex items-center gap-2 text-xs font-bold tracking-wider text-clay-600 uppercase"><Store aria-hidden="true" className="size-4" /> {t("Visit Lahore Experience Studio")}</p>
              <p className="mt-2 text-ink-soft">{t("Want to see 50+ monolithic wall textures in person under balanced architectural lighting?")}</p>
              <p className="mt-3 font-bold">{site.studio.name}</p>
              <p className="text-ink-soft"><bdi>{site.studio.address}</bdi></p>
              <p className="mt-1 text-xs text-ink-muted">{t(site.studio.hours)}</p>
            </section>
          </div>
        </div>

        <section className="no-print mt-6 flex flex-col items-start justify-between gap-5 rounded-2xl bg-sunken p-6 lg:flex-row lg:items-center">
          <div className="flex items-center gap-4">
            <span className="grid size-12 shrink-0 place-items-center rounded-full bg-clay-500 text-white"><Headset aria-hidden="true" className="size-6" /></span>
            <div>
              <h2 className="text-lg font-bold">{t("Need immediate scheduling adjustments?")}</h2>
              <p className="text-sm text-ink-soft">
                {t("Reach Project Manager directly at")} <strong className="ltr-run text-clay-600">{site.phone}</strong> {t("or email")}{" "}
                <a href={`mailto:${site.email}`} className="ltr-run font-semibold text-clay-600">{site.email}</a>
              </p>
            </div>
          </div>
          <div className="grid w-full gap-3 sm:w-auto sm:grid-cols-2">
            <Button href={`tel:${site.phone.replace(/\s/g, "")}`} variant="secondary" size="lg"><Phone aria-hidden="true" className="size-4" /> {t("Call Lead Desk")}</Button>
            <Button href={whatsappLink(waMessages.followUp(reference))} size="lg">{t("Send Direct Ping")} <Send aria-hidden="true" className="size-4 rtl:-scale-x-100" /></Button>
          </div>
        </section>
      </div>
    </div>
  );
}

function Cell({ label, value, sub, icon, accent, ltr }: { label: string; value: string; sub?: string; icon?: React.ReactNode; accent?: boolean; ltr?: boolean }) {
  return (
    <div className="rounded-xl bg-sunken p-4">
      <p className="text-[11px] font-semibold tracking-wider text-ink-muted uppercase">{label}</p>
      <p className={`mt-1 flex items-center gap-2 font-bold ${accent ? "text-clay-600" : "text-ink"}`}>
        {accent ? <Hammer aria-hidden="true" className="size-4" /> : null}
        {icon}
        <span className={ltr ? "ltr-run" : undefined}>{value}</span>
      </p>
      {sub && <p className="mt-0.5 text-xs text-ink-muted">{sub}</p>}
    </div>
  );
}
