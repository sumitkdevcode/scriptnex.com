import { getPageMetadata } from "@/lib/seo";
import { Metadata } from "next";
import LeaderboardClient from './LeaderboardClient';

export async function generateMetadata(): Promise<Metadata> {
  return await getPageMetadata("/leaderboard");
}

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'https://admin.scriptnex.com/api/v1';

async function getInitialData() {
  try {
    const res = await fetch(`${API_BASE}/leaderboard?page=1`, {
      headers: { 'Accept': 'application/json' },
      next: { revalidate: 60 },
    });

    if (!res.ok) return { leaders: [], pagination: { current_page: 1, last_page: 1, per_page: 20 } };

    const data = await res.json();
    return {
      leaders: data?.data || [],
      pagination: data?.meta?.pagination || { current_page: 1, last_page: 1, per_page: 20 },
    };
  } catch {
    return { leaders: [], pagination: { current_page: 1, last_page: 1, per_page: 20 } };
  }
}

export default async function LeaderboardPage() {
  const { leaders, pagination } = await getInitialData();

  return (
    <LeaderboardClient
      initialLeaders={leaders}
      initialPagination={pagination}
    />
  );
}
