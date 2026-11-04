import type { MetadataRoute } from "next";
import { site } from "@/data/site";
import { textures } from "@/data/textures";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  return [
    { url: site.url, lastModified: now, changeFrequency: "weekly", priority: 1 },
    { url: `${site.url}/textures`, lastModified: now, changeFrequency: "weekly", priority: 0.9 },
    { url: `${site.url}/quote`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    ...textures.map((t) => ({
      url: `${site.url}/textures/${t.slug}`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
  ];
}
