import { getPageMetadata } from "@/lib/seo";
import { Metadata } from "next";
import TracksClient from './TracksClient';

export async function generateMetadata(): Promise<Metadata> {
  return await getPageMetadata("/tracks");
}

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'https://admin.scriptnex.com/api/v1';

async function getInitialData() {
  try {
    const res = await fetch(`${API_BASE}/tracks?page=1`, {
      headers: { 'Accept': 'application/json' },
      next: { revalidate: 60 },
    });

    if (!res.ok) return { tracks: [], pagination: { current_page: 1, last_page: 1 } };

    const data = await res.json();
    return {
      tracks: data?.data || [],
      pagination: data?.meta?.pagination || { current_page: 1, last_page: 1 },
    };
  } catch {
    return { tracks: [], pagination: { current_page: 1, last_page: 1 } };
  }
}

export default async function TracksPage() {
  const { tracks, pagination } = await getInitialData();

  return (
    <TracksClient
      initialTracks={tracks}
      initialPagination={pagination}
    />
  );
}
