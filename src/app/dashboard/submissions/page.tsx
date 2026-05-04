'use client';
import { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import Link from 'next/link';

interface Sub {
  id: number; uuid: string; status: string; submitted_at: string;
  runtime_ms: number | null; memory_kb: number | null;
  problem: { id: number; title: string; slug: string; difficulty?: string } | null;
  language: { id: number; name: string } | null;
}

const STATUS_CLR: Record<string, string> = {
  accepted: '#00d285', wrong_answer: '#ef4444', time_limit_exceeded: '#f59e0b',
  runtime_error: '#ef4444', compilation_error: '#ef4444', queued: '#ababab', running: '#3b82f6',
  memory_limit_exceeded: '#f59e0b',
};

export default function SubmissionsPage() {
  const [subs, setSubs] = useState<Sub[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get<Sub[]>('/submissions').then(r => { setSubs(r.data); setLoading(false); }).catch(() => setLoading(false));
  }, []);

  return (
    <div className="p-8 max-w-5xl mx-auto w-full">
      <h1 className="text-2xl font-semibold mb-1">My Submissions</h1>
      <p className="text-[#ababab] text-sm mb-8">Your code submission history</p>

      <div className="bg-[#16181d] border border-[#2a2d35] rounded-xl overflow-hidden">
        <div className="grid grid-cols-[1fr_120px_100px_100px_150px] gap-4 px-6 py-3 border-b border-[#2a2d35] text-[10px] uppercase tracking-widest text-[#ababab] font-semibold">
          <span>Problem</span><span>Language</span><span className="text-center">Status</span><span className="text-center">Runtime</span><span className="text-right">Submitted</span>
        </div>

        {loading ? (
          <div className="flex justify-center py-12"><div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-[#00d285]" /></div>
        ) : subs.length === 0 ? (
          <div className="py-12 text-center text-[#ababab]">
            <p className="mb-2">No submissions yet</p>
            <Link href="/problems" className="text-[#00d285] text-sm font-medium">Start solving →</Link>
          </div>
        ) : (
          subs.map(s => (
            <div key={s.id} className="grid grid-cols-[1fr_120px_100px_100px_150px] gap-4 px-6 py-3.5 items-center border-b border-[#2a2d35]/50 last:border-none hover:bg-white/[0.02]">
              <Link href={`/problems/${s.problem?.slug}`} className="text-sm font-medium hover:text-[#00d285] transition-colors">{s.problem?.title ?? '—'}</Link>
              <span className="text-xs text-[#ababab]">{s.language?.name ?? '—'}</span>
              <div className="text-center"><span className="text-[11px] font-semibold capitalize" style={{ color: STATUS_CLR[s.status] || '#ababab' }}>{s.status.replace(/_/g, ' ')}</span></div>
              <div className="text-center text-xs text-[#ababab]">{s.runtime_ms ? `${s.runtime_ms}ms` : '—'}</div>
              <div className="text-right text-xs text-[#ababab]">{new Date(s.submitted_at).toLocaleString()}</div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
