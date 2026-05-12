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
    default: "ScriptNex — Programming & Learning Education Platform for Certifications",
    template: "%s | ScriptNex",
  },
  description:
    "Master programming with ScriptNex. Enhance your learning education through interactive coding challenges, structured tracks, and earn a verified ScriptNex certificate.",
  keywords: [
    "learning education",
    "learning",
    "programming",
    "certificate scriptnex",
    "scriptnex",
    "coding certifications",
    "programming courses",
    "learn to code",
    "tech education",
    "competitive programming",
  ],
  authors: [{ name: "ScriptNex" }],
  openGraph: {
    type: "website",
    siteName: "ScriptNex",
    title: "ScriptNex — Programming & Learning Education Platform",
    description:
      "Master programming with ScriptNex. Enhance your learning education and earn a verified ScriptNex certificate.",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "ScriptNex — Programming & Learning Education Platform",
    description:
      "Master programming with ScriptNex. Enhance your learning education and earn a verified ScriptNex certificate.",
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
