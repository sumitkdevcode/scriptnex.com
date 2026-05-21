import { Metadata } from 'next';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'https://admin.scriptnex.com/api/v1';

interface PageProps {
  params: Promise<{
    username: string;
  }>;
}

async function getUser(username: string) {
  try {
    const res = await fetch(`${API_BASE}/users/${username}`, {
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
  const { username } = await params;
  const data = await getUser(username);
  const user = data?.data?.user;
  const stats = data?.data?.stats;

  if (!user) {
    return {
      title: 'User Not Found',
      description: 'The requested user profile could not be found on ScriptNex.',
      robots: { index: false, follow: false },
    };
  }

  const solvedText = stats?.problems_solved ? `${stats.problems_solved} problems solved` : '';
  const certsText = stats?.certificates_earned ? `${stats.certificates_earned} certificates earned` : '';
  const statsText = [solvedText, certsText].filter(Boolean).join(', ');

  const title = `${user.name} (@${user.username}) — Developer Profile`;
  const description = user.bio
    ? `${user.bio.substring(0, 120)}${statsText ? ` — ${statsText}` : ''} on ScriptNex.`
    : `${user.name} on ScriptNex.${statsText ? ` ${statsText}.` : ''} View their coding profile, certifications, and activity.`;

  return {
    title,
    description,
    alternates: {
      canonical: `https://scriptnex.com/${username}`,
    },
    openGraph: {
      title,
      description,
      url: `https://scriptnex.com/${username}`,
      type: 'profile',
      ...(user.avatar ? { images: [{ url: user.avatar, alt: `${user.name} profile picture` }] } : {}),
    },
    twitter: {
      card: 'summary',
      title,
      description,
    },
  };
}

export { default } from './ProfileClient';
