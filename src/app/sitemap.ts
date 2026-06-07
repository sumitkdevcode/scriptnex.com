import { MetadataRoute } from 'next';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'https://admin.scriptnex.com/api/v1';

interface SlugItem {
  slug: string;
  updated_at?: string;
}

async function fetchSlugs(endpoint: string): Promise<SlugItem[]> {
  try {
    const res = await fetch(`${API_BASE}${endpoint}`, {
      headers: { Accept: 'application/json' },
      next: { revalidate: 86400 }, // 24 hours
    });
    if (!res.ok) return [];
    const json = await res.json();
    const items: SlugItem[] = json.data || [];
    return items.filter((item) => item.slug);
  } catch {
    return [];
  }
}

/**
 * Fetch ALL slugs for a given endpoint by paginating through the API.
 * This ensures all items (e.g., 500+ blogs) are included in the sitemap.
 */
async function fetchAllPaginatedSlugs(endpoint: string): Promise<SlugItem[]> {
  const allSlugs: SlugItem[] = [];
  let page = 1;
  const maxPages = 50; // Safety limit (50 * 100 = 5000 items max)

  while (page <= maxPages) {
    try {
      // Use ? or & depending on whether the endpoint already has query params
      const separator = endpoint.includes('?') ? '&' : '?';
      const res = await fetch(`${API_BASE}${endpoint}${separator}per_page=100&page=${page}`, {
        headers: { Accept: 'application/json' },
        next: { revalidate: 86400 },
      });
      if (!res.ok) break;
      const json = await res.json();
      const items: SlugItem[] = json.data || [];
      if (items.length === 0) break;

      allSlugs.push(...items.filter((item) => item.slug));

      // Check if there are more pages
      const lastPage = json.meta?.pagination?.last_page || json.meta?.last_page || 1;
      if (page >= lastPage) break;
      page++;
    } catch {
      break;
    }
  }

  return allSlugs;
}

// Use build date as a stable fallback instead of new Date() on every crawl
const BUILD_DATE = new Date().toISOString();

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://scriptnex.com';

  // Static high-value pages with strategic priorities
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: baseUrl, lastModified: BUILD_DATE, changeFrequency: 'daily', priority: 1.0 },
    { url: `${baseUrl}/problems`, lastModified: BUILD_DATE, changeFrequency: 'daily', priority: 0.9 },
    { url: `${baseUrl}/certifications`, lastModified: BUILD_DATE, changeFrequency: 'weekly', priority: 0.9 },
    { url: `${baseUrl}/tracks`, lastModified: BUILD_DATE, changeFrequency: 'weekly', priority: 0.9 },
    { url: `${baseUrl}/contests`, lastModified: BUILD_DATE, changeFrequency: 'daily', priority: 0.8 },
    { url: `${baseUrl}/leaderboard`, lastModified: BUILD_DATE, changeFrequency: 'daily', priority: 0.7 },
    { url: `${baseUrl}/discuss`, lastModified: BUILD_DATE, changeFrequency: 'daily', priority: 0.7 },
    { url: `${baseUrl}/pricing`, lastModified: BUILD_DATE, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${baseUrl}/partners`, lastModified: BUILD_DATE, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${baseUrl}/privacy`, lastModified: BUILD_DATE, changeFrequency: 'yearly', priority: 0.3 },
    { url: `${baseUrl}/terms`, lastModified: BUILD_DATE, changeFrequency: 'yearly', priority: 0.3 },
    { url: `${baseUrl}/refund`, lastModified: BUILD_DATE, changeFrequency: 'yearly', priority: 0.3 },
  ];

  // Fetch dynamic content slugs in parallel — problems and blogs are paginated
  const [problemSlugs, blogSlugs, trackSlugs, certSlugs, contestSlugs] = await Promise.all([
    fetchAllPaginatedSlugs('/problems'),
    fetchAllPaginatedSlugs('/blog'),
    fetchSlugs('/tracks'),
    fetchSlugs('/certifications'),
    fetchSlugs('/contests'),
  ]);

  const dynamicRoutes: MetadataRoute.Sitemap = [
    ...problemSlugs.map((item) => ({
      url: `${baseUrl}/problems/${item.slug}`,
      lastModified: item.updated_at || BUILD_DATE,
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    })),
    ...blogSlugs.map((item) => ({
      url: `${baseUrl}/blog/${item.slug}`,
      lastModified: item.updated_at || BUILD_DATE,
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    })),
    ...trackSlugs.map((item) => ({
      url: `${baseUrl}/tracks/${item.slug}`,
      lastModified: item.updated_at || BUILD_DATE,
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    })),
    ...certSlugs.map((item) => ({
      url: `${baseUrl}/certifications/${item.slug}`,
      lastModified: item.updated_at || BUILD_DATE,
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    })),
    ...contestSlugs.map((item) => ({
      url: `${baseUrl}/contests/${item.slug}`,
      lastModified: item.updated_at || BUILD_DATE,
      changeFrequency: 'weekly' as const,
      priority: 0.6,
    })),
  ];

  return [...staticRoutes, ...dynamicRoutes];
}
