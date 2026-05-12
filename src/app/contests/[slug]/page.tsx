import { Metadata } from 'next';
import ContestDetailClient from '@/components/contest/ContestDetailClient';

interface PageProps {
  params: {
    slug: string;
  };
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
  const data = await getContest(params.slug);
  const contest = data?.data?.contest;

  if (!contest) {
    return {
      title: 'Contest Not Found | ScriptNex',
    };
  }

  return {
    title: `${contest.title} | ScriptNex Contests`,
    description: contest.description?.substring(0, 160) || `Join the ${contest.title} coding competition on ScriptNex.`,
    openGraph: {
      title: contest.title,
      description: `Participate in this ${contest.type} contest and win prizes!`,
    }
  };
}

export default function ContestDetailPage({ params }: PageProps) {
  return <ContestDetailClient slug={params.slug} />;
}
