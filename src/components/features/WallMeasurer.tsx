"use client";

import { useId, useMemo, useState } from "react";
import { Plus, Ruler, Trash2 } from "lucide-react";
import { useT } from "@/i18n/client";
import { formatNumber } from "@/lib/format";
import { MAX_AREA_SQFT } from "@/lib/pricing";
import { cn } from "@/lib/cn";

interface Row {
  id: number;
  label: string;
  length: string;
  height: string;
}

const MAX_ROWS = 20;
const input =
  "h-10 w-full rounded-control border border-line-strong bg-surface px-2.5 text-sm text-ink tnum focus:border-clay-500 focus:outline-none";

/** Adds up several walls (length × height) into one total area, then hands it to the calculator. */
export function WallMeasurer({ onApply }: { onApply: (sqft: number) => void }) {
  const t = useT();
  const uid = useId();
  const [open, setOpen] = useState(false);
  const [rows, setRows] = useState<Row[]>([{ id: 1, label: "", length: "", height: "" }]);
  const [nextId, setNextId] = useState(2);

  const areas = useMemo(() => rows.map((r) => Math.max(0, Number(r.length) || 0) * Math.max(0, Number(r.height) || 0)), [rows]);
  const total = Math.min(areas.reduce((a, b) => a + b, 0), MAX_AREA_SQFT);

  const update = (id: number, key: keyof Row, value: string) => setRows((rs) => rs.map((r) => (r.id === id ? { ...r, [key]: value } : r)));

  return (
    <div className="mt-3">
      <button
        type="button"
        aria-expanded={open}
        aria-controls={`${uid}-panel`}
        onClick={() => setOpen((v) => !v)}
        className="inline-flex items-center gap-1.5 text-sm font-semibold text-clay-600 hover:text-clay-700"
      >
        <Ruler aria-hidden="true" className="size-4" /> {open ? t("Hide wall measurer") : t("Measure by walls")}
      </button>

      {open && (
        <div id={`${uid}-panel`} className="mt-3 rounded-xl border border-line bg-canvas p-4">
          <p className="text-xs text-ink-muted">{t("Add each wall's length and height in feet. We total them for you.")}</p>
          <ul className="mt-3 grid gap-2.5">
            {rows.map((r, i) => (
              <li key={r.id} className="grid grid-cols-[1fr_1fr_1fr] items-end gap-2 sm:grid-cols-[1.3fr_1fr_1fr_auto_auto]">
                <label className="col-span-3 sm:col-span-1">
                  <span className="sr-only">{t("Wall name")}</span>
                  <input className={input} value={r.label} onChange={(e) => update(r.id, "label", e.target.value)} placeholder={`${t("Wall")} ${i + 1}`} />
                </label>
                <label>
                  <span className="mb-1 block text-[10px] font-semibold tracking-wide text-ink-muted uppercase">{t("Length (ft)")}</span>
                  <input className={input} type="number" inputMode="decimal" min={0} value={r.length} onChange={(e) => update(r.id, "length", e.target.value)} />
                </label>
                <label>
                  <span className="mb-1 block text-[10px] font-semibold tracking-wide text-ink-muted uppercase">{t("Height (ft)")}</span>
                  <input className={input} type="number" inputMode="decimal" min={0} value={r.height} onChange={(e) => update(r.id, "height", e.target.value)} />
                </label>
                <p className="pb-2 text-end text-sm font-semibold text-ink tnum" aria-label={t("Wall area")}>
                  {formatNumber(areas[i])} <span className="text-xs font-normal text-ink-muted">{t("sq ft")}</span>
                </p>
                <button
                  type="button"
                  aria-label={`${t("Remove")} ${r.label || `${t("Wall")} ${i + 1}`}`}
                  disabled={rows.length === 1}
                  onClick={() => setRows((rs) => rs.filter((x) => x.id !== r.id))}
                  className="grid size-10 place-items-center rounded-control text-ink-muted hover:bg-sunken hover:text-red-600 disabled:opacity-30"
                >
                  <Trash2 aria-hidden="true" className="size-4" />
                </button>
              </li>
            ))}
          </ul>

          <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
            <button
              type="button"
              disabled={rows.length >= MAX_ROWS}
              onClick={() => {
                setRows((rs) => [...rs, { id: nextId, label: "", length: "", height: "" }]);
                setNextId((n) => n + 1);
              }}
              className="inline-flex items-center gap-1.5 rounded-control border border-line-strong bg-surface px-3 py-2 text-sm font-semibold hover:bg-sunken disabled:opacity-50"
            >
              <Plus aria-hidden="true" className="size-4" /> {t("Add wall")}
            </button>
            <div className="flex items-center gap-3">
              <p className="text-sm text-ink-soft">
                {t("Total")}: <strong className="text-ink tnum" data-testid="measurer-total">{formatNumber(total)}</strong> {t("sq ft")}
              </p>
              <button
                type="button"
                disabled={total <= 0}
                onClick={() => onApply(total)}
                className="h-10 rounded-control bg-clay-500 px-4 text-sm font-semibold text-white hover:bg-clay-600 disabled:opacity-50"
              >
                {t("Use this area")}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
