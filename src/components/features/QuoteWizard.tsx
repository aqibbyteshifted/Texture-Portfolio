"use client";

import { useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowLeft, ArrowRight, Check, Send, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Field } from "@/components/ui/Field";
import { WhatsAppIcon } from "@/components/ui/icons";
import { TextureImage } from "@/components/ui/TextureImage";
import { locationOptions } from "@/data/site";
import { textures } from "@/data/textures";
import { useLeadSubmit } from "@/hooks/useLeadSubmit";
import { ADDON_PRICES, calculateEstimate, MAX_AREA_SQFT, UNIT_LABEL, type AreaUnit } from "@/lib/pricing";
import { formatNumber, formatPKR } from "@/lib/format";
import { waMessages, whatsappLink } from "@/lib/whatsapp";
import { cn } from "@/lib/cn";
import type { TextureZone } from "@/types";

const scopes: Record<TextureZone, string[]> = {
  exterior: [
    "Exterior Boundary Walls & Main Elevation",
    "Main Villa Elevation Only",
    "Boundary Wall Only",
    "Porch Columns & Pillars",
    "Commercial Facade",
  ],
  interior: ["Feature / Accent Wall", "Drawing & Dining Rooms", "Staircase & Foyer", "Full Interior"],
};

const windows = ["Morning (10am-1pm)", "Afternoon (1pm-4pm)", "Evening (4pm-7pm)"];
const steps = ["Project Scope", "Texture Spec", "Contact & Visit"] as const;
const shortSteps = ["Scope", "Texture", "Contact"] as const;
const toDateInput = (d: Date) => new Date(d.getTime() - d.getTimezoneOffset() * 60_000).toISOString().slice(0, 10);

const isUnit = (v: string | null): v is AreaUnit => v === "sqft" || v === "marla" || v === "sqm";

export function QuoteWizard() {
  const router = useRouter();
  const params = useSearchParams();
  const { error, fieldErrors, submit, submitting } = useLeadSubmit();

  const initial = useMemo(() => {
    const texture = textures.find((t) => t.slug === params.get("texture"));
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
  const [scaffold, setScaffold] = useState(initial.zone === "exterior");
  const [primer, setPrimer] = useState(true);
  const [stepError, setStepError] = useState<string>();
  const [contact, setContact] = useState({ name: "", phone: "", email: "", date: "", window: windows[1], message: "", hp: "" });
  const today = useMemo(() => toDateInput(new Date()), []);

  const available = useMemo(() => textures.filter((t) => t.zones.includes(zone)), [zone]);
  const texture = available.find((t) => t.slug === slug);
  const loc = locationOptions.find((l) => l.value === location) ?? locationOptions[0];

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
    if (slug && !textures.find((t) => t.slug === slug)?.zones.includes(next)) setSlug("");
  };

  const setC = (key: keyof typeof contact) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
    setContact((c) => ({ ...c, [key]: e.target.value }));

  const next = () => {
    setStepError(undefined);
    if (step === 0 && !(Number(area) > 0)) return setStepError("Enter your approximate wall area to continue. Not sure? Use 1 Kanal ≈ 3,500 sq ft.");
    if (step === 1 && !texture) return setStepError("Pick a texture finish to continue.");
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
      areaSqft: estimate.sqft,
      estimate: estimate.total,
      date: contact.date || undefined,
      window: contact.window,
      message: contact.message,
      hp: contact.hp,
    });
    if (lead) router.push(`/quote/confirmation?ref=${encodeURIComponent(lead.ref)}`);
  };

  const input = "h-11";
  return (
    <div className="grid gap-8 lg:grid-cols-[1.6fr_1fr] lg:items-start">
      <form noValidate onSubmit={onSubmit} className="rounded-2xl border border-line bg-surface p-5 shadow-card sm:p-8">
        <ol className="mb-8 grid grid-cols-3 gap-2" aria-label="Progress">
          {steps.map((label, i) => (
            <li key={label} aria-current={i === step ? "step" : undefined} className="min-w-0">
              <div className={cn("h-1.5 rounded-full transition-colors", i <= step ? "bg-clay-500" : "bg-line-strong")} />
              <p className={cn("mt-2 flex items-center gap-1.5 text-xs font-semibold", i <= step ? "text-clay-600" : "text-ink-muted")}>
                <span className={cn("grid size-5 shrink-0 place-items-center rounded-full text-[11px]", i < step ? "bg-clay-500 text-white" : i === step ? "bg-clay-100 text-clay-600" : "bg-sunken")}>
                  {i < step ? <Check aria-hidden="true" className="size-3" strokeWidth={3} /> : i + 1}
                </span>
                <span className="truncate">
                  <span className="sm:hidden">{shortSteps[i]}</span>
                  <span className="hidden sm:inline">{label}</span>
                </span>
              </p>
            </li>
          ))}
        </ol>

        {step === 0 && (
          <div className="grid gap-6">
            <fieldset>
              <legend className="text-sm font-bold">Where will the finish be applied?</legend>
              <div className="mt-3 grid grid-cols-2 gap-3">
                {(["exterior", "interior"] as const).map((z) => (
                  <button
                    key={z}
                    type="button"
                    aria-pressed={zone === z}
                    onClick={() => changeZone(z)}
                    className={cn("rounded-lg border p-4 text-left text-sm font-semibold capitalize transition-colors", zone === z ? "border-clay-500 bg-clay-50 text-clay-600 ring-1 ring-clay-500" : "border-line-strong hover:bg-canvas")}
                  >
                    {z} {z === "exterior" ? "Facade / Boundary" : "Rooms / Accent"}
                  </button>
                ))}
              </div>
            </fieldset>

            <Field label="Surface Coverage Scope" as="select" value={scope} onChange={(e) => setScope(e.target.value)} options={scopes[zone].map((s) => ({ value: s, label: s }))} />

            <div className="grid gap-4 sm:grid-cols-[1fr_auto]">
              <Field label="Approx. Wall Area" required type="number" inputMode="decimal" min={0} max={MAX_AREA_SQFT} value={area} onChange={(e) => setArea(e.target.value)} placeholder="e.g. 3500" hint="1 Kanal elevation ≈ 3,200 – 4,500 sq ft • 10 Marla ≈ 1,800 – 2,400 sq ft" />
              <Field label="Unit" as="select" value={unit} onChange={(e) => setUnit(e.target.value as AreaUnit)} options={(Object.keys(UNIT_LABEL) as AreaUnit[]).map((u) => ({ value: u, label: UNIT_LABEL[u] }))} />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Site Location" as="select" value={location} onChange={(e) => setLocation(e.target.value)} options={locationOptions.map((l) => ({ value: l.value, label: l.label }))} />
              <Field label="Phase / Block / Street (optional)" value={detail} onChange={(e) => setDetail(e.target.value)} placeholder="e.g. Phase 6, Sector C" className={input && undefined} />
            </div>
          </div>
        )}

        {step === 1 && (
          <div className="grid gap-6">
            <fieldset>
              <legend className="text-sm font-bold">Choose your architectural texture</legend>
              <div className="mt-3 grid gap-3 sm:grid-cols-2">
                {available.map((t) => (
                  <button
                    key={t.slug}
                    type="button"
                    aria-pressed={slug === t.slug}
                    onClick={() => setSlug(t.slug)}
                    className={cn("flex items-center gap-3 overflow-hidden rounded-lg border p-2.5 pr-3 text-left transition-colors", slug === t.slug ? "border-clay-500 bg-clay-50 ring-1 ring-clay-500" : "border-line-strong hover:bg-canvas")}
                  >
                    <span className="relative size-16 shrink-0 overflow-hidden rounded-md">
                      <TextureImage src={t.image} alt={t.name} swatch={t.swatch} sizes="64px" />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-sm font-bold">{t.name}</span>
                      <span className="block truncate text-xs text-ink-muted">{t.summary}</span>
                      <span className="mt-0.5 block text-xs font-bold text-clay-600 tnum">PKR {t.rate} / sq ft</span>
                    </span>
                  </button>
                ))}
              </div>
            </fieldset>

            <fieldset className="grid gap-3">
              <legend className="text-sm font-bold">Preparation add-ons</legend>
              {zone === "exterior" && (
                <Check2 checked={scaffold} onChange={setScaffold} label="Steel scaffolding & safety staging" price={`+${formatPKR(ADDON_PRICES.scaffold)}`} />
              )}
              <Check2 checked={primer} onChange={setPrimer} label="Deep penetrating primer & hydro-sealer" price={`+${formatPKR(ADDON_PRICES.primer)}`} />
            </fieldset>

            <div className="flex items-start gap-3 rounded-lg bg-clay-50 p-4 text-sm">
              <ShieldCheck aria-hidden="true" className="mt-0.5 size-5 shrink-0 text-clay-500" />
              <p className="text-ink-soft">
                <strong className="text-ink">Free 1×1 ft sample boards</strong> and a laser moisture assessment are included with every site visit, at zero cost.
              </p>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="grid gap-5">
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Full Name" required autoComplete="name" value={contact.name} onChange={setC("name")} error={fieldErrors.name} />
              <Field label="WhatsApp / Phone" required type="tel" inputMode="tel" autoComplete="tel" value={contact.phone} onChange={setC("phone")} error={fieldErrors.phone} placeholder="0300 1234567" />
            </div>
            <Field label="Email (optional)" type="email" autoComplete="email" value={contact.email} onChange={setC("email")} error={fieldErrors.email} />
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Preferred Site Visit Date" type="date" min={today} value={contact.date} onChange={setC("date")} />
              <Field label="Time Window" as="select" value={contact.window} onChange={setC("window")} options={windows.map((w) => ({ value: w, label: w }))} />
            </div>
            <Field label="Notes for our engineer (optional)" as="textarea" value={contact.message} onChange={setC("message")} placeholder="Wall condition, gate/parking access, colour preferences…" />
            <input tabIndex={-1} autoComplete="off" aria-hidden="true" value={contact.hp} onChange={setC("hp")} name="website" className="absolute -left-[9999px] h-0 w-0 opacity-0" />
          </div>
        )}

        {(stepError || error) && (
          <p role="alert" className="mt-5 rounded-lg bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
            {stepError ?? error}
          </p>
        )}

        <div className="mt-8 flex items-center justify-between gap-3 border-t border-line pt-5">
          {step > 0 ? (
            <Button variant="secondary" onClick={() => { setStepError(undefined); setStep(step - 1); }}>
              <ArrowLeft aria-hidden="true" className="size-4" /> Back
            </Button>
          ) : (
            <span />
          )}
          {step < 2 ? (
            <Button onClick={next} size="lg">
              Continue <ArrowRight aria-hidden="true" className="size-4" />
            </Button>
          ) : (
            <Button type="submit" size="lg" disabled={submitting}>
              {submitting ? "Dispatching…" : "Dispatch My Request"} <Send aria-hidden="true" className="size-4" />
            </Button>
          )}
        </div>
      </form>

      <aside className="rounded-2xl border border-line bg-surface p-5 shadow-card sm:p-6 lg:sticky lg:top-24" aria-label="Quote summary">
        <p className="text-xs font-semibold tracking-[0.14em] text-clay-500 uppercase">Live Summary</p>
        <dl className="mt-4 grid gap-3 text-sm">
          <Line label="Environment" value={zone === "exterior" ? "Exterior" : "Interior"} />
          <Line label="Scope" value={scope} />
          <Line label="Area" value={estimate && estimate.sqft > 0 ? `${formatNumber(estimate.sqft)} sq ft` : Number(area) > 0 ? "…" : "Not set"} />
          <Line label="Location" value={loc.label} />
          <Line label="Texture" value={texture?.name ?? "Not selected"} />
        </dl>
        <div className="mt-5 rounded-lg bg-ink p-4 text-white" aria-live="polite">
          <p className="text-[11px] font-semibold tracking-wider text-sand-500 uppercase">Estimated Investment</p>
          <p className="font-display mt-1 text-2xl font-extrabold tnum">{estimate && estimate.total > 0 ? formatPKR(estimate.total) : "PKR —"}</p>
          {estimate && estimate.total > 0 && (
            <p className="mt-1 text-xs text-white/60 tnum">
              Range {formatPKR(estimate.low)} – {formatPKR(estimate.high)}
            </p>
          )}
        </div>
        <p className="mt-3 text-[11px] leading-snug text-ink-muted">Final price confirmed after free laser survey and moisture check.</p>
        <Button href={whatsappLink(waMessages.start)} variant="whatsapp" className="mt-4 w-full">
          <WhatsAppIcon className="size-4" /> Prefer WhatsApp? Chat now
        </Button>
      </aside>
    </div>
  );
}

function Line({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-4 border-b border-line pb-2.5 last:border-0 last:pb-0">
      <dt className="text-ink-muted">{label}</dt>
      <dd className="text-right font-semibold text-ink">{value}</dd>
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
      <span className="text-sm font-bold text-clay-600 tnum">{price}</span>
    </label>
  );
}
