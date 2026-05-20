'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { api } from '@/lib/api';
import Link from 'next/link';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';

interface SheetProblem {
  id: number; title: string; slug: string; difficulty: string; section: string; solved: boolean;
}

interface SheetDetail {
  id: number; slug: string; title: string; description: string; author: string; icon: string; total_problems: number;
  problems: SheetProblem[]; solved_count: number;
}

export default function SheetDetailPage() {
  const params = useParams();
  const slug = params.slug as string;
  const [sheet, setSheet] = useState<SheetDetail | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get<{ sheet: SheetDetail }>(`/sheets/${slug}`).then(r => setSheet(r.data.sheet)).catch(() => {}).finally(() => setLoading(false));
  }, [slug]);

  if (loading) return <div className="min-h-screen bg-[#0f1115] flex items-center justify-center"><div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-[#00d285]" /></div>;
  if (!sheet) return null;

  const diffColor: Record<string, string> = { easy: '#00d285', medium: '#f59e0b', hard: '#ef4444' };
  const sections = [...new Set(sheet.problems.map(p => p.section))];
  const progress = sheet.total_problems > 0 ? Math.round((sheet.solved_count / sheet.total_problems) * 100) : 0;

  return (
    <div className="min-h-screen flex flex-col bg-[#0f1115] text-[#f8fafc]">
      <Navbar />
      <main className="flex-1 w-full max-w-4xl mx-auto px-4 py-12">
        <div className="mb-8">
          <Link href="/sheets" className="text-[#ababab] text-sm hover:text-white transition-colors mb-4 inline-block">← Back to Sheets</Link>
          <div className="flex items-start gap-4">
            <span className="text-4xl">{sheet.icon}</span>
            <div className="flex-1">
              <h1 className="text-3xl font-black mb-2">{sheet.title}</h1>
              <p className="text-[#ababab] text-sm mb-4">{sheet.description}</p>
              <div className="flex items-center gap-4">
                <div className="flex-1 max-w-xs bg-[#2a2d35] rounded-full h-2">
                  <div className="bg-[#00d285] h-2 rounded-full transition-all" style={{ width: `${progress}%` }} />
                </div>
                <span className="text-sm font-bold text-[#00d285]">{sheet.solved_count}/{sheet.total_problems}</span>
              </div>
            </div>
          </div>
        </div>

        {sections.map(section => (
          <div key={section} className="mb-8">
            <h2 className="text-lg font-bold mb-3 flex items-center gap-2">
              <div className="w-1 h-5 bg-[#8b5cf6] rounded-full" />
              {section}
            </h2>
            <div className="bg-[#16181d] border border-[#2a2d35] rounded-xl overflow-hidden">
              {sheet.problems.filter(p => p.section === section).map((p, i) => (
                <Link key={p.id} href={`/problems/${p.slug}`} className={`flex items-center gap-4 px-5 py-3.5 hover:bg-[#1a1c23] transition-colors ${i > 0 ? 'border-t border-[#2a2d35]' : ''}`}>
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${p.solved ? 'border-[#00d285] bg-[#00d285]/20' : 'border-[#2a2d35]'}`}>
                    {p.solved && <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#00d285" strokeWidth="3"><polyline points="20 6 9 17 4 12" /></svg>}
                  </div>
                  <span className="flex-1 text-sm font-medium">{p.title}</span>
                  <span style={{ color: diffColor[p.difficulty] || '#00d285' }} className="text-xs font-bold capitalize">{p.difficulty}</span>
                </Link>
              ))}
            </div>
          </div>
        ))}
      </main>
      <Footer />
    </div>
  );
}
