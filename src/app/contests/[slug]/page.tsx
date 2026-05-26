import { Metadata } from 'next';
import ContestDetailClient from '@/components/contest/ContestDetailClient';

interface PageProps {
  params: Promise<{
    slug: string;
  }>;
}

async function getContest(slug: string) {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/contests/${slug}`, {
        headers: { 'Accept': 'application/json' },
        next: { revalidate: 3600 }
    });
    
    if (!res.ok) return null;
    const contentType = res.headers.get("content-type");
    if (!contentType || !contentType.includes("application/json")) return null;
    
    return await res.json();
  } catch (e) {
    return null;
  }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const data = await getContest(slug);
  const contest = data?.data?.contest;

  if (!contest) {
    return {
      title: 'Contest Not Found | ScriptNex',
    };
  }

  return {
    title: `${contest.title} | ScriptNex Contests`,
    description: contest.description?.substring(0, 160) || `Join the ${contest.title} coding competition on ScriptNex.`,
    alternates: {
      canonical: `https://scriptnex.com/contests/${slug}`,
    },
    openGraph: {
      title: contest.title,
      description: `Participate in this ${contest.type} contest and win prizes!`,
      url: `https://scriptnex.com/contests/${slug}`,
    }
  };
}

export default async function ContestDetailPage({ params }: PageProps) {
  const { slug } = await params;
  return <ContestDetailClient slug={slug} />;
}
