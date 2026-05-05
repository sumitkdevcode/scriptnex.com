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
      <main className="flex-1 max-w-5xl mx-auto w-full px-6 py-12 flex flex-col items-center">
        <div className="w-full mb-8 flex justify-between items-center">
          <h1 className="text-2xl font-bold">Certificate Verification</h1>
          <button 
            onClick={() => window.print()}
            className="px-6 py-2 bg-[#00d285] text-black text-sm font-bold rounded-lg hover:bg-[#00b371] transition-colors"
          >
            Print Page
          </button>
        </div>

        <div className="w-full relative aspect-[1.414] bg-white overflow-hidden rounded-md shadow-2xl"
             style={{
               backgroundImage: 'url(/certificate.png)',
               backgroundSize: 'cover',
               backgroundPosition: 'center',
             }}>
          <div className="absolute inset-0 flex flex-col items-center justify-center p-[8%] text-center font-sans">
            {/* Spacer for top margin in case the template has header text */}
            <div className="flex-1"></div>
            
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-gray-800 font-serif mb-2 uppercase tracking-wider">
              {data.user.name}
            </h1>
            
            <div className="text-sm sm:text-base md:text-xl text-gray-600 mb-6 font-medium max-w-[80%]">
              has successfully completed the certification exam for
            </div>
            
            <h2 className="text-2xl sm:text-3xl md:text-5xl font-bold text-[#00d285] mb-8 drop-shadow-sm">
              {data.certification.title}
            </h2>
            
            <div className="w-full flex justify-between px-[10%] mt-auto pb-4">
              <div className="text-center">
                <div className="text-sm sm:text-base md:text-xl font-bold text-gray-800 border-b border-gray-400 pb-1 mb-1 px-4">
                  {new Date(data.issued_at).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })}
                </div>
                <div className="text-[10px] sm:text-sm text-gray-500 uppercase tracking-widest font-bold">Date</div>
              </div>
              
              <div className="text-center">
                <div className="text-sm sm:text-base md:text-xl font-bold text-gray-800 border-b border-gray-400 pb-1 mb-1 px-4">
                  {Math.round(data.percentage)}%
                </div>
                <div className="text-[10px] sm:text-sm text-gray-500 uppercase tracking-widest font-bold">Score</div>
              </div>
            </div>
            
            <div className="absolute bottom-4 right-6 text-[8px] sm:text-xs text-gray-400 font-mono text-right">
              Verify at: scriptnex.com/verify/{data.uuid}<br/>
              ID: {data.uuid}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
