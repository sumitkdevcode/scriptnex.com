import { getPageMetadata } from "@/lib/seo";
import { Metadata } from "next";
import ProblemsClient from './ProblemsClient';

export async function generateMetadata(): Promise<Metadata> {
  return await getPageMetadata("/problems");
}

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'https://admin.scriptnex.com/api/v1';

async function getInitialData() {
  try {
    const [problemsRes, categoriesRes] = await Promise.all([
      fetch(`${API_BASE}/problems?page=1`, {
        headers: { 'Accept': 'application/json' },
        next: { revalidate: 60 },
      }),
      fetch(`${API_BASE}/categories`, {
        headers: { 'Accept': 'application/json' },
        next: { revalidate: 3600 },
      }),
    ]);

    const problemsData = problemsRes.ok ? await problemsRes.json() : null;
    const categoriesData = categoriesRes.ok ? await categoriesRes.json() : null;

    return {
      problems: problemsData?.data || [],
      categories: categoriesData?.data?.categories || [],
      pagination: problemsData?.meta?.pagination || { current_page: 1, last_page: 1, total: 0 },
    };
  } catch {
    return {
      problems: [],
      categories: [],
      pagination: { current_page: 1, last_page: 1, total: 0 },
    };
  }
}

export default async function ProblemsPage() {
  const { problems, categories, pagination } = await getInitialData();

  return (
    <ProblemsClient
      initialProblems={problems}
      initialCategories={categories}
      initialPagination={pagination}
    />
  );
}
