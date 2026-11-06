#!/usr/bin/env node
/**
 * Lists every English string that is passed through t() (or lives in the translatable data fields)
 * but has no Urdu entry in src/i18n/ur*.ts.
 *
 *   npm run i18n:check                   report missing keys
 *   npm run i18n:check -- --json         print missing keys as JSON (used to seed translations)
 *   npm run i18n:check -- --strict       exit with code 1 when anything is missing (CI)
 */
import fs from "node:fs";
import path from "node:path";
import { pathToFileURL } from 'node:url';

const root = path.resolve(import.meta.dirname, '..');
const src = path.join(root, 'src');
const load = (file) => import(pathToFileURL(file).href);

/* ---- dictionary keys ---- */
const dictFiles = fs.readdirSync(path.join(src, "i18n")).filter((f) => /^ur.*\.ts$/.test(f));
const have = new Set();
for (const f of dictFiles) {
  const mod = await load(path.join(src, "i18n", f));
  for (const value of Object.values(mod)) if (value && typeof value === "object") Object.keys(value).forEach((k) => have.add(k));
}

/* ---- keys used literally in source: t("..."), t('...'), t(`...`) ---- */
const need = new Map(); // key -> first place
const walk = (dir) =>
  fs.readdirSync(dir, { withFileTypes: true }).flatMap((e) => {
    const p = path.join(dir, e.name);
    return e.isDirectory() ? walk(p) : /\.(tsx?|mjs)$/.test(e.name) ? [p] : [];
  });
const literal = /\b(?:t|msg)\(\s*("(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*'|`(?:[^`\\$]|\\.)*`)/g;
for (const file of walk(src)) {
  if (file.includes(`${path.sep}i18n${path.sep}`)) continue;
  const text = fs.readFileSync(file, "utf8");
  for (const m of text.matchAll(literal)) {
    let raw = m[1];
    const q = raw[0];
    raw = raw.slice(1, -1);
    const value = q === '"' ? JSON.parse(`"${raw}"`) : raw.replace(/\\'/g, "'").replace(/\\`/g, "`").replace(/\\n/g, "\n");
    if (/[A-Za-z]/.test(value) && !need.has(value)) need.set(value, path.relative(root, file));
  }
}

/* ---- strings that reach t() through data files ---- */
const add = (v, from) => typeof v === "string" && /[A-Za-z]/.test(v) && !need.has(v) && need.set(v, from);
const each = (arr, fields, from) => (arr ?? []).forEach((o) => fields.forEach((f) => add(o[f], from)));

const site = await load(path.join(src, "data/site.ts"));
each(site.navLinks, ["label"], "data/site.ts");
each(site.processSteps, ["title", "description", "meta"], "data/site.ts");
each(site.whyUs, ["title", "description"], "data/site.ts");
each(site.locationOptions, ["label"], "data/site.ts");
each(site.site.stats, ["label", "value"], "data/site.ts");
site.coverageAreas.forEach((v) => add(v, "data/site.ts"));
add(site.site.tagline, "data/site.ts");
add(site.site.hours, "data/site.ts");
add(site.site.studio.hours, "data/site.ts");

each((await load(path.join(src, "data/content.ts"))).faqs.filter((f) => f.id !== "f1"), ["question", "answer"], "data/content.ts");
add((await load(path.join(src, "data/content.ts"))).faqs[0].question, "data/content.ts");

const tx = await load(path.join(src, "data/textures.ts"));
for (const x of tx.textures) {
  ["name", "shortName", "category", "badge", "feature", "blurb", "summary", "tagline", "useAreasIntro"].forEach((f) => add(x[f], `data/textures.ts (${x.slug})`));
  add(x.specs.zone, `data/textures.ts (${x.slug})`);
  add(x.specs.tactility, `data/textures.ts (${x.slug})`);
  add(x.specs.curing, `data/textures.ts (${x.slug})`);
}

const pr = await load(path.join(src, "data/projects.ts"));
for (const list of [pr.projects, pr.homeProjects]) {
  each(list, ["title", "description", "type", "scope", "badge", "sector"], "data/projects.ts");
}

each((await load(path.join(src, "data/gallery.ts"))).galleryItems, ["title", "category"], "data/gallery.ts");
const cr = await load(path.join(src, "data/credentials.ts"));
each(cr.credentials, ["title", "detail", "description"], "data/credentials.ts");
cr.warrantyCoverage.forEach((v) => add(v, "data/credentials.ts"));
each((await load(path.join(src, "data/team.ts"))).team, ["name", "role", "bio", "highlight"], "data/team.ts");

["All"].forEach((d) => add(d, "components (dynamic lists)"));
["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"].forEach((d) => add(d, "lib/hours.ts"));
// server-side validation messages shown in forms
[
  "Please enter your full name",
  "Phone / WhatsApp number is required",
  "Enter a valid Pakistani mobile number, e.g. 0300 1234567",
  "Tell us your Lahore area / sector",
  "Please describe your project",
  "Enter a valid email address",
  "Tell us your site location / sub-division",
  "Select the surface scope",
  "Select a texture",
  "Please check the highlighted fields.",
  "Too many requests. Please WhatsApp us instead.",
  "Invalid request body.",
  "We couldn't record your request. Please WhatsApp us and we'll respond immediately.",
  "Something went wrong. Please try again or WhatsApp us.",
  "Network error. Check your connection or WhatsApp us directly.",
].forEach((v) => add(v, "validation / api messages"));

const missing = [...need].filter(([k]) => !have.has(k));
const unused = [...have].filter((k) => !need.has(k));

if (process.argv.includes("--json")) {
  console.log(JSON.stringify(Object.fromEntries(missing.map(([k, v]) => [k, v])), null, 1));
} else {
  console.log(`translatable strings: ${need.size} | translated: ${need.size - missing.length} | missing: ${missing.length} | unused entries: ${unused.length}`);
  for (const [k, from] of missing) console.log(`  [${from}] ${k.length > 110 ? k.slice(0, 107) + "..." : k}`);
  if (unused.length) console.log("\nunused dictionary keys (typo or removed copy):\n  " + unused.slice(0, 40).join("\n  "));
}
if (process.argv.includes("--strict") && missing.length) process.exit(1);
