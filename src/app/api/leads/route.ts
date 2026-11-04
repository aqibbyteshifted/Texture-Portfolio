import { NextResponse } from "next/server";
import { leadSchema } from "@/lib/validation";
import { makeReference, rateLimited, saveLead, toRecord } from "@/lib/leads";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  if (rateLimited(ip)) {
    return NextResponse.json({ ok: false, error: "Too many requests. Please WhatsApp us instead." }, { status: 429 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid request body." }, { status: 400 });
  }

  const parsed = leadSchema.safeParse(body);
  if (!parsed.success) {
    const fields: Record<string, string> = {};
    for (const issue of parsed.error.issues) {
      const key = issue.path.join(".") || "form";
      fields[key] ??= issue.message;
    }
    return NextResponse.json({ ok: false, error: "Please check the highlighted fields.", fields }, { status: 422 });
  }

  const record = toRecord(parsed.data, makeReference());
  // Bots fill the honeypot: pretend success without storing anything.
  if (parsed.data.hp) return NextResponse.json({ ok: true, lead: record });

  const stored = await saveLead(record);
  if (!stored) {
    return NextResponse.json(
      { ok: false, error: "We couldn't record your request. Please WhatsApp us and we'll respond immediately." },
      { status: 503 },
    );
  }
  return NextResponse.json({ ok: true, lead: record });
}
