'use client';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { api } from '@/lib/api';
import { useAuth } from '@/contexts/AuthContext';
import Link from 'next/link';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';

interface ContestDetail {
  id: number; uuid: string; title: string; slug: string; description: string;
  type: string; start_time: string; end_time: string; duration_minutes: number;
  scoring_type: string; rules: string | null; prizes: Record<string, string> | null; status: string;
}
interface ContestProblem { id: number; title: string; slug: string; difficulty: string; points: number; }

const DIFF_CLR: Record<string, string> = { easy: '#00d285', medium: '#f59e0b', hard: '#ef4444', expert: '#a855f7' };

export default function ContestDetailPage() {
  const params = useParams();
  const { isAuthenticated } = useAuth();
  const [contest, setContest] = useState<ContestDetail | null>(null);
  const [problems, setProblems] = useState<ContestProblem[]>([]);
  const [registered, setRegistered] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get<{ contest: ContestDetail; problems: ContestProblem[] }>(`/contests/${params.slug}`)
      .then(r => { setContest(r.data.contest); setProblems(r.data.problems); setLoading(false); });
  }, [params.slug]);

  async function handleRegister() {
    if (!isAuthenticated) return alert('Please log in first.');
    await api.post(`/contests/${params.slug}/register`, {});
    setRegistered(true);
  }

  if (loading || !contest) return <div className="flex items-center justify-center min-h-screen bg-[#0f1115]"><div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#00d285]" /></div>;

  return (
    <div className="min-h-screen bg-[#0f1115] text-[#f8fafc]">
      <Navbar />
      <div className="max-w-4xl mx-auto px-6 py-8">
        <Link href="/contests" className="text-sm text-[#64748b] hover:text-white mb-4 inline-block">← Back to Contests</Link>

        <div className="flex items-center gap-3 mb-3">
          <h1 className="text-3xl font-bold">{contest.title}</h1>
          <span className={`px-2.5 py-1 rounded text-[10px] font-bold uppercase tracking-wider ${contest.status === 'active' ? 'bg-red-500/10 text-red-400' : contest.status === 'upcoming' ? 'bg-green-500/10 text-green-400' : 'bg-gray-500/10 text-gray-400'}`}>{contest.status}</span>
        </div>

        <div className="flex gap-6 text-sm text-[#64748b] mb-6">
          <span className="uppercase">{contest.type}</span>
          <span>{contest.duration_minutes} min</span>
          <span>{contest.scoring_type.toUpperCase()} scoring</span>
          <span>Starts: {new Date(contest.start_time).toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</span>
        </div>

        {contest.description && <p className="text-[#94a3b8] mb-8 whitespace-pre-wrap">{contest.description}</p>}

        {contest.status !== 'ended' && (
          <button onClick={handleRegister} disabled={registered} className={`px-8 py-3 rounded-xl font-bold text-sm mb-10 transition-colors ${registered ? 'bg-[#2a2d35] text-[#94a3b8] cursor-default' : 'bg-[#00d285] text-black hover:bg-[#00e691]'}`}>
            {registered ? '✓ Registered' : 'Register Now'}
          </button>
        )}

        {/* Rules */}
        {contest.rules && (
          <div className="bg-[#16181d] border border-[#2a2d35] rounded-xl p-6 mb-6">
            <h2 className="text-sm font-semibold uppercase tracking-widest text-[#64748b] mb-3">Rules</h2>
            <pre className="text-sm text-[#94a3b8] whitespace-pre-wrap">{contest.rules}</pre>
          </div>
        )}

        {/* Prizes */}
        {contest.prizes && Object.keys(contest.prizes).length > 0 && (
          <div className="bg-[#16181d] border border-[#2a2d35] rounded-xl p-6 mb-6">
            <h2 className="text-sm font-semibold uppercase tracking-widest text-[#64748b] mb-3">Prizes</h2>
            <div className="space-y-2">
              {Object.entries(contest.prizes).map(([place, prize]) => (
                <div key={place} className="flex items-center gap-3">
                  <span className="text-sm font-bold text-[#00d285]">{place}</span>
                  <span className="text-sm text-[#94a3b8]">{prize}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Problems */}
        {problems.length > 0 && (
          <div className="bg-[#16181d] border border-[#2a2d35] rounded-xl overflow-hidden">
            <div className="px-6 py-3 border-b border-[#2a2d35]">
              <h2 className="text-sm font-semibold uppercase tracking-widest text-[#64748b]">Problems</h2>
            </div>
            {problems.map((p, i) => (
              <Link key={p.id} href={`/problems/${p.slug}`} className="flex items-center justify-between px-6 py-3.5 hover:bg-white/[0.02] transition-colors border-b border-[#2a2d35]/50 last:border-none">
                <div className="flex items-center gap-3">
                  <span className="w-7 h-7 rounded bg-white/5 flex items-center justify-center text-xs font-bold text-[#64748b]">{String.fromCharCode(65 + i)}</span>
                  <span className="text-sm font-medium">{p.title}</span>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-xs font-semibold" style={{ color: DIFF_CLR[p.difficulty] }}>{p.difficulty}</span>
                  <span className="text-xs text-[#64748b]">{p.points} pts</span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
}
