import { getPageMetadata } from "@/lib/seo";
import { Metadata } from "next";
import InternVerificationClient from './InternVerificationClient';

export async function generateMetadata(): Promise<Metadata> {
  return await getPageMetadata("/intern-verification");
}

export default function InternVerificationPage() {
  return <InternVerificationClient />;
}
