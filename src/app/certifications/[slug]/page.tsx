'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { api } from '@/lib/api';
import { useAuth } from '@/contexts/AuthContext';

interface CertDetail {
  id: number;
  title: string;
  slug: string;
  description: string;
  difficulty_level: string;
  duration_minutes: number;
  passing_score: number;
  total_questions: number;
  is_premium: boolean;
  certificate_price_paise: number;
}

export default function CertDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { isAuthenticated, isLoading } = useAuth();
  const [cert, setCert] = useState<CertDetail | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    api.get<{ certification: CertDetail }>(`/certifications/${params.slug}`)
      .then((response) => {
        if (!cancelled) {
          setCert(response.data.certification);
        }
      })
      .catch(() => {
        if (!cancelled) {
          setCert(null);
        }
      })
      .finally(() => {
        if (!cancelled) {
          setLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [params.slug]);

  const handleStart = () => {
    const examPath = `/certifications/${params.slug}/exam`;

    if (!isAuthenticated) {
      router.push(`/login?redirect=${encodeURIComponent(examPath)}`);
      return;
    }

    router.push(examPath);
  };

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen bg-[#0f1115]"><div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#00d285]" /></div>;
  }

  if (!cert) {
    return (
      <div className="min-h-screen bg-[#0f1115] text-[#f8fafc]">
        <Navbar />
        <div className="max-w-3xl mx-auto px-6 py-24 text-center">
          <h1 className="text-3xl font-bold mb-3">Certification not found</h1>
          <p className="text-[#ababab] mb-6">This certification is unavailable right now.</p>
          <Link href="/certifications" className="px-6 py-3 bg-[#00d285] text-black font-semibold rounded-md">
            Back to Certifications
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0f1115] text-[#f8fafc]">
      <Navbar />
      <div className="max-w-3xl mx-auto px-6 py-12">
        <Link href="/certifications" className="text-sm text-[#ababab] hover:text-white mb-4 inline-block">← Back to Certifications</Link>
        <h1 className="text-3xl font-bold mb-3">{cert.title}</h1>
        <p className="text-[#ababab] mb-8">{cert.description}</p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Duration', value: `${cert.duration_minutes} min` },
            { label: 'Questions', value: cert.total_questions },
            { label: 'Passing', value: `${cert.passing_score}%` },
            { label: 'Level', value: cert.difficulty_level },
          ].map((stat) => (
            <div key={stat.label} className="bg-[#16181d] border border-[#2a2d35] rounded-md p-4 text-center">
              <div className="text-xs text-[#ababab] uppercase tracking-wider mb-1">{stat.label}</div>
              <div className="text-lg font-bold capitalize">{stat.value}</div>
            </div>
          ))}
        </div>
        <button
          onClick={handleStart}
          disabled={isLoading}
          className="px-8 py-4 bg-[#00d285] text-black font-bold rounded-md text-lg hover:bg-[#00e691] transition-colors w-full disabled:opacity-50"
        >
          {isAuthenticated ? 'Start Exam' : 'Sign In to Start'}
        </button>
        <p className="mt-4 text-sm text-[#ababab]">
          Pass the exam with at least {cert.passing_score}% to generate your certificate. PDF download unlock: ₹{Math.round(cert.certificate_price_paise / 100)}.
        </p>
      </div>
      <Footer />
    </div>
  );
}
