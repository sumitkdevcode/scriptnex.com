import { getPageMetadata } from "@/lib/seo";
import { Metadata } from "next";
import ContestsClient from './ContestsClient';

export async function generateMetadata(): Promise<Metadata> {
  return await getPageMetadata("/contests");
}

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'https://admin.scriptnex.com/api/v1';

async function getInitialData() {
  try {
    const res = await fetch(`${API_BASE}/contests?page=1`, {
      headers: { 'Accept': 'application/json' },
      next: { revalidate: 60 },
    });

    if (!res.ok) return { contests: [], pagination: { current_page: 1, last_page: 1 } };

    const data = await res.json();
    return {
      contests: data?.data || [],
      pagination: data?.meta?.pagination || { current_page: 1, last_page: 1 },
    };
  } catch {
    return { contests: [], pagination: { current_page: 1, last_page: 1 } };
  }
}

export default async function ContestsPage() {
  const { contests, pagination } = await getInitialData();

  return (
    <ContestsClient
      initialContests={contests}
      initialPagination={pagination}
    />
  );
}
