import { getPageMetadata } from "@/lib/seo";
import { Metadata } from "next";
import PlaygroundClient from './PlaygroundClient';

export async function generateMetadata(): Promise<Metadata> {
  return await getPageMetadata("/playground");
}

export default function PlaygroundPage() {
  return <PlaygroundClient />;
}
