import { getPageMetadata } from "@/lib/seo";
import { Metadata } from "next";
import InternshipClient from './InternshipClient';

export async function generateMetadata(): Promise<Metadata> {
  return await getPageMetadata("/internship");
}

export default function InternshipPage() {
  return <InternshipClient />;
}
