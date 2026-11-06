import fs from "node:fs";
import path from "node:path";
import { pathToFileURL } from "node:url";

const src = path.resolve(import.meta.dirname, "..", "src");

/** Resolves the "@/..." import alias used in the project so plain Node can import the .ts data files. */
export async function resolve(specifier, context, nextResolve) {
  if (specifier.startsWith("@/")) {
    const base = path.join(src, specifier.slice(2));
    for (const candidate of [`${base}.ts`, `${base}.tsx`, path.join(base, "index.ts")]) {
      if (fs.existsSync(candidate)) return nextResolve(pathToFileURL(candidate).href, context);
    }
  }
  return nextResolve(specifier, context);
}
