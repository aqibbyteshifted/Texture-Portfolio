import type { MetadataRoute } from "next";
import { site } from "@/data/site";
import { areas } from "@/data/areas";
import { posts } from "@/data/blog";
import { allProjects } from "@/data/projects";
import { textures } from "@/data/textures";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  return [
    { url: site.url, lastModified: now, changeFrequency: "weekly", priority: 1 },
    { url: `${site.url}/textures`, lastModified: now, changeFrequency: "weekly", priority: 0.9 },
    { url: `${site.url}/quote`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${site.url}/visualizer`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${site.url}/compare`, lastModified: now, changeFrequency: "monthly", priority: 0.6 },
    { url: `${site.url}/warranty`, lastModified: now, changeFrequency: "yearly", priority: 0.5 },
    { url: `${site.url}/areas`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${site.url}/projects`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${site.url}/blog`, lastModified: now, changeFrequency: "weekly", priority: 0.7 },
    ...areas.map((a) => ({ url: `${site.url}/areas/${a.slug}`, lastModified: now, changeFrequency: "monthly" as const, priority: 0.8 })),
    ...allProjects.map((p) => ({ url: `${site.url}/projects/${p.slug}`, lastModified: now, changeFrequency: "yearly" as const, priority: 0.6 })),
    ...posts.map((p) => ({ url: `${site.url}/blog/${p.slug}`, lastModified: new Date(p.date), changeFrequency: "yearly" as const, priority: 0.6 })),
    ...textures.map((t) => ({
      url: `${site.url}/textures/${t.slug}`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
  ];
}
