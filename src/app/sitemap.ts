import type { MetadataRoute } from "next";
import { getCollections, getJournal, getProducts } from "@/lib/content";

const base = process.env.NEXT_PUBLIC_SITE_URL || "https://al-ibrahim-aroma.vercel.app";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [products, collections, posts] = await Promise.all([
    getProducts(),
    getCollections(),
    getJournal(),
  ]);

  const staticRoutes = ["", "/collections", "/about", "/journal", "/contact", "/faq"].map((path) => ({
    url: `${base}${path}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: path === "" ? 1 : 0.8,
  }));

  return [
    ...staticRoutes,
    ...collections.map((c) => ({
      url: `${base}/collections/${c.slug}`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.75,
    })),
    ...products.map((p) => ({
      url: `${base}/product/${p.slug}`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.7,
    })),
    ...posts.map((p) => ({
      url: `${base}/journal/${p.slug}`,
      lastModified: new Date(p.publishedAt),
      changeFrequency: "monthly" as const,
      priority: 0.6,
    })),
    ...["shipping", "returns", "privacy", "terms"].map((slug) => ({
      url: `${base}/policies/${slug}`,
      lastModified: new Date(),
      changeFrequency: "yearly" as const,
      priority: 0.3,
    })),
  ];
}
