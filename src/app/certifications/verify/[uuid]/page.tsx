import { redirect } from 'next/navigation';

interface LegacyVerifyPageProps {
  params: Promise<{
    uuid: string;
  }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export default async function LegacyVerifyPage({ params, searchParams }: LegacyVerifyPageProps) {
  const { uuid } = await params;
  const resolvedSearchParams = await searchParams;
  const query = new URLSearchParams();

  for (const [key, value] of Object.entries(resolvedSearchParams)) {
    if (Array.isArray(value)) {
      for (const item of value) {
        query.append(key, item);
      }
      continue;
    }

    if (typeof value === 'string') {
      query.set(key, value);
    }
  }

  redirect(query.size > 0 ? `/verify/${uuid}?${query.toString()}` : `/verify/${uuid}`);
}
