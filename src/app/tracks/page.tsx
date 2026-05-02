'use client';
import { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import Link from 'next/link';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';

interface TrackItem { id: number; title: string; slug: string; description: string; difficulty: string; estimated_hours: number; is_premium: boolean; modules_count: number; lessons_count: number; }
const LEVEL_COLOR: Record<string, string> = { beginner: '#00d285', intermediate: '#f59e0b', advanced: '#ef4444' };

export default function TracksPage() {
  const [tracks, setTracks] = useState<TrackItem[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => { api.get<{ tracks: TrackItem[] }>('/tracks').then(r => { setTracks(r.data.tracks); setLoading(false); }); }, []);

  return (
    <div className="min-h-screen bg-[#0f1115] text-[#f8fafc]">
      <Navbar />
      <div className="max-w-5xl mx-auto px-6 py-8">
        <h1 className="text-3xl font-bold mb-2">Learning Tracks</h1>
        <p className="text-[#94a3b8] mb-8">Structured learning paths to master programming</p>
        {loading ? (
          <div className="flex justify-center py-20"><div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#00d285]" /></div>
        ) : (
          <div className="space-y-4">
            {tracks.map(track => (
              <Link key={track.id} href={`/tracks/${track.slug}`} className="bg-[#16181d] border border-[#2a2d35] rounded-xl p-6 flex items-center gap-6 hover:border-[#00d285]/20 transition-all group block">
                <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-[#00d285]/20 to-[#00a669]/10 flex items-center justify-center text-2xl shrink-0">📚</div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="text-lg font-semibold group-hover:text-[#00d285] transition-colors">{track.title}</h3>
                    {track.is_premium && <span className="px-2 py-0.5 text-[9px] font-bold bg-amber-500/10 text-amber-400 rounded">PRO</span>}
                  </div>
                  <p className="text-sm text-[#94a3b8] line-clamp-1 mb-2">{track.description}</p>
                  <div className="flex gap-4 text-xs text-[#64748b]">
                    <span className="capitalize" style={{ color: LEVEL_COLOR[track.difficulty] }}>{track.difficulty}</span>
                    <span>{track.estimated_hours}h estimated</span>
                    <span>{track.modules_count} modules</span>
                    <span>{track.lessons_count} lessons</span>
                  </div>
                </div>
                <svg className="text-[#64748b] group-hover:text-[#00d285] transition-colors shrink-0" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m9 18 6-6-6-6"/></svg>
              </Link>
            ))}
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
}
