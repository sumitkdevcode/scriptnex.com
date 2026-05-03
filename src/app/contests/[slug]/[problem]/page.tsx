'use client';

import { useParams } from 'next/navigation';
import ProblemWorkspace from '@/components/problem/ProblemWorkspace';

export default function ContestProblemPage() {
  const params = useParams();
  const contestSlug = params.slug as string;

  return (
    <ProblemWorkspace
      backHref={`/contests/${contestSlug}`}
      problemSlug={params.problem as string}
      headerPrefix="Contest Workspace"
      submitLabel="Submit to Contest"
      editorialFallbackMessage="Editorial not available during contest."
    />
  );
}
