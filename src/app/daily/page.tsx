import { getPageMetadata } from "@/lib/seo";
import { Metadata } from "next";
import DailyClient from './DailyClient';

export async function generateMetadata(): Promise<Metadata> {
  return await getPageMetadata("/daily");
}

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'https://admin.scriptnex.com/api/v1';

async function getInitialData() {
  try {
    const [challengeRes, leaderRes] = await Promise.all([
      fetch(`${API_BASE}/daily-challenge`, {
        headers: { 'Accept': 'application/json' },
        next: { revalidate: 60 },
      }),
      fetch(`${API_BASE}/daily-challenge/leaderboard`, {
        headers: { 'Accept': 'application/json' },
        next: { revalidate: 60 },
      }),
    ]);

    const challengeData = challengeRes.ok ? await challengeRes.json() : null;
    const leaderData = leaderRes.ok ? await leaderRes.json() : null;

    return {
      challenge: challengeData?.data?.challenge || null,
      leaders: leaderData?.data?.leaderboard || [],
    };
  } catch {
    return { challenge: null, leaders: [] };
  }
}

export default async function DailyPage() {
  const { challenge, leaders } = await getInitialData();

  return (
    <DailyClient
      initialChallenge={challenge}
      initialLeaders={leaders}
    />
  );
}
