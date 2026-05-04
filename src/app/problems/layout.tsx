import { getPageMetadata } from "@/lib/seo";
import { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  return await getPageMetadata("/problems");
}

export default function ProblemsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
