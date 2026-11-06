import { paymentRule } from "@/data/policy";
import { site } from "@/data/site";
import { formatNumber, formatPKR } from "@/lib/format";
import type { Estimate } from "@/lib/pricing";

export interface EstimatePdfInput {
  textureName: string;
  /** e.g. "PKR 180 / sq ft" or "PKR 250–750 / sq ft" */
  rateLabel: string;
  warrantyYears: number;
  zone: "exterior" | "interior";
  estimate: Estimate;
}

const CLAY: [number, number, number] = [181, 101, 29];
const INK: [number, number, number] = [31, 31, 31];
const MUTED: [number, number, number] = [120, 113, 108];

/** Fetches the company logo as a data URL so it can be embedded in the PDF. */
async function loadLogo(): Promise<string> {
  const res = await fetch("/images/logo.jpg");
  if (!res.ok) throw new Error("logo unavailable");
  const blob = await res.blob();
  return await new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(blob);
  });
}

/**
 * Builds a one-page, branded A4 estimate in the browser (jsPDF is loaded only when the button is clicked).
 * The PDF is always English/Latin script: embedding an Urdu font would add megabytes to the download.
 */
export async function downloadEstimatePdf({ textureName, rateLabel, warrantyYears, zone, estimate }: EstimatePdfInput) {
  const { jsPDF } = await import("jspdf");
  const doc = new jsPDF({ unit: "pt", format: "a4" });
  const W = doc.internal.pageSize.getWidth();
  const M = 48;
  let y = 0;

  // header band
  doc.setFillColor(...CLAY);
  doc.rect(0, 0, W, 92, "F");
  let textX = M;
  try {
    const logo = await loadLogo();
    doc.setFillColor(255, 255, 255);
    doc.circle(M + 30, 46, 33, "F");
    doc.addImage(logo, "JPEG", M, 16, 60, 60);
    textX = M + 78;
  } catch {
    /* the logo is a nicety: fall back to the text-only header */
  }
  doc.setTextColor(255, 255, 255);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(22);
  doc.text("ZAIN & CO", textX, 48);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.text("ARCHITECTURAL FINISHES  •  LAHORE", textX, 66);
  doc.setFontSize(9);
  doc.text(site.phone, W - M, 44, { align: "right" });
  doc.text(site.email, W - M, 58, { align: "right" });
  doc.text(site.url.replace(/^https?:\/\//, ""), W - M, 72, { align: "right" });

  // title
  y = 140;
  doc.setTextColor(...INK);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(20);
  doc.text("Project Estimate", M, y);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.setTextColor(...MUTED);
  const today = new Intl.DateTimeFormat("en-GB", { dateStyle: "long", timeZone: "Asia/Karachi" }).format(new Date());
  doc.text(`Prepared ${today}`, M, y + 16);

  // summary box
  y += 40;
  doc.setDrawColor(230, 225, 215);
  doc.setFillColor(250, 248, 245);
  doc.roundedRect(M, y, W - M * 2, 78, 8, 8, "FD");
  const cols: [string, string][] = [
    ["FINISH", textureName],
    ["SURFACE AREA", `${formatNumber(estimate.sqft)} sq ft`],
    ["RATE", rateLabel],
    ["ENVIRONMENT", zone === "exterior" ? "Exterior" : "Interior"],
  ];
  const colW = (W - M * 2) / cols.length;
  cols.forEach(([label, value], i) => {
    const x = M + 16 + i * colW;
    doc.setFont("helvetica", "bold");
    doc.setFontSize(8);
    doc.setTextColor(...MUTED);
    doc.text(label, x, y + 28);
    doc.setFontSize(11);
    doc.setTextColor(...INK);
    doc.text(doc.splitTextToSize(value, colW - 20), x, y + 46);
  });

  // line items
  y += 114;
  const rows: [string, string][] = [["Architectural texture (material + master karigar labour)", formatPKR(estimate.base)]];
  if (estimate.primer > 0) rows.push(["Deep penetrating primer & hydro-sealer", formatPKR(estimate.primer)]);
  if (estimate.scaffold > 0) rows.push(["Steel scaffolding & safety staging", formatPKR(estimate.scaffold)]);
  if (estimate.logistics > 0) rows.push(["Outstation logistics", formatPKR(estimate.logistics)]);

  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);
  doc.setTextColor(...MUTED);
  doc.text("ITEM", M, y);
  doc.text("AMOUNT", W - M, y, { align: "right" });
  y += 8;
  doc.setDrawColor(220, 214, 204);
  doc.line(M, y, W - M, y);
  y += 20;
  doc.setFont("helvetica", "normal");
  doc.setFontSize(11);
  doc.setTextColor(...INK);
  for (const [label, amount] of rows) {
    doc.text(label, M, y);
    doc.text(amount, W - M, y, { align: "right" });
    y += 24;
  }
  doc.line(M, y - 8, W - M, y - 8);

  // total
  y += 14;
  doc.setFont("helvetica", "bold");
  doc.setFontSize(13);
  doc.text(estimate.isFrom ? "Estimated investment (starting from)" : "Estimated project investment", M, y);
  doc.setFontSize(18);
  doc.setTextColor(...CLAY);
  doc.text(formatPKR(estimate.total), W - M, y, { align: "right" });
  y += 18;
  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.setTextColor(...MUTED);
  doc.text(`Expected range: ${formatPKR(estimate.low)} - ${formatPKR(estimate.high)}`, W - M, y, { align: "right" });

  // bill of materials
  y += 40;
  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.setTextColor(...INK);
  doc.text("Estimated bill of materials", M, y);
  y += 16;
  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.setTextColor(...MUTED);
  const bom = doc.splitTextToSize(estimate.bomText, W - M * 2) as string[];
  doc.text(bom, M, y);
  y += bom.length * 14 + 24;

  // notes
  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.setTextColor(...INK);
  doc.text("Good to know", M, y);
  y += 16;
  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.setTextColor(...MUTED);
  const notes = [
    "This is an indicative estimate. The final price is confirmed after a free on-site laser survey and surface moisture check.",
    "Includes primer, mesh, base coats and skilled artisan labour as listed. Payment milestones: 50% mobilisation, 30% mid-project, 20% on satisfied handover.",
    `Every project is covered by a ${warrantyYears}-year written warranty (flaking, debonding, hollow spots and UV colour fading).`,
    "Free 1x1 ft physical sample boards are brought to your site visit.",
    paymentRule.pdfNote,
  ];
  for (const note of notes) {
    const lines = doc.splitTextToSize(`•  ${note}`, W - M * 2) as string[];
    doc.text(lines, M, y);
    y += lines.length * 14 + 4;
  }

  // footer
  doc.setDrawColor(220, 214, 204);
  doc.line(M, 780, W - M, 780);
  doc.setFontSize(9);
  doc.setTextColor(...MUTED);
  doc.text(`${site.group}  •  ${site.address}`, M, 796);
  doc.text(`PEC Registration #${site.pec}`, M, 810);

  doc.save(`zain-and-co-estimate-${textureName.toLowerCase().replace(/[^a-z0-9]+/g, "-")}.pdf`);
}
