'use client';

import { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import { formatShortTimestamp } from '@/lib/dates';
import { useAuth } from '@/contexts/AuthContext';
import Link from 'next/link';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import type { Discussion } from '@/types/discussion';

const TYPE_CONFIG: Record<string, { label: string; color: string }> = {
  question: { label: 'Question', color: '#3b82f6' },
  editorial: { label: 'Editorial', color: '#a855f7' },
  general: { label: 'General', color: '#64748b' },
};

export default function DiscussionsPage() {
  const { isAuthenticated } = useAuth();
  const [discussions, setDiscussions] = useState<Discussion[]>([]);
  const [loading, setLoading] = useState(true);
  const [showNew, setShowNew] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newBody, setNewBody] = useState('');
  const [newType, setNewType] = useState<string>('general');
  const [posting, setPosting] = useState(false);

  useEffect(() => {
    api.get<{ discussions: Discussion[] }>('/discussions')
      .then(res => setDiscussions(res.data.discussions))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const handlePost = async () => {
    if (!newTitle.trim() || !newBody.trim()) return;
    setPosting(true);
    try {
      const res = await api.post<{ discussion: Discussion }>('/discussions', { title: newTitle, body: newBody, type: newType });
      setDiscussions(prev => [res.data.discussion, ...prev]);
      setShowNew(false); setNewTitle(''); setNewBody('');
    } catch { /* ignore */ }
    finally { setPosting(false); }
  };

  return (
    <div className="min-h-screen bg-[#0f1115] text-[#f8fafc]">
      <Navbar />
      <div className="max-w-3xl mx-auto px-6 py-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold mb-1">Discussions</h1>
            <p className="text-[#94a3b8] text-sm">Ask questions, share knowledge, connect with the community</p>
          </div>
          {isAuthenticated && (
            <button onClick={() => setShowNew(!showNew)} className="px-4 py-2.5 bg-[#00d285] rounded-xl text-xs font-bold text-black hover:bg-[#00e691] transition-colors">
              + New Post
            </button>
          )}
        </div>

        {/* New Post Form */}
        {showNew && (
          <div className="bg-[#16181d] border border-[#2a2d35] rounded-xl p-6 mb-6 space-y-4">
            <input value={newTitle} onChange={e => setNewTitle(e.target.value)} placeholder="Title" className="w-full px-4 py-3 bg-[#0f1115] border border-[#2a2d35] rounded-xl text-sm text-white focus:outline-none focus:border-[#00d285]/50" />
            <textarea value={newBody} onChange={e => setNewBody(e.target.value)} rows={4} placeholder="Write your post (supports markdown)..." className="w-full px-4 py-3 bg-[#0f1115] border border-[#2a2d35] rounded-xl text-sm text-white focus:outline-none focus:border-[#00d285]/50 resize-none" />
            <div className="flex items-center gap-3">
              <select value={newType} onChange={e => setNewType(e.target.value)} className="px-3 py-2 bg-[#0f1115] border border-[#2a2d35] rounded-lg text-xs text-white focus:outline-none">
                <option value="general">General</option>
                <option value="question">Question</option>
                <option value="editorial">Editorial</option>
              </select>
              <button onClick={handlePost} disabled={posting} className="px-5 py-2 bg-[#00d285] rounded-lg text-xs font-bold text-black hover:bg-[#00e691] disabled:opacity-50">
                {posting ? 'Posting...' : 'Post'}
              </button>
              <button onClick={() => setShowNew(false)} className="px-4 py-2 text-xs text-[#64748b] hover:text-white">Cancel</button>
            </div>
          </div>
        )}

        {/* Discussion List */}
        {loading ? (
          <div className="flex justify-center py-20"><div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#00d285]" /></div>
        ) : discussions.length === 0 ? (
          <div className="text-center py-20 text-[#64748b]">
            <div className="text-5xl mb-3">💬</div>
            <p>No discussions yet. Start the conversation!</p>
          </div>
        ) : (
          <div className="space-y-3">
            {discussions.map(d => {
              const cfg = TYPE_CONFIG[d.type] || TYPE_CONFIG.general;
              return (
                <Link key={d.id} href={`/discuss/${d.id}`} className="block bg-[#16181d] border border-[#2a2d35] rounded-xl p-5 hover:border-[#00d285]/20 transition-all group">
                  <div className="flex items-start gap-4">
                    <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-[#00d285]/20 to-transparent flex items-center justify-center text-sm font-bold text-[#00d285] shrink-0">
                      {d.user.name.charAt(0)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider" style={{ color: cfg.color, backgroundColor: `${cfg.color}15` }}>{cfg.label}</span>
                        {d.is_pinned && <span className="text-[9px] text-amber-400">📌 Pinned</span>}
                      </div>
                      <h3 className="font-semibold truncate group-hover:text-[#00d285] transition-colors">{d.title}</h3>
                      <div className="flex items-center gap-3 mt-2 text-xs text-[#64748b]">
                        <span>@{d.user.username}</span>
                        <span>{formatShortTimestamp(d.created_at)}</span>
                        <span>💬 {d.reply_count}</span>
                        <span>👍 {d.upvotes}</span>
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
}
