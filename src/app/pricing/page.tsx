import { getPageMetadata } from "@/lib/seo";
import { Metadata } from "next";
import PricingClient from './PricingClient';

export async function generateMetadata(): Promise<Metadata> {
  return await getPageMetadata("/pricing");
}

export default function PricingPage() {
  return <PricingClient />;
}
