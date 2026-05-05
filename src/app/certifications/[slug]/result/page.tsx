'use client';

import { useEffect, useState } from 'react';
import { useParams, useSearchParams, useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import Link from 'next/link';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { useAuth } from '@/contexts/AuthContext';
import DownloadButton from '@/components/certificate/DownloadButton';

interface AttemptResult {
  id: number;
  status: 'passed' | 'failed';
  score: number;
  total_possible: number;
  certificate_url?: string;
  certificate_uuid?: string;
  download_paid?: boolean;
  download_price_paise?: number | null;
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
  const { user } = useAuth();

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
  const downloadPrice = Math.round((result.download_price_paise ?? 0) / 100);

  return (
    <div className="min-h-screen flex flex-col bg-[#0f1115] text-[#f8fafc]">
      <Navbar />
      
      <main className="flex-1 w-full px-4 py-12 flex flex-col items-center justify-center relative overflow-hidden">
        {/* Background Decorative Elements to fill space */}
        <div className="absolute top-1/4 -left-20 w-96 h-96 bg-[#00d285]/5 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-[#00d285]/5 rounded-full blur-[120px] pointer-events-none" />

        <div className="max-w-2xl mx-auto w-full flex flex-col items-center justify-center relative z-10 px-4">
          <div className="bg-[#16181d] border border-[#2a2d35] rounded-xl w-full p-6 md:p-10 text-center relative overflow-hidden shadow-2xl">

          {/* Decorative glow */}
          <div className={`absolute top-0 left-1/2 -translate-x-1/2 w-48 h-24 blur-[60px] opacity-20 pointer-events-none ${
            isPassed ? 'bg-[#00d285]' : 'bg-red-500'
          }`} />

          <div className="relative z-10">
            {isPassed ? (
              <div className="relative w-full max-w-[280px] mx-auto aspect-[1.414] mb-5 bg-white overflow-hidden rounded-lg shadow-lg group cursor-pointer" 
                   onClick={() => result.certificate_url && router.push(result.certificate_url)}>
                {(() => {
                  const isPaid = result.download_paid;
                  return (
                    <>
                      <img 
                        src="/certificate.png" 
                        alt="Template" 
                        className={`absolute inset-0 w-full h-full object-cover ${!isPaid ? 'blur-[5px]' : ''}`} 
                      />
                      <div className={`absolute inset-0 flex flex-col items-center justify-center p-[6%] text-center scale-[0.3] origin-center whitespace-nowrap ${!isPaid ? 'blur-[5px]' : ''}`}>
                        <div className="flex-1"></div>
                        <h1 className="text-4xl font-bold text-gray-800 font-serif mb-2 uppercase">{user?.name || 'RECIPIENT NAME'}</h1>
                        <p className="text-xl text-gray-600 mb-4">has successfully completed</p>
                        <h2 className="text-3xl font-bold text-[#00d285]">{result.certification.title}</h2>
                        <div className="mt-auto"></div>
                      </div>
                      
                      {/* Lock Overlay for Unpaid Certificates */}
                      {!isPaid && (
                        <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center text-white">
                          <div className="bg-[#1a1c23] p-2 rounded-full mb-2 shadow-2xl border border-white/20">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#00d285" strokeWidth="2.5"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
                          </div>
                          <span className="text-[9px] font-bold uppercase tracking-widest text-[#00d285]">PDF Locked</span>
                        </div>
                      )}

                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                         <div className="opacity-0 group-hover:opacity-100 transition-opacity bg-[#00d285] text-black px-4 py-2 rounded-full font-bold text-[10px]">
                            {isPaid ? 'View PDF' : 'Unlock PDF'}
                         </div>
                      </div>
                    </>
                  );
                })()}
              </div>
            ) : (
              <div className="w-16 h-16 mx-auto rounded-full flex items-center justify-center mb-4 border-2 bg-red-500/10 border-red-500">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
              </div>
            )}

            <h1 className="text-2xl md:text-3xl font-black mb-2 tracking-tight">
              {isPassed ? 'Congratulations!' : 'Exam Failed'}
            </h1>
            <p className="text-sm text-[#ababab] mb-6 max-w-lg mx-auto leading-relaxed">
              {isPassed 
                ? `You passed the ${result.certification.title} exam.` 
                : `You did not meet the required score.`}
            </p>

            <div className="bg-[#1a1c23]/60 backdrop-blur-sm border border-[#2a2d35] rounded-xl p-6 mb-8 inline-block min-w-[240px] shadow-lg">
              <div className="text-[9px] uppercase tracking-[0.2em] text-[#ababab] font-bold mb-1.5">Score</div>
              <div className={`text-4xl font-black mb-1 ${isPassed ? 'text-[#00d285]' : 'text-red-500'} tracking-tighter`}>
                {percentage}%
              </div>
              <div className="text-xs text-[#f8fafc] font-medium mb-3">
                {result.score} <span className="text-[#ababab] font-normal">/</span> {result.total_possible}
              </div>
              <div className="pt-3 border-t border-[#2a2d35] flex items-center justify-center gap-3 text-[9px] font-bold uppercase tracking-wider text-[#ababab]">
                <span>Req: {result.certification.passing_score}%</span>
                <div className="w-1 h-1 rounded-full bg-[#2a2d35]" />
                <span className={isPassed ? 'text-[#00d285]' : 'text-red-500'}>
                  {isPassed ? 'PASSED' : 'FAILED'}
                </span>
              </div>
            </div>

            <div className="flex items-center justify-center gap-3">
              {isPassed && result.certificate_url ? (
                <DownloadButton 
                  cert={{
                    uuid: result.certificate_uuid || '',
                    certification: result.certification,
                    created_at: new Date().toISOString(),
                    percentage: percentage
                  }}
                  userName={user?.name || ''}
                  className="min-w-[140px] py-3 bg-[#00d285] text-black font-black rounded-lg hover:bg-[#00e691] transition-all text-sm shadow-lg hover:scale-[1.02] uppercase tracking-wide"
                  label={result.download_paid ? 'Download' : 'Unlock PDF'}
                />
              ) : (
                <Link 
                  href={`/certifications/${slug}`}
                  className="min-w-[140px] py-3 bg-[#00d285] text-black font-black rounded-lg hover:bg-[#00e691] transition-all text-sm text-center uppercase tracking-wide"
                >
                  Try Again
                </Link>
              )}
              
              <Link 
                href="/certifications"
                className="min-w-[140px] py-3 bg-[#1a1c23] border border-[#2a2d35] text-white font-bold rounded-lg hover:border-[#ababab] transition-all text-sm text-center hover:bg-[#21242c]"
              >
                Dashboard
              </Link>
            </div>

            {isPassed && result.certificate_url && (
              <div className="mt-8 flex flex-col items-center gap-2">
                <div className="px-4 py-1.5 bg-[#00d285]/10 rounded-full border border-[#00d285]/20 flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#00d285] animate-pulse" />
                  <span className="text-[11px] font-bold text-[#00d285] uppercase tracking-wider">
                    {result.download_paid ? 'Ready for high-res download' : 'PDF Download Locked'}
                  </span>
                </div>
                <p className="text-xs text-[#ababab]">
                  {result.download_paid
                    ? 'Your official credential is ready to save and share.'
                    : `Unlock your official PDF certificate for just ₹${downloadPrice}.`}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
    
    <Footer />
    </div>
  );
}
