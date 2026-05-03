'use client';

import { useParams } from 'next/navigation';
import ProblemWorkspace from '@/components/problem/ProblemWorkspace';

export default function ProblemDetailPage() {
  const params = useParams();

  return (
    <ProblemWorkspace
      backHref="/problems"
      problemSlug={params.slug as string}
    />
  );
}
