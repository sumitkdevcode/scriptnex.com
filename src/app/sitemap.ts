import { MetadataRoute } from 'next';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'https://admin.scriptnex.com/api/v1';

interface SlugItem {
  slug: string;
}

async function fetchSlugs(endpoint: string): Promise<string[]> {
  try {
    const res = await fetch(`${API_BASE}${endpoint}`, {
      headers: { Accept: 'application/json' },
      next: { revalidate: 86400 }, // 24 hours
    });
    if (!res.ok) return [];
    const json = await res.json();
    const items: SlugItem[] = json.data || [];
    return items.map((item) => item.slug).filter(Boolean);
  } catch {
    return [];
  }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://scriptnex.com';

  // Static high-value pages with strategic priorities
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: baseUrl, lastModified: new Date(), changeFrequency: 'daily', priority: 1.0 },
    { url: `${baseUrl}/problems`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.9 },
    { url: `${baseUrl}/certifications`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.9 },
    { url: `${baseUrl}/tracks`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.9 },
    { url: `${baseUrl}/contests`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.8 },
    { url: `${baseUrl}/leaderboard`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.7 },
    { url: `${baseUrl}/discuss`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.7 },
    { url: `${baseUrl}/pricing`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.6 },
    { url: `${baseUrl}/privacy`, lastModified: new Date(), changeFrequency: 'yearly', priority: 0.3 },
    { url: `${baseUrl}/terms`, lastModified: new Date(), changeFrequency: 'yearly', priority: 0.3 },
    { url: `${baseUrl}/refund`, lastModified: new Date(), changeFrequency: 'yearly', priority: 0.3 },
  ];

  // Fetch dynamic content slugs in parallel
  const [problemSlugs, trackSlugs, certSlugs, contestSlugs] = await Promise.all([
    fetchSlugs('/problems?per_page=100'),
    fetchSlugs('/tracks'),
    fetchSlugs('/certifications'),
    fetchSlugs('/contests'),
  ]);

  const dynamicRoutes: MetadataRoute.Sitemap = [
    ...problemSlugs.map((slug) => ({
      url: `${baseUrl}/problems/${slug}`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    })),
    ...trackSlugs.map((slug) => ({
      url: `${baseUrl}/tracks/${slug}`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    })),
    ...certSlugs.map((slug) => ({
      url: `${baseUrl}/certifications/${slug}`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    })),
    ...contestSlugs.map((slug) => ({
      url: `${baseUrl}/contests/${slug}`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.6,
    })),
  ];

  return [...staticRoutes, ...dynamicRoutes];
}
