import { Metadata } from 'next';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'https://admin.scriptnex.com/api/v1';

interface PageProps {
  params: {
    slug: string;
  };
}

async function getCertification(slug: string) {
  try {
    const res = await fetch(`${API_BASE}/certifications/${slug}`, {
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
  const data = await getCertification(slug);
  const cert = data?.data?.certification;

  if (!cert) {
    return {
      title: 'Certification Not Found',
      description: 'The requested coding certification could not be found on ScriptNex.',
    };
  }

  const title = `${cert.title} Certification — Free Online Coding Exam`;
  const description = cert.description?.substring(0, 155) || `Take the ${cert.title} certification exam on ScriptNex. Pass the timed test and earn a verified digital certificate to add to your resume.`;

  return {
    title,
    description,
    alternates: {
      canonical: `https://scriptnex.com/certifications/${slug}`,
    },
    openGraph: {
      title,
      description,
      url: `https://scriptnex.com/certifications/${slug}`,
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
    },
  };
}

export { default } from './CertDetailClient';
