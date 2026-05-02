'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { api } from '@/lib/api';
import Link from 'next/link';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';

interface Certificate {
  uuid: string;
  user: { name: string; username: string };
  certification: { title: string; difficulty_level: string };
  score: number;
  percentage: number;
  issued_at: string;
}

export default function VerifyCertPage() {
  const params = useParams();
  const uuid = params.uuid as string;
  const [cert, setCert] = useState<Certificate | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    api.get<{ certificate: Certificate }>(`/certifications/verify/${uuid}`)
      .then(r => setCert(r.data.certificate))
      .catch(() => setNotFound(true))
      .finally(() => setLoading(false));
  }, [uuid]);

  return (
    <div className="min-h-screen bg-[#0f1115] text-[#f8fafc] flex flex-col">
      <Navbar />
      <div className="flex-1 flex items-center justify-center px-6 py-16">
        {loading ? (
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-[#00d285]" />
        ) : notFound || !cert ? (
          <div className="bg-[#16181d] border border-red-500/20 rounded-2xl p-12 max-w-md w-full text-center">
            <div className="text-5xl mb-4">❌</div>
            <h1 className="text-xl font-bold mb-2 text-red-400">Certificate Not Found</h1>
            <p className="text-[#94a3b8] text-sm mb-6">
              This certificate ID is invalid or doesn&apos;t exist. It may have been revoked.
            </p>
            <Link href="/" className="px-6 py-3 bg-[#16181d] border border-[#2a2d35] rounded-xl text-sm font-semibold hover:border-[#00d285]/30 transition-colors">
              Go Home
            </Link>
          </div>
        ) : (
          <div className="max-w-lg w-full">
            {/* Certificate Card */}
            <div className="relative bg-[#16181d] border border-[#2a2d35] rounded-2xl p-10 text-center overflow-hidden mb-6">
              {/* Decorative top bar */}
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#00d285] via-[#00a669] to-[#00d285]" />
              {/* Background glow */}
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(0,210,133,0.04),transparent_60%)]" />

              <div className="relative z-10">
                <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-[#00d285]/10 border border-[#00d285]/20 flex items-center justify-center text-4xl">
                  🏆
                </div>
                <div className="inline-flex items-center gap-2 bg-[#00d285]/10 border border-[#00d285]/20 rounded-full px-4 py-1.5 mb-6">
                  <span className="w-2 h-2 rounded-full bg-[#00d285] animate-pulse" />
                  <span className="text-xs font-semibold text-[#00d285] uppercase tracking-wider">Verified Certificate</span>
                </div>

                <h1 className="text-2xl font-bold mb-1">{cert.certification.title}</h1>
                <p className="text-[#94a3b8] text-sm mb-6 capitalize">{cert.certification.difficulty_level} Level</p>

                <div className="bg-[#0f1115] rounded-xl p-5 mb-6 text-left">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#00d285] to-[#00a669] flex items-center justify-center text-lg font-bold text-black">
                      {cert.user.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <div className="font-semibold">{cert.user.name}</div>
                      <div className="text-xs text-[#64748b]">@{cert.user.username}</div>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div>
                      <div className="text-[10px] uppercase tracking-wider text-[#64748b] font-semibold mb-1">Score</div>
                      <div className="font-bold text-[#00d285]">{cert.percentage}%</div>
                    </div>
                    <div>
                      <div className="text-[10px] uppercase tracking-wider text-[#64748b] font-semibold mb-1">Issued On</div>
                      <div className="font-medium text-xs">
                        {new Date(cert.issued_at).toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' })}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="text-[10px] text-[#475569] font-mono break-all">ID: {cert.uuid}</div>
              </div>
            </div>

            <div className="text-center">
              <p className="text-xs text-[#64748b] mb-4">
                This certificate was issued by ScriptNex and is cryptographically verified.
              </p>
              <Link href="/certifications" className="text-sm text-[#00d285] hover:underline">
                Browse Certifications →
              </Link>
            </div>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
}
