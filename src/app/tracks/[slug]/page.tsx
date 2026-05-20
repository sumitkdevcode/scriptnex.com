import { Metadata } from 'next';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'https://admin.scriptnex.com/api/v1';

interface PageProps {
  params: {
    slug: string;
  };
}

async function getTrack(slug: string) {
  try {
    const res = await fetch(`${API_BASE}/tracks/${slug}`, {
      headers: { 'Accept': 'application/json' },
      next: { revalidate: 3600 },
    });
    if (!res.ok) return null;
    const contentType = res.headers.get("content-type");
    if (!contentType || !contentType.includes("application/json")) return null;
    return await res.json();
  } catch {
    return null;
  }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const data = await getTrack(slug);
  const track = data?.data?.track;

  if (!track) {
    return {
      title: 'Track Not Found',
      description: 'The requested learning track could not be found on ScriptNex.',
    };
  }

  const title = `${track.title} — Free Programming Course`;
  const description = track.description?.substring(0, 155) || `Learn ${track.title} on ScriptNex with structured modules, hands-on practice, and real-world examples.`;

  return {
    title,
    description,
    alternates: {
      canonical: `https://scriptnex.com/tracks/${slug}`,
    },
    openGraph: {
      title,
      description,
      url: `https://scriptnex.com/tracks/${slug}`,
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
    },
  };
}

export { default } from './TrackDetailClient';
