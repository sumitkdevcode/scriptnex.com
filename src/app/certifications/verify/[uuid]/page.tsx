'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { api } from '@/lib/api';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import Link from 'next/link';

interface VerificationData {
  uuid: string;
  verification_url: string;
  user: {
    name: string;
    username: string;
  };
  certification: {
    title: string;
    difficulty_level: string;
  };
  score: number;
  percentage: number;
  issued_at: string;
}

export default function VerifyPage() {
  const { uuid } = useParams();
  const [data, setData] = useState<VerificationData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (uuid) {
      api.get<{ certificate: VerificationData }>(`/certifications/verify/${uuid}`)
        .then(res => {
          setData(res.data.certificate);
          setLoading(false);
        })
        .catch(() => {
          setError(true);
          setLoading(false);
        });
    }
  }, [uuid]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0f1115] text-white flex flex-col">
        <Navbar />
        <main className="flex-1 flex items-center justify-center">
          <div className="w-8 h-8 border-4 border-[#00d285] border-t-transparent rounded-full animate-spin"></div>
        </main>
        <Footer />
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="min-h-screen bg-[#0f1115] text-white flex flex-col">
        <Navbar />
        <main className="flex-1 flex flex-col items-center justify-center p-6 text-center">
          <h1 className="text-4xl font-bold mb-4">Certificate Not Found</h1>
          <p className="text-[#ababab] mb-8">The certificate you are trying to verify does not exist or is invalid.</p>
          <Link href="/" className="px-6 py-2 bg-[#00d285] text-black font-bold rounded-md">Back to Home</Link>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0f1115] text-white flex flex-col">
      <Navbar />
      <main className="flex-1 max-w-4xl mx-auto w-full px-6 py-12">
        <div className="bg-[#1a1c23] border border-[#2a2d35] rounded-2xl overflow-hidden shadow-2xl">
          <div className="bg-[#00d285] h-2 w-full" />
          <div className="p-8 md:p-12">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
              <div>
                <span className="inline-block px-3 py-1 bg-[#00d285]/10 text-[#00d285] text-xs font-bold rounded-full mb-4 uppercase tracking-wider">
                  Verified Credential
                </span>
                <h1 className="text-3xl md:text-4xl font-bold mb-2">Certificate of Completion</h1>
                <p className="text-[#ababab]">Issued by ScriptNex E-Learning</p>
              </div>
              <div className="text-right">
                <div className="text-4xl">🏅</div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              <div className="space-y-8">
                <div>
                  <h3 className="text-xs font-semibold text-[#ababab] uppercase tracking-widest mb-2">Recipient</h3>
                  <div className="text-xl font-bold">{data.user.name}</div>
                  <div className="text-sm text-[#00d285]">@{data.user.username}</div>
                </div>

                <div>
                  <h3 className="text-xs font-semibold text-[#ababab] uppercase tracking-widest mb-2">Certification</h3>
                  <div className="text-xl font-bold">{data.certification.title}</div>
                  <div className="text-sm text-[#ababab]">{data.certification.difficulty_level} Level</div>
                </div>

                <div>
                  <h3 className="text-xs font-semibold text-[#ababab] uppercase tracking-widest mb-2">Issue Date</h3>
                  <div className="text-lg font-bold">{new Date(data.issued_at).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}</div>
                </div>
              </div>

              <div className="bg-[#16181d] rounded-xl p-6 border border-[#2a2d35] flex flex-col items-center justify-center text-center">
                <div className="relative w-32 h-32 mb-4">
                  <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                    <circle cx="50" cy="50" r="45" fill="transparent" stroke="#2a2d35" strokeWidth="8" />
                    <circle cx="50" cy="50" r="45" fill="transparent" stroke="#00d285" strokeWidth="8"
                      strokeDasharray={2 * Math.PI * 45} strokeDashoffset={2 * Math.PI * 45 * (1 - data.percentage / 100)} 
                      strokeLinecap="round"
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-2xl font-bold">{Math.round(data.percentage)}%</span>
                  </div>
                </div>
                <h4 className="font-bold mb-1">Assessment Score</h4>
                <p className="text-xs text-[#ababab]">Successfully passed the certification exam</p>
              </div>
            </div>

            <div className="mt-12 pt-12 border-t border-[#2a2d35] flex flex-col md:flex-row justify-between items-center gap-6">
              <div className="text-center md:text-left">
                <h3 className="text-xs font-semibold text-[#ababab] uppercase tracking-widest mb-2">Verification ID</h3>
                <code className="text-sm text-[#00d285] bg-[#00d285]/5 px-3 py-1 rounded-md">{data.uuid}</code>
              </div>
              <div className="flex gap-4">
                <button 
                  onClick={() => window.print()}
                  className="px-6 py-2 bg-[#2a2d35] text-white text-sm font-bold rounded-lg hover:bg-[#353942] transition-colors"
                >
                  Print Page
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
