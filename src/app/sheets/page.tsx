'use client';

import { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import Link from 'next/link';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';

interface Sheet {
  id: number; slug: string; title: string; description: string; author: string; total_problems: number; is_featured: boolean; icon: string;
}

export default function SheetsPage() {
  const [sheets, setSheets] = useState<Sheet[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get<{ sheets: Sheet[] }>('/sheets').then(r => setSheets(r.data.sheets)).finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <div className="min-h-screen bg-[#0f1115] flex items-center justify-center"><div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-[#00d285]" /></div>;
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#0f1115] text-[#f8fafc]">
      <Navbar />
      <main className="flex-1 w-full max-w-6xl mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-[#8b5cf6]/10 text-[#8b5cf6] text-xs font-bold uppercase tracking-widest px-4 py-2 rounded-full mb-4">📋 Coding Sheets</div>
          <h1 className="text-4xl md:text-5xl font-black mb-3">Curated Problem Lists</h1>
          <p className="text-[#ababab] text-lg max-w-xl mx-auto">Follow structured problem lists to master DSA systematically.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {sheets.map(sheet => (
            <Link key={sheet.slug} href={`/sheets/${sheet.slug}`} className="group bg-[#16181d] border border-[#2a2d35] rounded-2xl p-6 hover:border-[#8b5cf6]/50 transition-all relative overflow-hidden">
              {sheet.is_featured && <div className="absolute top-4 right-4 bg-[#f59e0b]/10 text-[#f59e0b] text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-full">Featured</div>}
              <div className="text-3xl mb-3">{sheet.icon}</div>
              <h2 className="text-xl font-bold mb-2 group-hover:text-[#8b5cf6] transition-colors">{sheet.title}</h2>
              <p className="text-sm text-[#ababab] mb-4 line-clamp-2">{sheet.description}</p>
              <div className="flex items-center gap-4 text-xs text-[#ababab]">
                <span className="flex items-center gap-1"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg> {sheet.total_problems} problems</span>
                <span>by {sheet.author}</span>
              </div>
            </Link>
          ))}
        </div>
      </main>
      <Footer />
    </div>
  );
}
