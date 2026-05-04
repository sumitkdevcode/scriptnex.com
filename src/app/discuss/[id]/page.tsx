'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { api } from '@/lib/api';
import { formatShortTimestamp } from '@/lib/dates';
import { useAuth } from '@/contexts/AuthContext';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import Link from 'next/link';
import type { Discussion, DiscussionReply } from '@/types/discussion';

export default function DiscussionDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const { isAuthenticated } = useAuth();
  const [discussion, setDiscussion] = useState<Discussion | null>(null);
  const [replies, setReplies] = useState<DiscussionReply[]>([]);
  const [loading, setLoading] = useState(true);
  const [replyBody, setReplyBody] = useState('');
  const [posting, setPosting] = useState(false);

  useEffect(() => {
    api.get<{ discussion: Discussion; replies: DiscussionReply[] }>(`/discussions/${id}`)
      .then(res => { setDiscussion(res.data.discussion); setReplies(res.data.replies); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [id]);

  const handleReply = async () => {
    if (!replyBody.trim()) return;
    setPosting(true);
    try {
      const res = await api.post<{ reply: DiscussionReply }>(`/discussions/${id}/reply`, { body: replyBody });
      setReplies(prev => [...prev, res.data.reply]);
      setReplyBody('');
    } catch { /* ignore */ }
    finally { setPosting(false); }
  };

  if (loading) return (
    <div className="min-h-screen bg-[#0f1115] text-[#f8fafc]"><Navbar />
      <div className="flex justify-center py-32"><div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-[#00d285]" /></div>
    </div>
  );

  if (!discussion) return (
    <div className="min-h-screen bg-[#0f1115] text-[#f8fafc]"><Navbar />
      <div className="text-center py-32 text-[#ababab]">Discussion not found.</div><Footer />
    </div>
  );

  return (
    <div className="min-h-screen bg-[#0f1115] text-[#f8fafc]">
      <Navbar />
      <div className="max-w-3xl mx-auto px-6 py-8">
        {/* Back */}
        <Link href="/discuss" className="text-xs text-[#ababab] hover:text-[#00d285] transition-colors mb-4 inline-block">← Back to Discussions</Link>

        {/* Post */}
        <div className="bg-[#16181d] border border-[#2a2d35] rounded-xl p-6 mb-6">
          <h1 className="text-xl font-bold mb-3">{discussion.title}</h1>
          <div className="flex items-center gap-3 mb-4 text-xs text-[#ababab]">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-[#00d285]/20 to-transparent flex items-center justify-center text-xs font-bold text-[#00d285]">
              {discussion.user.name.charAt(0)}
            </div>
            <span className="font-semibold text-[#cbd5e1]">@{discussion.user.username}</span>
            <span>{formatShortTimestamp(discussion.created_at)}</span>
            <span>👍 {discussion.upvotes}</span>
          </div>
          <div className="text-sm text-[#cbd5e1] whitespace-pre-wrap leading-relaxed">{discussion.body}</div>
          {discussion.problem && (
            <div className="mt-4 pt-3 border-t border-[#2a2d35]">
              <Link href={`/problems/${discussion.problem.slug}`} className="text-xs text-[#00d285] hover:underline">
                Related: {discussion.problem.title} →
              </Link>
            </div>
          )}
        </div>

        {/* Replies */}
        <h2 className="text-sm font-semibold uppercase tracking-wider text-[#ababab] mb-4">{replies.length} Replies</h2>
        <div className="space-y-3 mb-6">
          {replies.map(r => (
            <div key={r.id} className="bg-[#16181d] border border-[#2a2d35] rounded-xl p-5">
              <div className="flex items-center gap-3 mb-3 text-xs text-[#ababab]">
                <div className="w-6 h-6 rounded bg-[#1a1c23] flex items-center justify-center text-[10px] font-bold text-[#ababab]">
                  {r.user.name.charAt(0)}
                </div>
                <span className="font-semibold text-[#cbd5e1]">@{r.user.username}</span>
                <span>{formatShortTimestamp(r.created_at)}</span>
                <span>👍 {r.upvotes}</span>
              </div>
              <div className="text-sm text-[#cbd5e1] whitespace-pre-wrap">{r.body}</div>
            </div>
          ))}
        </div>

        {/* Reply Form */}
        {isAuthenticated ? (
          <div className="bg-[#16181d] border border-[#2a2d35] rounded-xl p-5">
            <textarea value={replyBody} onChange={e => setReplyBody(e.target.value)} rows={3} placeholder="Write a reply..." className="w-full px-4 py-3 bg-[#0f1115] border border-[#2a2d35] rounded-xl text-sm text-white focus:outline-none focus:border-[#00d285]/50 resize-none mb-3" />
            <button onClick={handleReply} disabled={posting || !replyBody.trim()} className="px-5 py-2.5 bg-[#00d285] rounded-xl text-xs font-bold text-black hover:bg-[#00e691] disabled:opacity-50">
              {posting ? 'Posting...' : 'Reply'}
            </button>
          </div>
        ) : (
          <div className="text-center py-6 text-[#ababab] text-sm">
            <Link href="/login" className="text-[#00d285] font-semibold hover:underline">Sign in</Link> to reply
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
}
