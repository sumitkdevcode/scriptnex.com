import { getPageMetadata } from "@/lib/seo";
import { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  return await getPageMetadata("/contests");
}

export default function ContestsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
