import { Metadata } from 'next';

// Block all dashboard pages from search engine indexing — these are private user pages
export const metadata: Metadata = {
  title: 'Dashboard',
  robots: {
    index: false,
    follow: false,
    googleBot: {
      index: false,
      follow: false,
    },
  },
};

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
