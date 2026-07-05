import { getPageMetadata } from "@/lib/seo";
import { Metadata } from "next";
import InterviewPrepClient from './InterviewPrepClient';

export async function generateMetadata(): Promise<Metadata> {
  return await getPageMetadata("/interview-prep");
}

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'https://admin.scriptnex.com/api/v1';

async function getInitialData() {
  try {
    const res = await fetch(`${API_BASE}/interview-kits`, {
      headers: { 'Accept': 'application/json' },
      next: { revalidate: 3600 },
    });

    if (!res.ok) return { kits: [] };

    const data = await res.json();
    return {
      kits: data?.data?.kits || [],
    };
  } catch {
    return { kits: [] };
  }
}

export default async function InterviewPrepPage() {
  const { kits } = await getInitialData();

  return (
    <InterviewPrepClient initialKits={kits} />
  );
}
