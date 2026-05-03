'use client';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { api } from '@/lib/api';
import Link from 'next/link';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';

interface Lesson { id: number; title: string; slug: string; type: string; duration_minutes: number; }
interface Module { id: number; title: string; lessons: Lesson[]; }
interface TrackDetail { id: number; title: string; slug: string; description: string; difficulty: string; estimated_hours: number; }

const ICONS: Record<string, string> = { article: '📄', video: '🎬', problem: '⌨️' };

export default function TrackDetailPage() {
  const params = useParams();
  const [track, setTrack] = useState<TrackDetail | null>(null);
  const [modules, setModules] = useState<Module[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get<{ track: TrackDetail; modules: Module[] }>(`/tracks/${params.slug}`).then(r => {
      setTrack(r.data.track); setModules(r.data.modules); setLoading(false);
    });
  }, [params.slug]);

  if (loading || !track) return <div className="flex items-center justify-center min-h-screen bg-[#0f1115]"><div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#00d285]" /></div>;

  const totalLessons = modules.reduce((acc, m) => acc + m.lessons.length, 0);

  return (
    <div className="min-h-screen bg-[#0f1115] text-[#f8fafc]">
      <Navbar />
      <div className="max-w-4xl mx-auto px-6 py-8">
        <Link href="/tracks" className="text-sm text-[#64748b] hover:text-white mb-4 inline-block">← Back to Tracks</Link>
        <h1 className="text-3xl font-bold mb-3">{track.title}</h1>
        <p className="text-[#94a3b8] mb-6">{track.description}</p>
        <div className="flex gap-6 text-sm text-[#64748b] mb-10">
          <span className="capitalize">{track.difficulty}</span>
          <span>{track.estimated_hours}h</span>
          <span>{modules.length} modules</span>
          <span>{totalLessons} lessons</span>
        </div>
        <div className="space-y-6">
          {modules.map((mod, mi) => (
            <div key={mod.id} className="bg-[#16181d] border border-[#2a2d35] rounded-xl overflow-hidden">
              <div className="px-6 py-4 border-b border-[#2a2d35] flex items-center gap-3">
                <span className="w-7 h-7 rounded-lg bg-[#00d285]/10 text-[#00d285] flex items-center justify-center text-xs font-bold">{mi + 1}</span>
                <h2 className="font-semibold">{mod.title}</h2>
                <span className="text-xs text-[#64748b] ml-auto">{mod.lessons.length} lessons</span>
              </div>
              <div className="divide-y divide-[#2a2d35]/50">
                {mod.lessons.map(lesson => (
                  <Link key={lesson.id} href={`/tracks/${track.slug}/${lesson.slug}`} className="flex items-center gap-4 px-6 py-3.5 hover:bg-white/[0.02] transition-colors cursor-pointer">
                    <span className="text-lg">{ICONS[lesson.type] || '📄'}</span>
                    <div className="flex-1">
                      <span className="text-sm">{lesson.title}</span>
                    </div>
                    <span className="text-xs text-[#64748b]">{lesson.duration_minutes} min</span>
                    <span className="px-2 py-0.5 text-[10px] rounded bg-white/5 text-[#64748b] capitalize">{lesson.type}</span>
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
      <Footer />
    </div>
  );
}
