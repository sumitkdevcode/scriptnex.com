'use client';

import { useEffect, useState } from 'react';
import { useParams, useSearchParams, useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import Link from 'next/link';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';

interface AttemptResult {
  id: number;
  status: 'passed' | 'failed';
  score: number;
  total_possible: number;
  certificate_url?: string;
  certification: {
    title: string;
    passing_score: number;
  };
}

export default function CertificationResultPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const slug = params.slug as string;
  const attemptId = searchParams.get('attempt_id');
  const router = useRouter();

  const [result, setResult] = useState<AttemptResult | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!attemptId) {
      router.push(`/certifications/${slug}`);
      return;
    }

    async function loadResult() {
      try {
        const res = await api.get<{ result: AttemptResult }>(`/certifications/${slug}/result?attempt_id=${attemptId}`);
        setResult(res.data.result);
      } catch {
        // handle error
      } finally {
        setLoading(false);
      }
    }
    loadResult();
  }, [slug, attemptId, router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0f1115] flex items-center justify-center">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-[#00d285]"></div>
      </div>
    );
  }

  if (!result) return null;

  const percentage = Math.round((result.score / result.total_possible) * 100);
  const isPassed = result.status === 'passed';

  return (
    <div className="min-h-screen flex flex-col bg-[#0f1115] text-[#f8fafc]">
      <Navbar />
      
      <main className="flex-1 max-w-3xl mx-auto w-full px-4 py-20 flex flex-col items-center justify-center">
        <div className="bg-[#16181d] border border-[#2a2d35] rounded-2xl w-full p-10 text-center relative overflow-hidden">
          {/* Decorative glow */}
          <div className={`absolute top-0 left-1/2 -translate-x-1/2 w-64 h-32 blur-[80px] opacity-20 pointer-events-none ${
            isPassed ? 'bg-[#00d285]' : 'bg-red-500'
          }`} />

          <div className="relative z-10">
            <div className={`w-24 h-24 mx-auto rounded-full flex items-center justify-center mb-6 border-4 ${
              isPassed ? 'bg-[#00d285]/10 border-[#00d285]' : 'bg-red-500/10 border-red-500'
            }`}>
              {isPassed ? (
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#00d285" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
              ) : (
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
              )}
            </div>

            <h1 className="text-3xl font-bold mb-2">
              {isPassed ? 'Congratulations!' : 'Exam Failed'}
            </h1>
            <p className="text-[#94a3b8] mb-8">
              {isPassed 
                ? `You have successfully passed the ${result.certification.title} certification.` 
                : `You did not meet the required passing score for ${result.certification.title}.`}
            </p>

            <div className="bg-[#1a1c23] rounded-xl p-6 mb-8 inline-block min-w-[280px]">
              <div className="text-[10px] uppercase tracking-widest text-[#64748b] font-bold mb-1">Your Score</div>
              <div className={`text-5xl font-black mb-2 ${isPassed ? 'text-[#00d285]' : 'text-red-500'}`}>
                {percentage}%
              </div>
              <div className="text-sm text-[#94a3b8]">
                {result.score} out of {result.total_possible} points
              </div>
              <div className="mt-4 pt-4 border-t border-[#2a2d35] text-xs text-[#64748b]">
                Passing Score: {result.certification.passing_score}%
              </div>
            </div>

            <div className="flex items-center justify-center gap-4">
              {isPassed && result.certificate_url ? (
                <Link 
                  href={result.certificate_url}
                  className="px-6 py-3 bg-[#00d285] text-black font-bold rounded-xl hover:bg-[#00e691] transition-colors"
                >
                  View Certificate
                </Link>
              ) : (
                <Link 
                  href={`/certifications/${slug}`}
                  className="px-6 py-3 bg-[#00d285] text-black font-bold rounded-xl hover:bg-[#00e691] transition-colors"
                >
                  Try Again
                </Link>
              )}
              <Link 
                href="/certifications"
                className="px-6 py-3 bg-[#1a1c23] border border-[#2a2d35] text-white font-bold rounded-xl hover:border-[#475569] transition-colors"
              >
                Back to Certifications
              </Link>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
