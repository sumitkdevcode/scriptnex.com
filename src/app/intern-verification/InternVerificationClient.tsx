'use client';

import { useState } from 'react';
import { api, ApiError } from '@/lib/api';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';

interface InternDetails {
  full_name: string;
  system_internship_id: string;
  domain_area: string;
  start_date: string;
  end_date: string;
}

export default function InternVerificationClient() {
  const [internshipId, setInternshipId] = useState('');
  const [loading, setLoading] = useState(false);
  const [intern, setIntern] = useState<InternDetails | null>(null);
  const [error, setError] = useState('');

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!internshipId.trim()) return;

    setLoading(true);
    setError('');
    setIntern(null);

    try {
      const encodedId = encodeURIComponent(internshipId.trim());
      const response = await api.get<InternDetails>(`/interns/verify?id=${encodedId}`);
      setIntern(response.data);
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message || 'Internship record not found.');
      } else {
        setError('Something went wrong. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0f1115] text-[#f8fafc] flex flex-col">
      <Navbar />
      
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-16 relative">
        {/* Background glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#00d285] rounded-full blur-[150px] opacity-[0.05] pointer-events-none" />

        <div className="max-w-xl w-full relative z-10">
          <div className="text-center mb-10">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 font-serif tracking-tight">Verify Internship</h1>
            <p className="text-[#ababab] text-lg">
              Enter a ScriptNex Internship ID to verify the credential details.
            </p>
          </div>

          <div className="bg-[#16181d] border border-[#2a2d35] rounded-2xl p-6 md:p-8 shadow-xl">
            <form onSubmit={handleVerify} className="flex flex-col sm:flex-row gap-4 mb-8">
              <input
                type="text"
                placeholder="e.g. SN/DA/2502"
                value={internshipId}
                onChange={(e) => setInternshipId(e.target.value)}
                className="flex-1 bg-[#0f1115] border border-[#2a2d35] rounded-xl px-4 py-3 text-[#f8fafc] focus:outline-none focus:border-[#00d285] transition-colors"
                required
              />
              <button
                type="submit"
                disabled={loading || !internshipId.trim()}
                className="px-8 py-3 bg-[#00d285] text-black font-bold rounded-xl hover:bg-[#00e691] transition-colors disabled:opacity-50 flex items-center justify-center min-w-[120px]"
              >
                {loading ? (
                  <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-black" />
                ) : (
                  'Verify'
                )}
              </button>
            </form>

            {error && (
              <div className="bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl p-4 text-center">
                {error}
              </div>
            )}

            {intern && (
              <div className="border border-[#00d285]/30 bg-[#00d285]/5 rounded-xl p-6 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4">
                  <div className="bg-[#00d285]/20 text-[#00d285] px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider flex items-center gap-1">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                    Verified
                  </div>
                </div>

                <h3 className="text-[#ababab] text-xs uppercase tracking-widest font-bold mb-1">Intern Name</h3>
                <div className="text-2xl font-bold text-white mb-6">{intern.full_name}</div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-[#ababab] text-xs uppercase tracking-widest font-bold mb-1">Internship ID</h3>
                    <div className="text-white font-mono">{intern.system_internship_id}</div>
                  </div>
                  <div>
                    <h3 className="text-[#ababab] text-xs uppercase tracking-widest font-bold mb-1">Domain Area</h3>
                    <div className="text-[#00d285] font-semibold">{intern.domain_area}</div>
                  </div>
                  <div>
                    <h3 className="text-[#ababab] text-xs uppercase tracking-widest font-bold mb-1">Start Date</h3>
                    <div className="text-white">
                      {new Date(intern.start_date).toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' })}
                    </div>
                  </div>
                  <div>
                    <h3 className="text-[#ababab] text-xs uppercase tracking-widest font-bold mb-1">End Date</h3>
                    <div className="text-white">
                      {new Date(intern.end_date).toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' })}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
