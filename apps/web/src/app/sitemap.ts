import { MetadataRoute } from "next";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";
const BASE_URL = process.env.NEXT_PUBLIC_APP_URL || "https://mesa.pe";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  try {
    const res = await fetch(`${API_URL}/businesses/public-slugs`, {
      next: { revalidate: 3600 },
    });

    if (!res.ok) {
      return [];
    }

    const slugs: { slug: string; updatedAt: string }[] = await res.json();

    return slugs.map((item) => ({
      url: `${BASE_URL}/${item.slug}`,
      lastModified: item.updatedAt ? new Date(item.updatedAt) : new Date(),
      changeFrequency: "daily",
      priority: 0.8,
    }));
  } catch {
    return [];
  }
}
