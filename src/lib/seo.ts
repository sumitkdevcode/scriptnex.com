import { Metadata } from 'next';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1';

interface SeoData {
  title: string | null;
  meta_description: string | null;
  meta_keywords: string | null;
  og_title: string | null;
  og_description: string | null;
  og_image: string | null;
}

export async function getPageMetadata(path: string): Promise<Metadata> {
  try {
    const response = await fetch(`${API_BASE}/seo?path=${encodeURIComponent(path)}`, {
      headers: {
        'Accept': 'application/json'
      },
      next: { revalidate: 3600 }, // Cache for 1 hour
    });
    
    if (!response.ok) {
      return {};
    }

    const contentType = response.headers.get("content-type");
    if (!contentType || !contentType.includes("application/json")) {
      return {};
    }

    const json = await response.json();
    
    if (!json.success || !json.data.seo) {
      return {};
    }

    const seo: SeoData = json.data.seo;

    return {
      title: seo.title || undefined,
      description: seo.meta_description || undefined,
      keywords: seo.meta_keywords ? seo.meta_keywords.split(',').map(k => k.trim()) : undefined,
      openGraph: {
        title: seo.og_title || seo.title || undefined,
        description: seo.og_description || seo.meta_description || undefined,
        images: seo.og_image ? [{ url: seo.og_image }] : undefined,
      },
    };
  } catch (error) {
    console.error('Failed to fetch SEO metadata:', error);
    return {};
  }
}
