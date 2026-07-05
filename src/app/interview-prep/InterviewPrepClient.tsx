'use client';

import { useState } from 'react';
import Link from 'next/link';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';

interface Kit {
  id: number; slug: string; title: string; company_name: string; company_logo?: string; description: string; difficulty_level: string; total_problems: number;
}

interface InterviewPrepClientProps {
  initialKits: Kit[];
}

export default function InterviewPrepClient({ initialKits }: InterviewPrepClientProps) {
  const [kits] = useState<Kit[]>(initialKits);

  const diffColor: Record<string, string> = { beginner: '#00d285', intermediate: '#f59e0b', advanced: '#ef4444' };
  const companyEmojis: Record<string, string> = { Google: '🔍', Amazon: '📦', Microsoft: '🪟', Meta: '👤', TCS: '💼', Infosys: '💻' };

  return (
    <div className="min-h-screen flex flex-col bg-[#0f1115] text-[#f8fafc]">
      <Navbar />
      <main className="flex-1 w-full max-w-6xl mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-[#ef4444]/10 text-[#ef4444] text-xs font-bold uppercase tracking-widest px-4 py-2 rounded-full mb-4">🎯 Interview Prep</div>
          <h1 className="text-4xl md:text-5xl font-black mb-3">Interview Preparation Kits</h1>
          <p className="text-[#ababab] text-lg max-w-xl mx-auto">Company-specific problem sets curated for your interview success.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {kits.map(kit => (
            <Link key={kit.slug} href={`/interview-prep/${kit.slug}`} className="group bg-[#16181d] border border-[#2a2d35] rounded-2xl p-6 hover:border-[#ef4444]/30 transition-all relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#ef4444]/5 rounded-full blur-[60px] pointer-events-none" />
              <div className="relative z-10">
                <div className="text-4xl mb-3">{companyEmojis[kit.company_name] || '🏢'}</div>
                <h2 className="text-lg font-bold mb-1 group-hover:text-[#ef4444] transition-colors">{kit.company_name}</h2>
                <p className="text-xs text-[#ababab] mb-3">{kit.title}</p>
                <p className="text-sm text-[#ababab] mb-4 line-clamp-2">{kit.description}</p>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-[#ababab]">{kit.total_problems} problems</span>
                  <span style={{ color: diffColor[kit.difficulty_level] }} className="font-bold capitalize">{kit.difficulty_level}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {kits.length === 0 && (
          <div className="text-center py-20 text-[#ababab]">
            <p>No interview kits available yet. Check back soon!</p>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}
