import { redirect } from 'next/navigation';

interface LegacyDownloadPageProps {
  params: Promise<{
    uuid: string;
  }>;
}

export default async function LegacyDownloadPage({ params }: LegacyDownloadPageProps) {
  const { uuid } = await params;
  redirect(`/verify/${uuid}`);
}
