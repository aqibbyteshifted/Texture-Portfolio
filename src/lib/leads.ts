import "server-only";
import { randomInt } from "node:crypto";
import { appendFile, mkdir } from "node:fs/promises";
import path from "node:path";
import type { LeadRecord } from "@/types";
import type { LeadOutput } from "@/lib/validation";

const DATA_DIR = path.join(process.cwd(), ".data");

export const makeReference = () => `ZC-${new Date().getFullYear()}-${randomInt(1000, 10000)}`;

export function toRecord(input: LeadOutput, ref: string): LeadRecord {
  const { hp: _hp, ...rest } = input;
  return { ...rest, ref, createdAt: new Date().toISOString() } as LeadRecord;
}

/**
 * Persists a lead. Local file storage (dev / VPS) is best-effort, since serverless
 * hosts have a read-only filesystem. Set LEAD_WEBHOOK_URL to forward leads to a CRM,
 * Google Sheet, Zapier, Make or n8n flow. Resolves true if at least one sink accepted it.
 */
export async function saveLead(lead: LeadRecord): Promise<boolean> {
  const results = await Promise.allSettled([writeToFile(lead), postToWebhook(lead)]);
  const ok = results.some((r) => r.status === "fulfilled" && r.value);
  if (!ok) console.error("[leads] no sink accepted lead", lead.ref);
  return ok;
}

async function writeToFile(lead: LeadRecord) {
  await mkdir(DATA_DIR, { recursive: true });
  await appendFile(path.join(DATA_DIR, "leads.jsonl"), JSON.stringify(lead) + "\n", "utf8");
  return true;
}

async function postToWebhook(lead: LeadRecord) {
  const url = process.env.LEAD_WEBHOOK_URL;
  if (!url) return false;
  const res = await fetch(url, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(lead),
    signal: AbortSignal.timeout(8000),
  });
  return res.ok;
}

/* Minimal in-memory rate limit: 5 submissions / 10 min per IP (per server instance). */
const hits = new Map<string, number[]>();
export function rateLimited(ip: string, limit = 5, windowMs = 10 * 60_000) {
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < windowMs);
  recent.push(now);
  hits.set(ip, recent);
  if (hits.size > 5000) hits.clear();
  return recent.length > limit;
}
