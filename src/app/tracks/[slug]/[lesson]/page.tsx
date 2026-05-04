'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { api } from '@/lib/api';
import Link from 'next/link';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';

interface Lesson {
  id: number; title: string; slug: string; type: string;
  content: string | null; video_url: string | null; duration_minutes: number;
  problem?: { id: number; title: string; slug: string } | null;
}
interface Module {
  id: number; title: string; order: number;
  lessons: { id: number; title: string; slug: string; type: string; duration_minutes: number }[];
}
interface TrackDetail {
  id: number; title: string; slug: string;
}

const TYPE_ICON: Record<string, string> = { article: '📄', video: '🎬', problem: '⌨️' };
const TYPE_COLOR: Record<string, string> = { article: '#3b82f6', video: '#f59e0b', problem: '#00d285' };

export default function LessonPage() {
  const params = useParams();
  const trackSlug = params.slug as string;
  const lessonSlug = params.lesson as string;

  const [track, setTrack] = useState<TrackDetail | null>(null);
  const [lesson, setLesson] = useState<Lesson | null>(null);
  const [modules, setModules] = useState<Module[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function loadLesson() {
      try {
        const trackResponse = await api.get<{ track: TrackDetail; modules: Module[] }>(`/tracks/${trackSlug}`);
        if (cancelled) {
          return;
        }

        setTrack(trackResponse.data.track);
        setModules(trackResponse.data.modules);

        const fallbackLesson = trackResponse.data.modules
          .flatMap((module) => module.lessons)
          .find((candidate) => candidate.slug === lessonSlug);

        if (!fallbackLesson) {
          setLesson(null);
          return;
        }

        try {
          const lessonResponse = await api.get<{ lesson: Lesson }>(`/tracks/${trackSlug}/lessons/${lessonSlug}`);
          if (!cancelled) {
            setLesson(lessonResponse.data.lesson);
          }
        } catch {
          if (!cancelled) {
            setLesson({ ...fallbackLesson, content: null, video_url: null });
          }
        }
      } catch {
        if (!cancelled) {
          setLesson(null);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    void loadLesson();

    return () => {
      cancelled = true;
    };
  }, [trackSlug, lessonSlug]);

  const allLessons = modules.flatMap(m => m.lessons);
  const currentIdx = allLessons.findIndex(l => l.slug === lessonSlug);
  const prevLesson = currentIdx > 0 ? allLessons[currentIdx - 1] : null;
  const nextLesson = currentIdx < allLessons.length - 1 ? allLessons[currentIdx + 1] : null;

  if (loading) return (
    <div className="min-h-screen bg-[#0f1115] text-[#f8fafc]"><Navbar />
      <div className="flex justify-center py-32"><div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-[#00d285]" /></div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#0f1115] text-[#f8fafc] flex flex-col">
      <Navbar />
      <div className="flex flex-1 max-w-7xl mx-auto w-full px-4 pt-0 pb-6 gap-8">
        {/* Sidebar */}
        <aside className="hidden lg:block w-72 shrink-0">
          <div className="bg-[#16181d] border border-[#2a2d35] rounded-xl overflow-hidden sticky top-20">
            <div className="px-3 py-2 border-b border-[#2a2d35]">
              <Link href={`/tracks/${trackSlug}`} className="text-[10px] text-[#ababab] hover:text-[#00d285] transition-colors">
                ← {track?.title}
              </Link>
            </div>
            <div className="overflow-y-auto max-h-[75vh]">
              {modules.map((mod, mi) => (
                <div key={mod.id}>
                  <div className="px-4 py-1.5 bg-[#0f1115]/60">
                    <span className="text-[9px] uppercase tracking-widest text-[#ababab] font-semibold">
                      Module {mi + 1}: {mod.title}
                    </span>
                  </div>
                  {mod.lessons.map(l => (
                    <Link
                      key={l.id}
                      href={`/tracks/${trackSlug}/${l.slug}`}
                      className={`flex items-center gap-3 px-4 py-2 text-sm transition-colors border-l-2 ${
                        l.slug === lessonSlug
                          ? 'border-[#00d285] bg-[#00d285]/5 text-[#00d285]'
                          : 'border-transparent text-[#ababab] hover:text-white hover:bg-white/[0.02]'
                      }`}
                    >
                      <span className="text-xs">{TYPE_ICON[l.type] || '📄'}</span>
                      <span className="flex-1 truncate text-xs">{l.title}</span>
                      <span className="text-[9px] text-[#ababab] shrink-0">{l.duration_minutes}m</span>
                    </Link>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 min-w-0">
          {lesson ? (
            <>
              <div className="mb-4">
                <div className="flex items-center gap-2 mb-2">
                  <span
                    className="text-[9px] uppercase tracking-widest font-bold px-2 py-0.5 rounded-full"
                    style={{ color: TYPE_COLOR[lesson.type] || '#ababab', background: `${TYPE_COLOR[lesson.type]}15` }}
                  >
                    {TYPE_ICON[lesson.type]} {lesson.type}
                  </span>
                  <span className="text-[10px] text-[#ababab]">{lesson.duration_minutes} min read</span>
                </div>
                <h1 className="text-xl font-bold mb-1.5">{lesson.title}</h1>
              </div>

              {/* Video */}
              {lesson.video_url && (
                <div className="aspect-video bg-[#16181d] border border-[#2a2d35] rounded-xl overflow-hidden mb-4">
                  <iframe
                    src={lesson.video_url.replace('watch?v=', 'embed/')}
                    className="w-full h-full"
                    allowFullScreen
                    title={lesson.title}
                  />
                </div>
              )}

              {/* Article Content */}
              {lesson.content ? (
                <div className="bg-[#16181d] border border-[#2a2d35] rounded-xl p-6 mb-4 prose prose-invert max-w-none">
                  <div className="text-[#cbd5e1] leading-relaxed whitespace-pre-wrap text-[13px]">{lesson.content}</div>
                </div>
              ) : lesson.problem ? (
                <div className="bg-[#16181d] border border-[#2a2d35] rounded-xl p-6 mb-4">
                  <div className="text-xs text-[#ababab] mb-3">This lesson is a guided coding exercise.</div>
                  <Link
                    href={`/problems/${lesson.problem.slug}`}
                    className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#00d285] text-black font-bold rounded-xl text-xs hover:bg-[#00e691] transition-colors"
                  >
                    Open Problem: {lesson.problem.title}
                  </Link>
                </div>
              ) : !lesson.video_url ? (
                <div className="bg-[#16181d] border border-[#2a2d35] border-dashed rounded-xl p-8 text-center mb-4">
                  <div className="text-4xl mb-3">{TYPE_ICON[lesson.type] || '📄'}</div>
                  <p className="text-[#ababab] text-xs">Content for this lesson is being prepared.</p>
                </div>
              ) : null}

              {/* Navigation */}
              <div className="flex items-center justify-between pt-4 border-t border-[#2a2d35] gap-2">
                {prevLesson ? (
                  <Link href={`/tracks/${trackSlug}/${prevLesson.slug}`}
                    className="flex items-center gap-2 px-3 sm:px-4 py-2 sm:py-2.5 bg-[#16181d] border border-[#2a2d35] rounded-xl text-xs sm:text-sm hover:border-[#00d285]/30 transition-colors group min-w-0">
                    <span className="text-[#ababab] group-hover:text-white shrink-0">←</span>
                    <div className="min-w-0">
                      <div className="text-[9px] sm:text-[10px] text-[#ababab] uppercase tracking-wider">Prev</div>
                      <div className="font-medium text-[10px] sm:text-xs truncate max-w-[80px] sm:max-w-[180px]">{prevLesson.title}</div>
                    </div>
                  </Link>
                ) : <div />}
                {nextLesson ? (
                  <Link href={`/tracks/${trackSlug}/${nextLesson.slug}`}
                    className="flex items-center gap-2 px-3 sm:px-4 py-2 sm:py-2.5 bg-[#00d285]/10 border border-[#00d285]/20 rounded-xl text-xs sm:text-sm hover:bg-[#00d285]/20 transition-colors group text-right min-w-0">
                    <div className="min-w-0">
                      <div className="text-[9px] sm:text-[10px] text-[#00d285] uppercase tracking-wider">Next</div>
                      <div className="font-medium text-[10px] sm:text-xs text-[#00d285] truncate max-w-[80px] sm:max-w-[180px]">{nextLesson.title}</div>
                    </div>
                    <span className="text-[#00d285] shrink-0">→</span>
                  </Link>
                ) : (
                  <Link href={`/tracks/${trackSlug}`}
                    className="px-4 py-2 sm:py-2.5 bg-[#00d285] text-black font-bold rounded-xl text-xs sm:text-sm hover:bg-[#00e691] transition-colors shrink-0">
                    🎉 Done
                  </Link>
                )}
              </div>
            </>
          ) : (
            <div className="text-center py-20 text-[#ababab]">Lesson not found.</div>
          )}
        </main>
      </div>
      <Footer />
    </div>
  );
}
