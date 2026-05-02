'use client';

import { useEffect, useState, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';

interface Question {
  id: number;
  type: 'mcq' | 'coding' | 'fill_blank';
  question_text: string;
  options?: Record<string, string>;
  points: number;
}

interface CertificationExam {
  id: number;
  title: string;
  duration_minutes: number;
  questions: Question[];
}

export default function CertificationExamPage() {
  const params = useParams();
  const slug = params.slug as string;
  const router = useRouter();
  
  const [exam, setExam] = useState<CertificationExam | null>(null);
  const [loading, setLoading] = useState(true);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [timeLeft, setTimeLeft] = useState<number>(0);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    async function loadExam() {
      try {
        const res = await api.get<{ exam: CertificationExam }>(`/certifications/${slug}/exam`);
        setExam(res.data.exam);
        setTimeLeft(res.data.exam.duration_minutes * 60);
      } catch (err) {
        router.push('/certifications');
      } finally {
        setLoading(false);
      }
    }
    loadExam();
  }, [slug, router]);

  const handleSubmit = useCallback(async () => {
    setSubmitting(true);
    try {
      const res = await api.post<{ attempt_id: number }>(`/certifications/${slug}/submit`, { answers });
      router.push(`/certifications/${slug}/result?attempt_id=${res.data.attempt_id}`);
    } catch (err) {
      alert('Error submitting exam. Please try again.');
    } finally {
      setSubmitting(false);
    }
  }, [slug, answers, router]);

  useEffect(() => {
    if (timeLeft <= 0 || !exam) return;
    
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          handleSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    
    return () => clearInterval(timer);
  }, [timeLeft, exam, handleSubmit]);

  const handleOptionSelect = (questionId: number, value: string) => {
    setAnswers(prev => ({ ...prev, [questionId]: value }));
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0f1115] flex items-center justify-center">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-[#00d285]"></div>
      </div>
    );
  }

  if (!exam) return null;

  return (
    <div className="min-h-screen flex flex-col bg-[#0f1115] text-[#f8fafc]">
      <Navbar />
      
      <div className="sticky top-[65px] bg-[#16181d] border-b border-[#2a2d35] z-40 px-6 py-3 flex items-center justify-between shadow-xl">
        <h2 className="font-bold text-sm">{exam.title}</h2>
        <div className="flex items-center gap-4">
          <div className={`font-mono text-lg font-bold ${timeLeft < 300 ? 'text-red-500' : 'text-[#00d285]'}`}>
            ⏱ {formatTime(timeLeft)}
          </div>
          <button 
            onClick={handleSubmit} 
            disabled={submitting}
            className="px-4 py-1.5 bg-[#00d285] text-black font-bold rounded-lg hover:bg-[#00e691] transition-colors disabled:opacity-50 text-sm"
          >
            {submitting ? 'Submitting...' : 'Submit Exam'}
          </button>
        </div>
      </div>

      <main className="flex-1 max-w-4xl mx-auto w-full px-4 py-8">
        <div className="space-y-8">
          {exam.questions.map((q, idx) => (
            <div key={q.id} className="bg-[#16181d] border border-[#2a2d35] rounded-xl p-6">
              <div className="flex items-start justify-between mb-4">
                <h3 className="font-semibold text-lg flex-1 mr-4">
                  <span className="text-[#64748b] mr-2">{idx + 1}.</span> 
                  {q.question_text}
                </h3>
                <span className="text-xs text-[#00d285] bg-[#00d285]/10 px-2.5 py-1 rounded-full font-bold shrink-0">
                  {q.points} pts
                </span>
              </div>
              
              {q.type === 'mcq' && q.options && (
                <div className="space-y-3 mt-6">
                  {Object.entries(q.options).map(([key, value]) => (
                    <label 
                      key={key} 
                      className={`flex items-center gap-3 p-4 border rounded-lg cursor-pointer transition-colors ${
                        answers[q.id] === key 
                          ? 'border-[#00d285] bg-[#00d285]/5' 
                          : 'border-[#2a2d35] bg-[#1a1c23] hover:border-[#475569]'
                      }`}
                    >
                      <input 
                        type="radio" 
                        name={`question_${q.id}`} 
                        value={key}
                        checked={answers[q.id] === key}
                        onChange={() => handleOptionSelect(q.id, key)}
                        className="hidden"
                      />
                      <div className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 ${
                        answers[q.id] === key ? 'border-[#00d285]' : 'border-[#475569]'
                      }`}>
                        {answers[q.id] === key && <div className="w-2.5 h-2.5 bg-[#00d285] rounded-full" />}
                      </div>
                      <span className="text-[#cbd5e1]">{value}</span>
                    </label>
                  ))}
                </div>
              )}

              {q.type === 'fill_blank' && (
                <div className="mt-4">
                  <input 
                    type="text" 
                    value={answers[q.id] || ''}
                    onChange={(e) => handleOptionSelect(q.id, e.target.value)}
                    placeholder="Type your answer here..."
                    className="w-full bg-[#1a1c23] border border-[#2a2d35] rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#00d285]"
                  />
                </div>
              )}
            </div>
          ))}
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
