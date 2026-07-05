import { getPageMetadata } from "@/lib/seo";
import { Metadata } from "next";
import SheetsClient from './SheetsClient';

export async function generateMetadata(): Promise<Metadata> {
  return await getPageMetadata("/sheets");
}

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'https://admin.scriptnex.com/api/v1';

async function getInitialData() {
  try {
    const res = await fetch(`${API_BASE}/sheets`, {
      headers: { 'Accept': 'application/json' },
      next: { revalidate: 3600 },
    });

    if (!res.ok) return { sheets: [] };

    const data = await res.json();
    return {
      sheets: data?.data?.sheets || [],
    };
  } catch {
    return { sheets: [] };
  }
}

export default async function SheetsPage() {
  const { sheets } = await getInitialData();

  return (
    <SheetsClient initialSheets={sheets} />
  );
}
