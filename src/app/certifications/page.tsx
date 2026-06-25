import { getPageMetadata } from "@/lib/seo";
import { Metadata } from "next";
import CertificationsClient from './CertificationsClient';

export async function generateMetadata(): Promise<Metadata> {
  return await getPageMetadata("/certifications");
}

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'https://admin.scriptnex.com/api/v1';

async function getInitialData() {
  try {
    const res = await fetch(`${API_BASE}/certifications?page=1`, {
      headers: { 'Accept': 'application/json' },
      next: { revalidate: 60 },
    });

    if (!res.ok) return { certs: [], pagination: { current_page: 1, last_page: 1 } };

    const data = await res.json();
    return {
      certs: data?.data || [],
      pagination: data?.meta?.pagination || { current_page: 1, last_page: 1 },
    };
  } catch {
    return { certs: [], pagination: { current_page: 1, last_page: 1 } };
  }
}

export default async function CertificationsPage() {
  const { certs, pagination } = await getInitialData();

  return (
    <CertificationsClient
      initialCerts={certs}
      initialPagination={pagination}
    />
  );
}
