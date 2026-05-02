'use client';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { api } from '@/lib/api';
import { useAuth } from '@/contexts/AuthContext';
import Link from 'next/link';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';

interface CertDetail { id: number; title: string; slug: string; description: string; difficulty_level: string; duration_minutes: number; passing_score: number; total_questions: number; is_premium: boolean; }
interface Question { id: number; type: string; question_text: string; options: string[]; points: number; }

export default function CertDetailPage() {
  const params = useParams();
  const { isAuthenticated } = useAuth();
  const [cert, setCert] = useState<CertDetail | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [started, setStarted] = useState(false);
  const [attemptId, setAttemptId] = useState<number | null>(null);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [result, setResult] = useState<{ result: string; score: number; total: number; percentage: number } | null>(null);

  useEffect(() => {
    api.get<{ certification: CertDetail }>(`/certifications/${params.slug}`).then(r => setCert(r.data.certification));
  }, [params.slug]);

  async function startExam() {
    if (!isAuthenticated) return alert('Please log in first');
    const res = await api.post<{ attempt: { id: number }; questions: Question[] }>(`/certifications/${params.slug}/start`, {});
    setAttemptId(res.data.attempt.id);
    setQuestions(res.data.questions);
    setStarted(true);
  }

  async function submitExam() {
    if (!attemptId) return;
    const res = await api.post<{ result: string; score: number; total: number; percentage: number }>(`/certifications/attempts/${attemptId}/submit`, { answers });
    setResult(res.data);
    setStarted(false);
  }

  if (!cert) return <div className="flex items-center justify-center min-h-screen bg-[#0f1115]"><div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#00d285]" /></div>;

  if (result) {
    return (
      <div className="min-h-screen bg-[#0f1115] text-[#f8fafc] flex flex-col items-center justify-center px-6">
        <div className="bg-[#16181d] border border-[#2a2d35] rounded-2xl p-10 max-w-md text-center">
          <div className={`text-6xl mb-4 ${result.result === 'passed' ? 'text-[#00d285]' : 'text-[#ef4444]'}`}>{result.result === 'passed' ? '🎉' : '😔'}</div>
          <h1 className="text-2xl font-bold mb-2">{result.result === 'passed' ? 'Congratulations!' : 'Better luck next time'}</h1>
          <p className="text-[#94a3b8] mb-6">{result.result === 'passed' ? 'You passed the certification!' : 'You didn\'t meet the passing score.'}</p>
          <div className="text-4xl font-bold mb-2" style={{ color: result.result === 'passed' ? '#00d285' : '#ef4444' }}>{result.percentage}%</div>
          <p className="text-sm text-[#64748b] mb-6">Score: {result.score}/{result.total}</p>
          <Link href="/certifications" className="px-6 py-3 bg-[#00d285] text-black font-semibold rounded-lg">Back to Certifications</Link>
        </div>
      </div>
    );
  }

  if (started) {
    return (
      <div className="min-h-screen bg-[#0f1115] text-[#f8fafc]">
        <div className="max-w-3xl mx-auto px-6 py-8">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-xl font-bold">{cert.title}</h1>
            <button onClick={submitExam} className="px-6 py-2.5 bg-[#00d285] text-black font-bold rounded-lg text-sm">Submit Exam</button>
          </div>
          <div className="space-y-6">
            {questions.map((q, idx) => (
              <div key={q.id} className="bg-[#16181d] border border-[#2a2d35] rounded-xl p-6">
                <div className="flex items-center gap-3 mb-4">
                  <span className="w-8 h-8 rounded-lg bg-[#00d285]/10 text-[#00d285] flex items-center justify-center text-sm font-bold">{idx + 1}</span>
                  <span className="text-xs text-[#64748b]">{q.points} pts</span>
                </div>
                <p className="text-sm mb-4">{q.question_text}</p>
                <div className="space-y-2">
                  {q.options?.map((opt, oi) => (
                    <button key={oi} onClick={() => setAnswers(p => ({ ...p, [q.id]: opt }))} className={`w-full text-left px-4 py-3 rounded-lg text-sm border transition-all ${answers[q.id] === opt ? 'border-[#00d285] bg-[#00d285]/10 text-[#00d285]' : 'border-[#2a2d35] hover:border-[#64748b] text-[#94a3b8]'}`}>
                      <span className="font-mono text-xs mr-3">{String.fromCharCode(65 + oi)}.</span>{opt}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0f1115] text-[#f8fafc]">
      <Navbar />
      <div className="max-w-3xl mx-auto px-6 py-12">
        <Link href="/certifications" className="text-sm text-[#64748b] hover:text-white mb-4 inline-block">← Back to Certifications</Link>
        <h1 className="text-3xl font-bold mb-3">{cert.title}</h1>
        <p className="text-[#94a3b8] mb-8">{cert.description}</p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Duration', value: `${cert.duration_minutes} min` },
            { label: 'Questions', value: cert.total_questions },
            { label: 'Passing', value: `${cert.passing_score}%` },
            { label: 'Level', value: cert.difficulty_level },
          ].map(s => (
            <div key={s.label} className="bg-[#16181d] border border-[#2a2d35] rounded-xl p-4 text-center">
              <div className="text-xs text-[#64748b] uppercase tracking-wider mb-1">{s.label}</div>
              <div className="text-lg font-bold capitalize">{s.value}</div>
            </div>
          ))}
        </div>
        <button onClick={startExam} className="px-8 py-4 bg-[#00d285] text-black font-bold rounded-xl text-lg hover:bg-[#00e691] transition-colors w-full">Start Exam</button>
      </div>
      <Footer />
    </div>
  );
}
