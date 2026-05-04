'use client';
import { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import Link from 'next/link';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';

import InfiniteScrollTrigger from '@/components/ui/InfiniteScrollTrigger';

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
  const [loadingMore, setLoadingMore] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);

  const fetchCerts = (page = 1, append = false) => {
    if (append) setLoadingMore(true);
    else setLoading(true);

    api.get<Cert[]>(`/certifications?page=${page}`).then(res => { 
      const r = res as any;
      if (append) {
        setCerts(prev => {
          const combined = [...prev, ...r.data];
          const unique = Array.from(new Map(combined.map(item => [item.id, item])).values());
          return unique;
        });
      } else {
        setCerts(r.data);
      }
      if (r.meta?.pagination) {
        setCurrentPage(r.meta.pagination.current_page);
        setLastPage(r.meta.pagination.last_page);
      }
      setLoading(false); 
      setLoadingMore(false);
    }).catch(() => {
      if (!append) setCerts([]);
      setLoading(false);
      setLoadingMore(false);
    });
  };

  useEffect(() => {
    fetchCerts(1);
  }, []);

  const loadMore = () => {
    if (currentPage < lastPage && !loadingMore) {
      fetchCerts(currentPage + 1, true);
    }
  };

  return (
    <div className="min-h-screen bg-[#0f1115] text-[#f8fafc]">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 pt-8 pb-6">
        <h1 className="text-2xl font-bold mb-0.5">Certifications</h1>
        <p className="text-[#ababab] text-sm mb-4">Earn verified certificates and prove your skills to employers</p>
        {loading ? (
          <div className="flex justify-center py-20"><div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#00d285]"></div></div>
        ) : (
          <>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mb-4">
              {certs.map(cert => (
                <Link key={cert.id} href={`/certifications/${cert.slug}`} className="bg-[#16181d] border border-[#2a2d35] rounded-md overflow-hidden hover:border-[#00d285]/20 transition-all group block">
                  <div className="h-1.5 bg-gradient-to-r from-[#00d285] to-[#00a669]" />
                  <div className="p-5">
                    <div className="flex items-center justify-between mb-2.5">
                      <span className="px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider" style={{ color: LEVEL_COLOR[cert.difficulty_level], backgroundColor: `${LEVEL_COLOR[cert.difficulty_level]}15` }}>
                        {cert.difficulty_level}
                      </span>
                      {cert.is_premium && <span className="px-1.5 py-0.5 text-[8px] font-black bg-amber-500/10 text-amber-400 rounded border border-amber-500/20">PRO</span>}
                    </div>
                    <h3 className="text-base font-bold mb-1.5 group-hover:text-[#00d285] transition-colors line-clamp-1">{cert.title}</h3>
                    <p className="text-[12px] text-[#ababab] mb-4 line-clamp-2 leading-relaxed">{cert.description}</p>
                    <div className="flex items-center gap-3 text-[10px] text-[#ababab]">
                      <span className="flex items-center gap-1"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg> {cert.duration_minutes}m</span>
                      <span className="flex items-center gap-1"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg> {cert.total_questions} Qs</span>
                    </div>
                  </div>
                </Link>
              ))}
              {certs.length === 0 && <div className="text-center py-20 text-[#ababab] col-span-full">No certifications found.</div>}
            </div>

            <InfiniteScrollTrigger 
              onIntersect={loadMore}
              isLoading={loadingMore}
              hasMore={currentPage < lastPage}
            />
          </>
        )}
      </div>
      <Footer />
    </div>
  );
}
