'use client';
import { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import Link from 'next/link';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';

interface Cert {
  id: number; title: string; slug: string; description: string;
  difficulty_level: string; duration_minutes: number; total_questions: number;
  is_premium: boolean; badge_image_url: string | null;
  category: { name: string; slug: string } | null;
}

const LEVEL_COLOR: Record<string, string> = { beginner: '#00d285', intermediate: '#f59e0b', advanced: '#ef4444' };

export default function CertificationsPage() {
  const [certs, setCerts] = useState<Cert[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get<{ certifications: Cert[] }>('/certifications').then(res => { setCerts(res.data.certifications); setLoading(false); });
  }, []);

  return (
    <div className="min-h-screen bg-[#0f1115] text-[#f8fafc]">
      <Navbar />
      <div className="max-w-5xl mx-auto px-6 py-8">
        <h1 className="text-3xl font-bold mb-2">Certifications</h1>
        <p className="text-[#94a3b8] mb-8">Earn verified certificates and prove your skills to employers</p>
        {loading ? (
          <div className="flex justify-center py-20"><div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#00d285]"></div></div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {certs.map(cert => (
              <Link key={cert.id} href={`/certifications/${cert.slug}`} className="bg-[#16181d] border border-[#2a2d35] rounded-xl overflow-hidden hover:border-[#00d285]/20 transition-all group block">
                <div className="h-2 bg-gradient-to-r from-[#00d285] to-[#00a669]" />
                <div className="p-6">
                  <div className="flex items-center justify-between mb-3">
                    <span className="px-2.5 py-1 rounded text-[10px] font-bold uppercase tracking-wider" style={{ color: LEVEL_COLOR[cert.difficulty_level], backgroundColor: `${LEVEL_COLOR[cert.difficulty_level]}15` }}>
                      {cert.difficulty_level}
                    </span>
                    {cert.is_premium && <span className="px-2 py-0.5 text-[9px] font-bold bg-amber-500/10 text-amber-400 rounded">PRO</span>}
                  </div>
                  <h3 className="text-lg font-semibold mb-2 group-hover:text-[#00d285] transition-colors">{cert.title}</h3>
                  <p className="text-sm text-[#94a3b8] mb-4 line-clamp-2">{cert.description}</p>
                  <div className="flex items-center gap-4 text-xs text-[#64748b]">
                    <span>⏱ {cert.duration_minutes} min</span>
                    <span>📝 {cert.total_questions} questions</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
}
