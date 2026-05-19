import { getPageMetadata } from "@/lib/seo";
import { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  return await getPageMetadata("/discuss");
}

export default function DiscussLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
