'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { api } from '@/lib/api';
import { useAuth } from '@/contexts/AuthContext';
import dynamic from 'next/dynamic';

const MonacoEditor = dynamic(() => import('@monaco-editor/react'), { ssr: false });

interface ProblemData {
  id: number;
  title: string;
  slug: string;
  description: string;
  input_format?: string;
  output_format?: string;
  constraints?: string;
  difficulty?: string;
  sample_input?: string;
  sample_output?: string;
  explanation?: string;
  time_limit_ms?: number;
  memory_limit_kb?: number;
}

interface SupportedLanguage {
  id: number;
  name: string;
  version: string;
  monaco_id: string;
  boilerplate_code?: string;
}

interface Question {
  id: number;
  type: 'mcq' | 'coding' | 'fill_blank';
  question_text: string;
  options?: string[] | Record<string, string>;
  points: number;
  problem?: ProblemData;
}

interface CertificationDetail {
  id: number;
  title: string;
  duration_minutes: number;
}

export default function CertificationExamPage() {
  const params = useParams();
  const slug = params.slug as string;
  const router = useRouter();
  const { isAuthenticated, isLoading: authLoading } = useAuth();

  const [exam, setExam] = useState<(CertificationDetail & { questions: Question[] }) | null>(null);
  const [loading, setLoading] = useState(true);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [timeLeft, setTimeLeft] = useState<number>(0);
  const [submitting, setSubmitting] = useState(false);
  const [attemptId, setAttemptId] = useState<number | null>(null);
  
  // Execution state
  const [languages, setLanguages] = useState<SupportedLanguage[]>([]);
  const [selectedLangId, setSelectedLangId] = useState<number | null>(null);
  const [isRunning, setIsRunning] = useState(false);
  const [runResult, setRunResult] = useState<string | null>(null);
  const [activeResultTab, setActiveResultTab] = useState<'testcases' | 'output'>('testcases');
  
  const hasAutoSubmitted = useRef(false);

  const handleSubmit = useCallback(async () => {
    if (!attemptId || submitting) {
      return;
    }

    setSubmitting(true);

    try {
      await api.post(`/certifications/attempts/${attemptId}/submit`, { answers });
      router.push(`/certifications/${slug}/result?attempt_id=${attemptId}`);
    } catch {
      hasAutoSubmitted.current = false;
      alert('Error submitting exam. Please try again.');
      setSubmitting(false);
    }
  }, [answers, attemptId, router, slug, submitting]);

  useEffect(() => {
    if (authLoading) {
      return;
    }

    if (!isAuthenticated) {
      router.push(`/login?redirect=${encodeURIComponent(`/certifications/${slug}/exam`)}`);
      return;
    }

    let cancelled = false;

    async function loadExam() {
      try {
        const [detailResponse, startResponse, languagesResponse] = await Promise.all([
          api.get<{ certification: CertificationDetail }>(`/certifications/${slug}`),
          api.post<{ attempt: { id: number }; questions: Question[]; remaining_seconds: number }>(`/certifications/${slug}/start`, {}),
          api.get<{ languages: SupportedLanguage[] }>('/languages'),
        ]);

        if (cancelled) {
          return;
        }

        setExam({
          ...detailResponse.data.certification,
          questions: startResponse.data.questions,
        });
        setAttemptId(startResponse.data.attempt.id);
        setTimeLeft(startResponse.data.remaining_seconds);

        const availableLanguages = languagesResponse.data.languages;
        setLanguages(availableLanguages);
        const defaultLang = availableLanguages.find(l => l.monaco_id === 'javascript') || availableLanguages[0];
        if (defaultLang) {
          setSelectedLangId(defaultLang.id);
        }
      } catch {
        if (!cancelled) {
          router.push(`/certifications/${slug}`);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    void loadExam();

    return () => {
      cancelled = true;
    };
  }, [authLoading, isAuthenticated, router, slug]);

  useEffect(() => {
    if (!exam || timeLeft <= 0) {
      return;
    }

    const timer = window.setInterval(() => {
      setTimeLeft((current) => {
        if (current <= 1) {
          window.clearInterval(timer);
          return 0;
        }

        return current - 1;
      });
    }, 1000);

    return () => {
      window.clearInterval(timer);
    };
  }, [exam, timeLeft]);

  useEffect(() => {
    if (timeLeft === 0 && attemptId && !hasAutoSubmitted.current) {
      hasAutoSubmitted.current = true;
      void handleSubmit();
    }
  }, [attemptId, handleSubmit, timeLeft]);

  const handleOptionSelect = (questionId: number, value: string) => {
    setAnswers((current) => ({ ...current, [questionId]: value }));
  };

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;

    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const [activeQuestionIndex, setActiveQuestionIndex] = useState(0);

  const activeQuestion = exam?.questions[activeQuestionIndex];

  const handleRun = useCallback(async () => {
    if (!exam || submitting) return;

    if (!activeQuestion?.problem?.id || !selectedLangId) {
      alert('Cannot run code for this question. Missing problem or language.');
      return;
    }

    setIsRunning(true);
    setRunResult(null);

    try {
      const response = await api.post<{ message: string }>('/run', {
        problem_id: activeQuestion.problem.id,
        language_id: selectedLangId,
        source_code: answers[activeQuestion.id] || '',
      });

      setRunResult(response.data.message);
      setActiveResultTab('output');
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Run failed';
      setRunResult(`Error: ${message}`);
      setActiveResultTab('output');
    } finally {
      setIsRunning(false);
    }
  }, [activeQuestion, answers, exam, selectedLangId, submitting]);

  const handleCodeSubmit = useCallback(async () => {
    if (!exam || submitting) return;

    if (!activeQuestion?.problem?.id || !selectedLangId) {
      alert('Cannot submit code for this question. Missing problem or language.');
      return;
    }

    setIsRunning(true);
    setRunResult(null);

    try {
      const response = await api.post<{ submission: { status: string, uuid: string } }>('/submissions', {
        problem_id: activeQuestion.problem.id,
        language_id: selectedLangId,
        source_code: answers[activeQuestion.id] || '',
      });

      setRunResult(`Submission Status: ${response.data.submission.status}\nID: ${response.data.submission.uuid}`);
      setActiveResultTab('output');
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Submission failed';
      setRunResult(`Error: ${message}`);
      setActiveResultTab('output');
    } finally {
      setIsRunning(false);
    }
  }, [activeQuestion, answers, exam, selectedLangId, submitting]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0f1115] flex items-center justify-center">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-[#00d285]"></div>
      </div>
    );
  }

  if (!exam || !activeQuestion) {
    return null;
  }

  const isCoding = true;

  return (
    <div className="h-screen flex flex-col bg-[#0f1115] text-[#f8fafc] overflow-hidden">
      {/* Top Navbar Header */}
      <div className="h-[50px] shrink-0 bg-[#1a1c23] border-b border-[#2a2d35] flex items-center justify-between px-4">
        <div className="flex items-center gap-4">
          <button onClick={() => router.push(`/certifications/${slug}`)} className="text-[#94a3b8] hover:text-white transition-colors">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M15 18l-6-6 6-6"/></svg>
          </button>
          <h2 className="font-bold text-sm">{exam.title}</h2>
        </div>
        
        <div className="flex items-center gap-4">
          <div className={`font-mono font-bold text-sm flex items-center gap-2 bg-[#0f1115] px-3 py-1.5 rounded-lg border border-[#2a2d35] ${timeLeft < 300 ? 'text-red-500' : 'text-[#00d285]'}`}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
            {formatTime(timeLeft)}
          </div>
          <button
            onClick={() => void handleSubmit()}
            disabled={submitting}
            className="px-4 py-1.5 bg-[#00d285] text-black font-bold rounded-lg hover:bg-[#00e691] transition-colors disabled:opacity-50 text-xs"
          >
            {submitting ? 'Submitting...' : 'Submit Exam'}
          </button>
        </div>
      </div>

      {/* Main Split Layout */}
      <div className="flex-1 flex min-h-0">
        
        {/* Left Pane (Description & Non-coding Inputs) */}
        <div className={`${isCoding ? 'w-1/2 border-r border-[#2a2d35]' : 'w-full max-w-4xl mx-auto'} flex flex-col bg-[#1a1c23]`}>
          
          {/* Tabs header */}
          <div className="flex items-center gap-6 px-4 h-[44px] bg-[#1a1c23] border-b border-[#2a2d35] shrink-0 text-xs font-semibold">
            <button className="h-full border-b-2 border-[#00d285] text-[#00d285] flex items-center gap-2">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>
              Description
            </button>
            {isCoding && (
              <>
                <button className="h-full text-[#94a3b8] hover:text-white transition-colors flex items-center gap-2">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>
                  Editorial
                </button>
                <button className="h-full text-[#94a3b8] hover:text-white transition-colors flex items-center gap-2">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
                  Solutions
                </button>
                <button className="h-full text-[#94a3b8] hover:text-white transition-colors flex items-center gap-2">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>
                  Submissions
                </button>
              </>
            )}
          </div>

          <div className="flex-1 overflow-y-auto p-6 custom-scrollbar bg-[#0f1115]">
            <div className="flex items-start justify-between mb-4">
              <h1 className="text-xl font-bold flex-1">
                {activeQuestionIndex + 1}. {activeQuestion.question_text}
              </h1>
              <span className="text-xs text-[#00d285] font-bold bg-[#00d285]/10 px-2 py-1 rounded ml-4 shrink-0">
                {activeQuestion.points} pts
              </span>
            </div>

            {isCoding && (
              <div className="flex items-center gap-3 mb-6 text-[11px] font-semibold">
                {(() => {
                  const diff = activeQuestion.problem?.difficulty || 'easy';
                  const colorMap: Record<string, string> = { easy: '#00d285', medium: '#f59e0b', hard: '#ef4444' };
                  const color = colorMap[diff] || '#00d285';
                  return <span style={{ color, backgroundColor: `${color}15` }} className="px-2.5 py-1 rounded-full capitalize">{diff}</span>;
                })()}
                <span className="text-[#94a3b8] hover:text-white transition-colors flex items-center gap-1 cursor-pointer">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"/><line x1="7" y1="7" x2="7.01" y2="7"/></svg>
                  Topics
                </span>
                <span className="text-[#f59e0b] flex items-center gap-1">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>
                  Companies
                </span>
                <span className="text-[#94a3b8] hover:text-white transition-colors flex items-center gap-1 cursor-pointer">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>
                  Hint
                </span>
              </div>
            )}

            {/* Fill in the blank Input */}
            {activeQuestion.type === 'fill_blank' && (
              <div className="mt-8">
                <input
                  type="text"
                  value={answers[activeQuestion.id] || ''}
                  onChange={(event) => handleOptionSelect(activeQuestion.id, event.target.value)}
                  placeholder="Type your answer here..."
                  className="w-full bg-[#1a1c23] border border-[#2a2d35] rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#00d285] text-sm"
                />
              </div>
            )}

            {isCoding && activeQuestion.problem && (
              <div className="mt-6 space-y-6">
                <div className="text-sm text-[#cbd5e1] leading-relaxed whitespace-pre-wrap">
                  {activeQuestion.problem.description}
                </div>

                {activeQuestion.problem.input_format && (
                  <div>
                    <h3 className="font-bold mb-2">Input Format:</h3>
                    <div className="text-sm text-[#cbd5e1] whitespace-pre-wrap">{activeQuestion.problem.input_format}</div>
                  </div>
                )}

                {activeQuestion.problem.output_format && (
                  <div>
                    <h3 className="font-bold mb-2">Output Format:</h3>
                    <div className="text-sm text-[#cbd5e1] whitespace-pre-wrap">{activeQuestion.problem.output_format}</div>
                  </div>
                )}

                {(activeQuestion.problem.sample_input || activeQuestion.problem.sample_output) && (
                  <div>
                    <h3 className="font-bold mb-2">Example 1:</h3>
                    <div className="bg-[#1a1c23] p-4 rounded-lg border border-[#2a2d35] font-mono text-sm space-y-1">
                      {activeQuestion.problem.sample_input && (
                        <p><span className="text-white font-semibold">Input:</span> {activeQuestion.problem.sample_input}</p>
                      )}
                      {activeQuestion.problem.sample_output && (
                        <p><span className="text-white font-semibold">Output:</span> {activeQuestion.problem.sample_output}</p>
                      )}
                      {activeQuestion.problem.explanation && (
                        <p><span className="text-white font-semibold">Explanation:</span> {activeQuestion.problem.explanation}</p>
                      )}
                    </div>
                  </div>
                )}

                {activeQuestion.problem.constraints && (
                  <div>
                    <h3 className="font-bold mb-2">Constraints:</h3>
                    <div className="bg-[#1a1c23] p-4 rounded-lg border border-[#2a2d35] font-mono text-sm text-[#cbd5e1] whitespace-pre-wrap">
                      {activeQuestion.problem.constraints}
                    </div>
                  </div>
                )}
              </div>
            )}

            {isCoding && !activeQuestion.problem && (
              <div className="mt-6">
                <p className="text-sm text-[#cbd5e1] leading-relaxed">
                  Write your solution in the code editor on the right.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Right Pane (Code Editor & Output) */}
        {isCoding && (
          <div className="w-1/2 flex flex-col bg-[#1e1e1e]">
            {/* Editor Section */}
            <div className="flex-1 flex flex-col min-h-0 border-b border-[#2a2d35]">
              <div className="flex items-center gap-4 px-4 h-[44px] bg-[#1a1c23] border-b border-[#2a2d35] shrink-0">
                <div className="text-[#00d285] text-xs font-semibold flex items-center gap-2">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>
                  Code
                </div>
                <div className="flex-1" />
                <select 
                  value={selectedLangId || ''} 
                  onChange={(e) => setSelectedLangId(Number(e.target.value))}
                  className="bg-transparent text-xs font-semibold text-[#f8fafc] border-none outline-none cursor-pointer max-w-[150px]"
                >
                  {languages.map(lang => (
                    <option key={lang.id} value={lang.id} className="bg-[#1a1c23]">
                      {lang.name} {lang.version}
                    </option>
                  ))}
                </select>
                <button className="text-[#94a3b8] hover:text-white transition-colors">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>
                </button>
              </div>
              
              <div className="flex-1 relative">
                <MonacoEditor
                  height="100%"
                  language={languages.find(l => l.id === selectedLangId)?.monaco_id || 'javascript'}
                  theme="vs-dark"
                  value={answers[activeQuestion.id] || languages.find(l => l.id === selectedLangId)?.boilerplate_code || '// Write your solution here\n'}
                  onChange={(value) => handleOptionSelect(activeQuestion.id, value || '')}
                  options={{
                    minimap: { enabled: false },
                    fontSize: 14,
                    fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
                    padding: { top: 16 },
                    scrollBeyondLastLine: false,
                    wordWrap: "on",
                  }}
                />
              </div>
            </div>

            {/* Test Cases / Output Section */}
            <div className="h-[250px] shrink-0 flex flex-col bg-[#0f1115]">
              <div className="flex items-center px-4 h-[40px] bg-[#1a1c23] border-b border-[#2a2d35] shrink-0 text-xs font-semibold gap-6">
                <button 
                  onClick={() => setActiveResultTab('testcases')}
                  className={`h-full flex items-center gap-2 transition-colors ${
                    activeResultTab === 'testcases' ? 'border-b-2 border-[#00d285] text-[#00d285]' : 'text-[#94a3b8] hover:text-white'
                  }`}
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="9 11 12 14 22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg>
                  Testcases
                </button>
                <button 
                  onClick={() => setActiveResultTab('output')}
                  className={`h-full flex items-center gap-2 transition-colors ${
                    activeResultTab === 'output' ? 'border-b-2 border-[#00d285] text-[#00d285]' : 'text-[#94a3b8] hover:text-white'
                  }`}
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><line x1="3" y1="9" x2="21" y2="9"/><line x1="9" y1="21" x2="9" y2="9"/></svg>
                  Test Result
                </button>
              </div>
              
              <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
                {activeResultTab === 'testcases' ? (
                  <>
                    <div className="flex gap-2 mb-4">
                      <button className="px-3 py-1 bg-[#1a1c23] border border-[#2a2d35] rounded-lg text-xs font-semibold">Case 1</button>
                    </div>

                    <div className="space-y-3">
                      {activeQuestion.problem?.sample_input && (
                        <div>
                          <div className="text-xs text-[#94a3b8] font-semibold mb-1">Input =</div>
                          <div className="w-full bg-[#1a1c23] border border-[#2a2d35] rounded-lg px-3 py-2 font-mono text-sm whitespace-pre-wrap">
                            {activeQuestion.problem.sample_input}
                          </div>
                        </div>
                      )}
                      {activeQuestion.problem?.sample_output && (
                        <div>
                          <div className="text-xs text-[#94a3b8] font-semibold mb-1">Expected Output =</div>
                          <div className="w-full bg-[#1a1c23] border border-[#2a2d35] rounded-lg px-3 py-2 font-mono text-sm whitespace-pre-wrap">
                            {activeQuestion.problem.sample_output}
                          </div>
                        </div>
                      )}
                      {!activeQuestion.problem?.sample_input && !activeQuestion.problem?.sample_output && (
                        <div className="text-xs text-[#475569] italic">No test cases available for this question.</div>
                      )}
                    </div>
                  </>
                ) : (
                  <div className="h-full flex flex-col">
                    {runResult ? (
                      <div className="font-mono text-sm whitespace-pre-wrap text-[#cbd5e1]">{runResult}</div>
                    ) : (
                      <div className="flex-1 flex items-center justify-center text-sm text-[#64748b] italic">
                        Run your code to see the output here.
                      </div>
                    )}
                  </div>
                )}
              </div>
              
              <div className="h-[44px] shrink-0 border-t border-[#2a2d35] bg-[#1a1c23] flex items-center justify-between px-4">
                <button 
                  onClick={() => setActiveResultTab(prev => prev === 'output' ? 'testcases' : 'output')}
                  className="text-[#94a3b8] hover:text-white text-xs font-semibold flex items-center gap-2"
                >
                  Console
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={`transform transition-transform ${activeResultTab === 'output' ? 'rotate-180' : ''}`}><polyline points="18 15 12 9 6 15"/></svg>
                </button>
                <div className="flex gap-2">
                  <button 
                    onClick={() => void handleRun()} 
                    disabled={isRunning}
                    className="px-4 py-1.5 bg-[#2a2d35] hover:bg-[#3b3e46] disabled:opacity-50 text-white text-xs font-bold rounded-lg transition-colors flex items-center gap-2"
                  >
                    {isRunning ? (
                      <div className="w-3 h-3 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                    ) : null}
                    Run
                  </button>
                  <button 
                    onClick={() => void handleCodeSubmit()} 
                    disabled={isRunning}
                    className="px-4 py-1.5 bg-[#00d285] hover:bg-[#00e691] disabled:opacity-50 text-black text-xs font-bold rounded-lg transition-colors flex items-center gap-2"
                  >
                    Submit Code
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Bottom Navigation Bar */}
      <div className="h-[60px] shrink-0 bg-[#16181d] border-t border-[#2a2d35] flex items-center justify-between px-6 z-10">
        <button
          onClick={() => setActiveQuestionIndex(Math.max(0, activeQuestionIndex - 1))}
          disabled={activeQuestionIndex === 0}
          className="px-4 py-2 text-xs font-semibold text-[#f8fafc] bg-[#2a2d35] hover:bg-[#3b3e46] rounded-lg transition-colors disabled:opacity-50 flex items-center gap-2"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M15 18l-6-6 6-6"/></svg>
          Previous
        </button>

        <div className="flex gap-2">
          {exam.questions.map((q, idx) => {
            const isAnswered = answers[q.id] && answers[q.id].trim() !== '';
            const isActive = idx === activeQuestionIndex;
            return (
              <button
                key={q.id}
                onClick={() => setActiveQuestionIndex(idx)}
                className={`w-8 h-8 rounded flex items-center justify-center text-xs font-bold transition-all ${
                  isActive 
                    ? 'border-2 border-[#00d285] text-white bg-[#00d285]/10' 
                    : isAnswered 
                      ? 'bg-[#2a2d35] text-[#00d285]' 
                      : 'bg-[#1a1c23] text-[#64748b] hover:bg-[#2a2d35]'
                }`}
              >
                {idx + 1}
              </button>
            );
          })}
        </div>

        <button
          onClick={() => {
            if (activeQuestionIndex === exam.questions.length - 1) {
              void handleSubmit();
            } else {
              setActiveQuestionIndex(Math.min(exam.questions.length - 1, activeQuestionIndex + 1));
            }
          }}
          className="px-4 py-2 text-xs font-semibold text-[#f8fafc] bg-[#2a2d35] hover:bg-[#3b3e46] rounded-lg transition-colors flex items-center gap-2"
        >
          {activeQuestionIndex === exam.questions.length - 1 ? 'Finish' : 'Next'}
          {activeQuestionIndex !== exam.questions.length - 1 && <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 18l6-6-6-6"/></svg>}
        </button>
      </div>
    </div>
  );
}
