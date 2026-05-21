import { Metadata } from 'next';
import ProblemWorkspace from '@/components/problem/ProblemWorkspace';
import { api } from '@/lib/api';

interface PageProps {
  params: Promise<{
    slug: string;
  }>;
}

async function getProblem(slug: string) {
  try {
    // We can fetch from public API
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/problems/${slug}`, {
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
  const data = await getProblem(slug);
  const problem = data?.data?.problem;

  if (!problem) {
    return {
      title: 'Problem Not Found | ScriptNex',
    };
  }

  return {
    title: `${problem.title} | ScriptNex Practice`,
    description: problem.description?.substring(0, 160) || `Solve the ${problem.title} coding challenge on ScriptNex.`,
    openGraph: {
      title: problem.title,
      description: `Can you solve this ${problem.difficulty} level problem?`,
    }
  };
}

export default async function ProblemDetailPage({ params }: PageProps) {
  const { slug } = await params;
  
  return (
    <>
      <ProblemWorkspace
        backHref="/problems"
        problemSlug={slug}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'BreadcrumbList',
            itemListElement: [
              {
                '@type': 'ListItem',
                position: 1,
                name: 'Problems',
                item: 'https://scriptnex.com/problems',
              },
              {
                '@type': 'ListItem',
                position: 2,
                name: slug.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
                item: `https://scriptnex.com/problems/${slug}`,
              },
            ],
          }),
        }}
      />
    </>
  );
}
