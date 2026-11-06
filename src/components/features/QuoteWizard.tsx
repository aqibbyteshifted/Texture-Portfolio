"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowLeft, ArrowRight, Check, Send, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Field } from "@/components/ui/Field";
import { WhatsAppIcon } from "@/components/ui/icons";
import { TextureImage } from "@/components/ui/TextureImage";
import { locationOptions } from "@/data/site";
import { findShade, getShades } from "@/data/shades";
import { textures } from "@/data/textures";
import { useLeadSubmit } from "@/hooks/useLeadSubmit";
import { useT } from "@/i18n/client";
import { ADDON_PRICES, calculateEstimate, MAX_AREA_SQFT, type AreaUnit } from "@/lib/pricing";
import { formatNumber, formatPKR } from "@/lib/format";
import { getReferral } from "@/lib/referral";
import { waMessages, whatsappLink } from "@/lib/whatsapp";
import { cn } from "@/lib/cn";
import type { TextureZone } from "@/types";
import { msg } from "@/i18n/config";

const scopes: Record<TextureZone, string[]> = {
  exterior: [
    msg("Exterior Boundary Walls & Main Elevation"),
    msg("Main Villa Elevation Only"),
    msg("Boundary Wall Only"),
    msg("Porch Columns & Pillars"),
    msg("Commercial Facade"),
  ],
  interior: [
    msg("Feature / Accent Wall"),
    msg("Drawing & Dining Rooms"),
    msg("Staircase & Foyer"),
    msg("Full Interior"),
    msg("Floors (Garage / Showroom / Home)"),
  ],
};

const windows = [msg("Morning (10am-1pm)"), msg("Afternoon (1pm-4pm)"), msg("Evening (4pm-7pm)")];
const steps = [msg("Project Scope"), msg("Texture Spec"), msg("Contact & Visit")] as const;
const shortSteps = [msg("Scope"), msg("Texture"), msg("Contact")] as const;
const unitLabel: Record<AreaUnit, string> = { sqft: msg("Sq Ft"), marla: msg("Marla (Wall Est.)"), sqm: msg("Sq Meters") };
const toDateInput = (d: Date) => new Date(d.getTime() - d.getTimezoneOffset() * 60_000).toISOString().slice(0, 10);

const isUnit = (v: string | null): v is AreaUnit => v === "sqft" || v === "marla" || v === "sqm";

export function QuoteWizard() {
  const t = useT();
  const router = useRouter();
  const params = useSearchParams();
  const { error, fieldErrors, submit, submitting } = useLeadSubmit();

  const initial = useMemo(() => {
    const texture = textures.find((x) => x.slug === params.get("texture"));
    const zoneParam = params.get("zone");
    const zone: TextureZone =
      zoneParam === "interior" || zoneParam === "exterior" ? zoneParam : texture && !texture.zones.includes("exterior") ? "interior" : "exterior";
    const unit = params.get("unit");
    const area = Number(params.get("area"));
    return {
      zone,
      unit: isUnit(unit) ? unit : ("sqft" as AreaUnit),
      area: area > 0 ? String(Math.min(area, MAX_AREA_SQFT)) : "",
      texture: texture?.slug ?? "",
      shade: texture && findShade(texture.slug, params.get("shade")) ? (params.get("shade") ?? "") : "",
      location: locationOptions.find((l) => l.value === params.get("loc"))?.value ?? locationOptions[0].value,
    };
  }, [params]);

  const [step, setStep] = useState(0);
  const [zone, setZone] = useState<TextureZone>(initial.zone);
  const [scope, setScope] = useState(scopes[initial.zone][0]);
  const [area, setArea] = useState(initial.area);
  const [unit, setUnit] = useState<AreaUnit>(initial.unit);
  const [location, setLocation] = useState<string>(initial.location);
  const [detail, setDetail] = useState("");
  const [slug, setSlug] = useState(initial.texture);
  const [shadeCode, setShadeCode] = useState(initial.shade);
  const [scaffold, setScaffold] = useState(initial.zone === "exterior");
  const [primer, setPrimer] = useState(true);
  const [stepError, setStepError] = useState<string>();
  const [contact, setContact] = useState({ name: "", phone: "", email: "", date: "", window: windows[1], message: "", hp: "" });
  const today = useMemo(() => toDateInput(new Date()), []);
  const [referral, setReferral] = useState("");
  useEffect(() => {
    setReferral(getReferral() ?? "");
  }, []);

  const available = useMemo(() => textures.filter((x) => x.zones.includes(zone)), [zone]);
  const texture = available.find((x) => x.slug === slug);
  const loc = locationOptions.find((l) => l.value === location) ?? locationOptions[0];
  const shades = texture ? getShades(texture.slug) : [];
  const shade = texture ? findShade(texture.slug, shadeCode) : undefined;

  const estimate = useMemo(
    () =>
      texture
        ? calculateEstimate({ area: Number(area), unit, texture, scaffold: zone === "exterior" && scaffold, primer, surcharge: loc.surcharge })
        : null,
    [area, unit, texture, scaffold, primer, zone, loc.surcharge],
  );

  const changeZone = (next: TextureZone) => {
    setZone(next);
    setScope(scopes[next][0]);
    setScaffold(next === "exterior");
    if (slug && !textures.find((x) => x.slug === slug)?.zones.includes(next)) {
      setSlug("");
      setShadeCode("");
    }
  };

  const pickTexture = (next: string) => {
    setSlug(next);
    if (shadeCode && !findShade(next, shadeCode)) setShadeCode("");
  };

  const setC = (key: keyof typeof contact) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
    setContact((c) => ({ ...c, [key]: e.target.value }));
  const err = (key: string) => (fieldErrors[key] ? t(fieldErrors[key]) : undefined);

  const next = () => {
    setStepError(undefined);
    if (step === 0 && !(Number(area) > 0)) return setStepError(t("Enter your approximate wall area to continue. Not sure? Use 1 Kanal ≈ 3,500 sq ft."));
    if (step === 1 && !texture) return setStepError(t("Pick a texture finish to continue."));
    setStep((s) => Math.min(2, s + 1));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!texture || !estimate) return;
    const lead = await submit({
      type: "quote",
      name: contact.name,
      phone: contact.phone,
      email: contact.email,
      area: detail.trim() ? `${detail.trim()}, ${loc.label}` : loc.label,
      scope,
      texture: texture.name,
      shade: shade ? `${shade.code} – ${shade.name}` : undefined,
      areaSqft: estimate.sqft,
      estimate: estimate.total,
      date: contact.date || undefined,
      window: contact.window,
      message: contact.message,
      referral: referral.trim() || undefined,
      hp: contact.hp,
    });
    if (lead) router.push(`/quote/confirmation?ref=${encodeURIComponent(lead.ref)}`);
  };

  return (
    <div className="grid gap-8 lg:grid-cols-[1.6fr_1fr] lg:items-start">
      <form noValidate onSubmit={onSubmit} className="rounded-2xl border border-line bg-surface p-5 shadow-card sm:p-8">
        <ol className="mb-8 grid grid-cols-3 gap-2" aria-label={t("Progress")}>
          {steps.map((label, i) => (
            <li key={label} aria-current={i === step ? "step" : undefined} className="min-w-0">
              <div className={cn("h-1.5 rounded-full transition-colors", i <= step ? "bg-clay-500" : "bg-line-strong")} />
              <p className={cn("mt-2 flex items-center gap-1.5 text-xs font-semibold", i <= step ? "text-clay-600" : "text-ink-muted")}>
                <span className={cn("grid size-5 shrink-0 place-items-center rounded-full text-[11px]", i < step ? "bg-clay-500 text-white" : i === step ? "bg-clay-100 text-clay-600" : "bg-sunken")}>
                  {i < step ? <Check aria-hidden="true" className="size-3" strokeWidth={3} /> : i + 1}
                </span>
                <span className="truncate">
                  <span className="sm:hidden">{t(shortSteps[i])}</span>
                  <span className="hidden sm:inline">{t(label)}</span>
                </span>
              </p>
            </li>
          ))}
        </ol>

        {step === 0 && (
          <div className="grid gap-6">
            <fieldset>
              <legend className="text-sm font-bold">{t("Where will the finish be applied?")}</legend>
              <div className="mt-3 grid grid-cols-2 gap-3">
                {(["exterior", "interior"] as const).map((z) => (
                  <button
                    key={z}
                    type="button"
                    aria-pressed={zone === z}
                    onClick={() => changeZone(z)}
                    className={cn("rounded-lg border p-4 text-start text-sm font-semibold transition-colors", zone === z ? "border-clay-500 bg-clay-50 text-clay-600 ring-1 ring-clay-500" : "border-line-strong hover:bg-canvas")}
                  >
                    {z === "exterior" ? t("Exterior Facade / Boundary") : t("Interior Rooms / Floors")}
                  </button>
                ))}
              </div>
            </fieldset>

            <Field label={t("Surface Coverage Scope")} as="select" value={scope} onChange={(e) => setScope(e.target.value)} options={scopes[zone].map((s) => ({ value: s, label: t(s) }))} />

            <div className="grid gap-4 sm:grid-cols-[1fr_auto]">
              <Field label={t("Approx. Wall Area")} required type="number" inputMode="decimal" min={0} max={MAX_AREA_SQFT} value={area} onChange={(e) => setArea(e.target.value)} placeholder="e.g. 3500" hint={t("1 Kanal elevation ≈ 3,200 – 4,500 sq ft • 10 Marla ≈ 1,800 – 2,400 sq ft")} />
              <Field label={t("Unit")} as="select" value={unit} onChange={(e) => setUnit(e.target.value as AreaUnit)} options={(Object.keys(unitLabel) as AreaUnit[]).map((u) => ({ value: u, label: t(unitLabel[u]) }))} />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <Field label={t("Site Location")} as="select" value={location} onChange={(e) => setLocation(e.target.value)} options={locationOptions.map((l) => ({ value: l.value, label: t(l.label) }))} />
              <Field label={t("Phase / Block / Street (optional)")} value={detail} onChange={(e) => setDetail(e.target.value)} placeholder={t("e.g. Phase 6, Sector C")} />
            </div>
          </div>
        )}

        {step === 1 && (
          <div className="grid gap-6">
            <fieldset>
              <legend className="text-sm font-bold">{t("Choose your architectural texture")}</legend>
              <div className="mt-3 grid gap-3 sm:grid-cols-2">
                {available.map((x) => (
                  <button
                    key={x.slug}
                    type="button"
                    aria-pressed={slug === x.slug}
                    onClick={() => pickTexture(x.slug)}
                    className={cn("flex items-center gap-3 overflow-hidden rounded-lg border p-2.5 pe-3 text-start transition-colors", slug === x.slug ? "border-clay-500 bg-clay-50 ring-1 ring-clay-500" : "border-line-strong hover:bg-canvas")}
                  >
                    <span className="relative size-16 shrink-0 overflow-hidden rounded-md">
                      <TextureImage src={x.image} alt={x.name} swatch={x.swatch} sizes="64px" />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-sm font-bold">{t(x.name)}</span>
                      <span className="block truncate text-xs text-ink-muted">{t(x.summary)}</span>
                      <span className="mt-0.5 block text-xs font-bold text-clay-600 tnum">PKR {x.rate} / {t("sq ft")}</span>
                    </span>
                  </button>
                ))}
              </div>
            </fieldset>

            {texture && shades.length > 0 && (
              <fieldset>
                <legend className="text-sm font-bold">
                  {t("Preferred shade")} <span className="font-normal text-ink-muted">({t("optional")})</span>
                </legend>
                <div className="mt-3 flex flex-wrap items-center gap-2.5" role="radiogroup" aria-label={t("Shade")}>
                  <button
                    type="button"
                    role="radio"
                    aria-checked={!shade}
                    onClick={() => setShadeCode("")}
                    className={cn("h-10 rounded-full border px-4 text-xs font-semibold", !shade ? "border-clay-500 bg-clay-50 text-clay-600" : "border-line-strong text-ink-soft hover:bg-canvas")}
                  >
                    {t("No preference")}
                  </button>
                  {shades.map((s) => (
                    <button
                      key={s.code}
                      type="button"
                      role="radio"
                      aria-checked={shade?.code === s.code}
                      aria-label={`${s.name} (${s.code})`}
                      title={`${s.name} · ${s.code}`}
                      onClick={() => setShadeCode(s.code)}
                      className={cn("grid size-10 place-items-center rounded-full border-2 transition-transform hover:scale-110", shade?.code === s.code ? "border-clay-500 ring-2 ring-clay-500/30" : "border-white shadow-card")}
                      style={{ backgroundColor: s.hex }}
                    >
                      {shade?.code === s.code && <Check aria-hidden="true" className="size-4 text-white drop-shadow" strokeWidth={3} />}
                    </button>
                  ))}
                </div>
                {shade && (
                  <p className="mt-2 text-xs text-ink-soft">
                    {shade.name} · <span className="ltr-run font-semibold">{shade.code}</span>
                  </p>
                )}
              </fieldset>
            )}

            <fieldset className="grid gap-3">
              <legend className="text-sm font-bold">{t("Preparation add-ons")}</legend>
              {zone === "exterior" && (
                <Check2 checked={scaffold} onChange={setScaffold} label={t("Steel scaffolding & safety staging")} price={`+${formatPKR(ADDON_PRICES.scaffold)}`} />
              )}
              <Check2 checked={primer} onChange={setPrimer} label={t("Deep penetrating primer & hydro-sealer")} price={`+${formatPKR(ADDON_PRICES.primer)}`} />
            </fieldset>

            <div className="flex items-start gap-3 rounded-lg bg-clay-50 p-4 text-sm">
              <ShieldCheck aria-hidden="true" className="mt-0.5 size-5 shrink-0 text-clay-500" />
              <p className="text-ink-soft">
                <strong className="text-ink">{t("Free 1×1 ft sample boards")}</strong> {t("and a laser moisture assessment are included with every site visit, at zero cost.")}
              </p>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="grid gap-5">
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label={t("Full Name")} required autoComplete="name" value={contact.name} onChange={setC("name")} error={err("name")} />
              <Field label={t("WhatsApp / Phone")} required type="tel" inputMode="tel" autoComplete="tel" value={contact.phone} onChange={setC("phone")} error={err("phone")} placeholder="0300 1234567" dir="ltr" />
            </div>
            <Field label={t("Email (optional)")} type="email" autoComplete="email" value={contact.email} onChange={setC("email")} error={err("email")} dir="ltr" />
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label={t("Preferred Site Visit Date")} type="date" min={today} value={contact.date} onChange={setC("date")} />
              <Field label={t("Time Window")} as="select" value={contact.window} onChange={setC("window")} options={windows.map((w) => ({ value: w, label: t(w) }))} />
            </div>
            <Field label={t("Referral code (optional)")} value={referral} onChange={(e) => setReferral(e.target.value)} placeholder={t("If a friend referred you")} dir="ltr" />
            <Field label={t("Notes for our engineer (optional)")} as="textarea" value={contact.message} onChange={setC("message")} placeholder={t("Wall condition, gate/parking access, colour preferences…")} />
            <input tabIndex={-1} autoComplete="off" aria-hidden="true" value={contact.hp} onChange={setC("hp")} name="website" className="absolute -left-[9999px] h-0 w-0 opacity-0" />
          </div>
        )}

        {(stepError || error) && (
          <p role="alert" className="mt-5 rounded-lg bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
            {stepError ?? (error ? t(error) : "")}
          </p>
        )}

        <div className="mt-8 flex items-center justify-between gap-3 border-t border-line pt-5">
          {step > 0 ? (
            <Button variant="secondary" onClick={() => { setStepError(undefined); setStep(step - 1); }}>
              <ArrowLeft aria-hidden="true" className="size-4 rtl:-scale-x-100" /> {t("Back")}
            </Button>
          ) : (
            <span />
          )}
          {step < 2 ? (
            // distinct keys: React must not reuse this element as the submit button, or the very click that
            // advances to step 3 would also submit the (still empty) form.
            <Button key="next" type="button" onClick={next} size="lg">
              {t("Continue")} <ArrowRight aria-hidden="true" className="size-4 rtl:-scale-x-100" />
            </Button>
          ) : (
            <Button key="submit" type="submit" size="lg" disabled={submitting}>
              {submitting ? t("Dispatching…") : t("Dispatch My Request")} <Send aria-hidden="true" className="size-4 rtl:-scale-x-100" />
            </Button>
          )}
        </div>
      </form>

      <aside className="rounded-2xl border border-line bg-surface p-5 shadow-card sm:p-6 lg:sticky lg:top-24" aria-label={t("Quote summary")}>
        <p className="text-xs font-semibold tracking-[0.14em] text-clay-500 uppercase">{t("Live Summary")}</p>
        <dl className="mt-4 grid gap-3 text-sm">
          <Line label={t("Environment")} value={zone === "exterior" ? t("Exterior") : t("Interior")} />
          <Line label={t("Scope")} value={t(scope)} />
          <Line label={t("Area")} value={estimate && estimate.sqft > 0 ? `${formatNumber(estimate.sqft)} ${t("sq ft")}` : Number(area) > 0 ? "…" : t("Not set")} />
          <Line label={t("Location")} value={t(loc.label)} />
          <Line label={t("Texture")} value={texture ? t(texture.name) : t("Not selected")} />
          {shade && <Line label={t("Shade")} value={`${shade.name} (${shade.code})`} />}
        </dl>
        <div className="mt-5 rounded-lg bg-ink p-4 text-white" aria-live="polite">
          <p className="text-[11px] font-semibold tracking-wider text-sand-500 uppercase">{t("Estimated Investment")}</p>
          <p className="font-display mt-1 text-2xl font-extrabold tnum" dir="ltr">{estimate && estimate.total > 0 ? formatPKR(estimate.total) : "PKR —"}</p>
          {estimate && estimate.total > 0 && (
            <p className="mt-1 text-xs text-white/60 tnum" dir="ltr">
              {formatPKR(estimate.low)} – {formatPKR(estimate.high)}
            </p>
          )}
        </div>
        <p className="mt-3 text-[11px] leading-snug text-ink-muted">{t("Final price confirmed after free laser survey and moisture check.")}</p>
        <Button href={whatsappLink(waMessages.start)} variant="whatsapp" className="mt-4 w-full">
          <WhatsAppIcon className="size-4" /> {t("Prefer WhatsApp? Chat now")}
        </Button>
      </aside>
    </div>
  );
}

function Line({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-4 border-b border-line pb-2.5 last:border-0 last:pb-0">
      <dt className="text-ink-muted">{label}</dt>
      <dd className="text-end font-semibold text-ink">{value}</dd>
    </div>
  );
}

function Check2({ checked, onChange, label, price }: { checked: boolean; onChange: (v: boolean) => void; label: string; price: string }) {
  return (
    <label className={cn("flex cursor-pointer items-center gap-3 rounded-lg border p-3.5", checked ? "border-clay-500 bg-clay-50" : "border-line-strong hover:bg-canvas")}>
      <input type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} className="peer sr-only" />
      <span aria-hidden="true" className="grid size-5 shrink-0 place-items-center rounded border border-line-strong bg-surface text-white peer-checked:border-clay-500 peer-checked:bg-clay-500 peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-sand-500">
        {checked && <Check className="size-3.5" strokeWidth={3} />}
      </span>
      <span className="flex-1 text-sm font-semibold">{label}</span>
      <span className="text-sm font-bold text-clay-600 tnum" dir="ltr">{price}</span>
    </label>
  );
}
