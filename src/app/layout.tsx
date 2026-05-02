import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/contexts/AuthContext";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: {
    default: "ScriptNex — Code. Certify. Excel.",
    template: "%s | ScriptNex",
  },
  description:
    "Practice coding challenges, earn certifications, and compete in programming contests on ScriptNex — India's premier competitive programming platform.",
  keywords: [
    "competitive programming",
    "coding challenges",
    "programming contests",
    "coding certifications",
    "learn to code",
    "ScriptNex",
    "HackerRank alternative",
    "coding practice",
  ],
  authors: [{ name: "ScriptNex" }],
  openGraph: {
    type: "website",
    siteName: "ScriptNex",
    title: "ScriptNex — Code. Certify. Excel.",
    description:
      "Practice coding challenges, earn certifications, and compete in programming contests.",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "ScriptNex — Code. Certify. Excel.",
    description:
      "Practice coding challenges, earn certifications, and compete in programming contests.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col font-[family-name:var(--font-inter)]">
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
