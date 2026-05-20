'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { api } from '@/lib/api';
import Link from 'next/link';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';

interface KitProblem { id: number; title: string; slug: string; difficulty: string; round: string; solved: boolean; }
interface KitDetail { id: number; slug: string; title: string; company_name: string; description: string; total_problems: number; problems: KitProblem[]; solved_count: number; }

export default function InterviewKitDetailPage() {
  const params = useParams();
  const slug = params.slug as string;
  const [kit, setKit] = useState<KitDetail | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get<{ kit: KitDetail }>(`/interview-kits/${slug}`).then(r => setKit(r.data.kit)).catch(() => {}).finally(() => setLoading(false));
  }, [slug]);

  if (loading) return <div className="min-h-screen bg-[#0f1115] flex items-center justify-center"><div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-[#00d285]" /></div>;
  if (!kit) return null;

  const diffColor: Record<string, string> = { easy: '#00d285', medium: '#f59e0b', hard: '#ef4444' };
  const rounds = [...new Set(kit.problems.map(p => p.round))];
  const progress = kit.total_problems > 0 ? Math.round((kit.solved_count / kit.total_problems) * 100) : 0;

  return (
    <div className="min-h-screen flex flex-col bg-[#0f1115] text-[#f8fafc]">
      <Navbar />
      <main className="flex-1 w-full max-w-4xl mx-auto px-4 py-12">
        <Link href="/interview-prep" className="text-[#ababab] text-sm hover:text-white transition-colors mb-4 inline-block">← Back to Interview Kits</Link>
        <div className="mb-8">
          <h1 className="text-3xl font-black mb-2">{kit.title}</h1>
          <p className="text-[#ababab] text-sm mb-4">{kit.description}</p>
          <div className="flex items-center gap-4">
            <div className="flex-1 max-w-xs bg-[#2a2d35] rounded-full h-2">
              <div className="bg-[#ef4444] h-2 rounded-full transition-all" style={{ width: `${progress}%` }} />
            </div>
            <span className="text-sm font-bold text-[#ef4444]">{kit.solved_count}/{kit.total_problems}</span>
          </div>
        </div>

        {rounds.map(round => (
          <div key={round} className="mb-8">
            <h2 className="text-lg font-bold mb-3 flex items-center gap-2"><div className="w-1 h-5 bg-[#ef4444] rounded-full" />{round}</h2>
            <div className="bg-[#16181d] border border-[#2a2d35] rounded-xl overflow-hidden">
              {kit.problems.filter(p => p.round === round).map((p, i) => (
                <Link key={p.id} href={`/problems/${p.slug}`} className={`flex items-center gap-4 px-5 py-3.5 hover:bg-[#1a1c23] transition-colors ${i > 0 ? 'border-t border-[#2a2d35]' : ''}`}>
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${p.solved ? 'border-[#00d285] bg-[#00d285]/20' : 'border-[#2a2d35]'}`}>
                    {p.solved && <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#00d285" strokeWidth="3"><polyline points="20 6 9 17 4 12" /></svg>}
                  </div>
                  <span className="flex-1 text-sm font-medium">{p.title}</span>
                  <span style={{ color: diffColor[p.difficulty] }} className="text-xs font-bold capitalize">{p.difficulty}</span>
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
