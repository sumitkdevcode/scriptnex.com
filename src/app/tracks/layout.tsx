import { getPageMetadata } from "@/lib/seo";
import { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  return await getPageMetadata("/tracks");
}

export default function TracksLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
