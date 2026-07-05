import { getPageMetadata } from "@/lib/seo";
import { Metadata } from "next";
import DiscussClient from './DiscussClient';

export async function generateMetadata(): Promise<Metadata> {
  return await getPageMetadata("/discuss");
}

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'https://admin.scriptnex.com/api/v1';

async function getInitialData() {
  try {
    const res = await fetch(`${API_BASE}/discussions`, {
      headers: { 'Accept': 'application/json' },
      next: { revalidate: 60 },
    });

    if (!res.ok) return { discussions: [] };

    const data = await res.json();
    return {
      discussions: data?.data?.discussions || [],
    };
  } catch {
    return { discussions: [] };
  }
}

export default async function DiscussPage() {
  const { discussions } = await getInitialData();

  return (
    <DiscussClient
      initialDiscussions={discussions}
    />
  );
}
