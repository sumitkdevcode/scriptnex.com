'use client';

import { useEffect, useState, useCallback } from 'react';
import { useParams } from 'next/navigation';
import { api } from '@/lib/api';
import { useAuth } from '@/contexts/AuthContext';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import type { ProblemDetail, SampleCase, SupportedLanguage } from '@/types/problem';

const MonacoEditor = dynamic(() => import('@monaco-editor/react'), { ssr: false });

export default function ProblemDetailPage() {
  const params = useParams();
  const slug = params.slug as string;
  const { isAuthenticated } = useAuth();

  const [problem, setProblem] = useState<ProblemDetail | null>(null);
  const [sampleCases, setSampleCases] = useState<SampleCase[]>([]);
  const [languages, setLanguages] = useState<SupportedLanguage[]>([]);
  const [selectedLang, setSelectedLang] = useState<SupportedLanguage | null>(null);
  const [code, setCode] = useState('');
  const [activeTab, setActiveTab] = useState<'description' | 'editorial'>('description');
  const [resultTab, setResultTab] = useState<'testcases' | 'output'>('testcases');
  const [submitting, setSubmitting] = useState(false);
  const [runResult, setRunResult] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const [probRes, langRes] = await Promise.all([
        api.get<{ problem: ProblemDetail; sample_cases: SampleCase[] }>(`/problems/${slug}`),
        api.get<{ languages: SupportedLanguage[] }>('/languages'),
      ]);
      setProblem(probRes.data.problem);
      setSampleCases(probRes.data.sample_cases);
      setLanguages(langRes.data.languages);
      if (langRes.data.languages.length > 0) {
        const defaultLang = langRes.data.languages.find(l => l.monaco_id === 'python') || langRes.data.languages[0];
        setSelectedLang(defaultLang);
        setCode(defaultLang.boilerplate_code || '');
      }
      setLoading(false);
    }
    load();
  }, [slug]);

  const handleLanguageChange = useCallback((langId: string) => {
    const lang = languages.find(l => l.id === Number(langId));
    if (lang) {
      setSelectedLang(lang);
      setCode(lang.boilerplate_code || '');
    }
  }, [languages]);

  const handleSubmit = useCallback(async () => {
    if (!problem || !selectedLang || !isAuthenticated) return;
    setSubmitting(true);
    setRunResult(null);
    try {
      const res = await api.post<{ submission: { uuid: string; status: string } }>('/submissions', {
        problem_id: problem.id,
        language_id: selectedLang.id,
        source_code: code,
      });
      setRunResult(`Submitted! Status: ${res.data.submission.status} (UUID: ${res.data.submission.uuid})`);
      setResultTab('output');
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Submission failed';
      setRunResult(`Error: ${msg}`);
    } finally {
      setSubmitting(false);
    }
  }, [problem, selectedLang, code, isAuthenticated]);

  const handleRun = useCallback(async () => {
    if (!problem || !selectedLang || !isAuthenticated) return;
    setSubmitting(true);
    setRunResult(null);
    try {
      const res = await api.post<{ results: unknown[]; message: string }>('/run', {
        problem_id: problem.id,
        language_id: selectedLang.id,
        source_code: code,
      });
      setRunResult(res.data.message);
      setResultTab('output');
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Run failed';
      setRunResult(`Error: ${msg}`);
    } finally {
      setSubmitting(false);
    }
  }, [problem, selectedLang, code, isAuthenticated]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#0f1115]">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-[#00d285]"></div>
      </div>
    );
  }

  if (!problem) {
    return <div className="flex items-center justify-center min-h-screen bg-[#0f1115] text-white">Problem not found.</div>;
  }

  const diffConfig: Record<string, { color: string }> = {
    easy: { color: '#00d285' },
    medium: { color: '#f59e0b' },
    hard: { color: '#ef4444' },
    expert: { color: '#a855f7' },
  };

  return (
    <div className="h-screen flex flex-col bg-[#0f1115] text-[#f8fafc] overflow-hidden">
      {/* Top Bar */}
      <div className="flex items-center justify-between px-4 py-2 border-b border-[#2a2d35] bg-[#16181d] shrink-0">
        <div className="flex items-center gap-3">
          <Link href="/problems" className="text-[#94a3b8] hover:text-white transition-colors">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M15 18l-6-6 6-6"/></svg>
          </Link>
          <span className="font-semibold">{problem.title}</span>
          <span className="px-2 py-0.5 rounded text-[11px] font-semibold capitalize" style={{ color: diffConfig[problem.difficulty]?.color }}>
            {problem.difficulty}
          </span>
        </div>
        <div className="flex items-center gap-3">
          {/* Language Selector */}
          <select
            value={selectedLang?.id || ''}
            onChange={(e) => handleLanguageChange(e.target.value)}
            className="px-3 py-1.5 bg-[#1a1c23] border border-[#2a2d35] rounded-lg text-xs text-white focus:outline-none focus:border-[#00d285]"
          >
            {languages.map((l) => (
              <option key={l.id} value={l.id}>{l.name} {l.version}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Main Split View */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Panel — Problem Description */}
        <div className="w-[45%] border-r border-[#2a2d35] flex flex-col overflow-hidden">
          {/* Tabs */}
          <div className="flex border-b border-[#2a2d35] shrink-0">
            <button onClick={() => setActiveTab('description')} className={`px-5 py-3 text-xs font-semibold uppercase tracking-wider transition-colors ${activeTab === 'description' ? 'text-[#00d285] border-b-2 border-[#00d285]' : 'text-[#64748b] hover:text-white'}`}>Description</button>
            <button onClick={() => setActiveTab('editorial')} className={`px-5 py-3 text-xs font-semibold uppercase tracking-wider transition-colors ${activeTab === 'editorial' ? 'text-[#00d285] border-b-2 border-[#00d285]' : 'text-[#64748b] hover:text-white'}`}>Editorial</button>
          </div>

          <div className="flex-1 overflow-y-auto p-6 space-y-5">
            {activeTab === 'description' ? (
              <>
                {/* Metadata */}
                <div className="flex items-center gap-4 text-xs text-[#94a3b8]">
                  {problem.category && <span className="px-2.5 py-1 bg-white/5 rounded">{problem.category.name}</span>}
                  <span>⏱ {problem.time_limit_ms}ms</span>
                  <span>💾 {Math.round(problem.memory_limit_kb / 1024)}MB</span>
                </div>

                {/* Description */}
                <div className="prose prose-invert prose-sm max-w-none">
                  <div className="whitespace-pre-wrap text-sm leading-relaxed text-[#cbd5e1]">{problem.description}</div>
                </div>

                {/* Input/Output Format */}
                {problem.input_format && (
                  <div>
                    <h3 className="text-xs uppercase tracking-wider text-[#64748b] font-semibold mb-2">Input Format</h3>
                    <p className="text-sm text-[#cbd5e1] whitespace-pre-wrap">{problem.input_format}</p>
                  </div>
                )}
                {problem.output_format && (
                  <div>
                    <h3 className="text-xs uppercase tracking-wider text-[#64748b] font-semibold mb-2">Output Format</h3>
                    <p className="text-sm text-[#cbd5e1] whitespace-pre-wrap">{problem.output_format}</p>
                  </div>
                )}

                {/* Constraints */}
                {problem.constraints && (
                  <div>
                    <h3 className="text-xs uppercase tracking-wider text-[#64748b] font-semibold mb-2">Constraints</h3>
                    <pre className="text-sm text-[#cbd5e1] bg-[#1a1c23] rounded-lg p-3 border border-[#2a2d35] whitespace-pre-wrap">{problem.constraints}</pre>
                  </div>
                )}

                {/* Sample Cases */}
                {sampleCases.map((sc, idx) => (
                  <div key={sc.id} className="space-y-2">
                    <h3 className="text-xs uppercase tracking-wider text-[#64748b] font-semibold">Example {idx + 1}</h3>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <div className="text-[10px] uppercase tracking-wider text-[#475569] mb-1 font-semibold">Input</div>
                        <pre className="text-sm bg-[#1a1c23] border border-[#2a2d35] rounded-lg p-3 text-[#00d285] font-mono">{sc.input}</pre>
                      </div>
                      <div>
                        <div className="text-[10px] uppercase tracking-wider text-[#475569] mb-1 font-semibold">Output</div>
                        <pre className="text-sm bg-[#1a1c23] border border-[#2a2d35] rounded-lg p-3 text-[#00d285] font-mono">{sc.expected_output}</pre>
                      </div>
                    </div>
                  </div>
                ))}

                {/* Explanation */}
                {problem.explanation && (
                  <div>
                    <h3 className="text-xs uppercase tracking-wider text-[#64748b] font-semibold mb-2">Explanation</h3>
                    <p className="text-sm text-[#cbd5e1] whitespace-pre-wrap">{problem.explanation}</p>
                  </div>
                )}
              </>
            ) : (
              <div className="text-sm text-[#cbd5e1]">
                {problem.editorial ? (
                  <div className="whitespace-pre-wrap">{problem.editorial}</div>
                ) : (
                  <p className="text-[#64748b]">Editorial not available yet.</p>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Right Panel — Editor + Results */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Code Editor */}
          <div className="flex-1 min-h-0">
            <MonacoEditor
              height="100%"
              language={selectedLang?.monaco_id || 'python'}
              theme="vs-dark"
              value={code}
              onChange={(val) => setCode(val || '')}
              options={{
                fontSize: 14,
                minimap: { enabled: false },
                scrollBeyondLastLine: false,
                padding: { top: 16 },
                fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
                lineNumbers: 'on',
                renderLineHighlight: 'gutter',
                automaticLayout: true,
              }}
            />
          </div>

          {/* Result Panel */}
          <div className="h-[200px] border-t border-[#2a2d35] flex flex-col shrink-0">
            <div className="flex items-center justify-between px-4 py-2 border-b border-[#2a2d35] bg-[#16181d]">
              <div className="flex gap-4">
                <button onClick={() => setResultTab('testcases')} className={`text-xs font-semibold uppercase tracking-wider ${resultTab === 'testcases' ? 'text-[#00d285]' : 'text-[#64748b]'}`}>Test Cases</button>
                <button onClick={() => setResultTab('output')} className={`text-xs font-semibold uppercase tracking-wider ${resultTab === 'output' ? 'text-[#00d285]' : 'text-[#64748b]'}`}>Output</button>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={handleRun}
                  disabled={submitting || !isAuthenticated}
                  className="px-4 py-1.5 bg-[#1a1c23] border border-[#2a2d35] rounded-lg text-xs font-semibold text-white hover:border-[#00d285]/50 transition-colors disabled:opacity-50"
                >
                  Run Code
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={submitting || !isAuthenticated}
                  className="px-4 py-1.5 bg-[#00d285] rounded-lg text-xs font-bold text-black hover:bg-[#00e691] transition-colors disabled:opacity-50"
                >
                  {submitting ? 'Submitting...' : 'Submit'}
                </button>
              </div>
            </div>
            <div className="flex-1 overflow-y-auto p-4 bg-[#0f1115]">
              {resultTab === 'testcases' ? (
                <div className="space-y-3">
                  {sampleCases.map((sc, idx) => (
                    <div key={sc.id} className="bg-[#16181d] border border-[#2a2d35] rounded-lg p-3">
                      <div className="text-[10px] uppercase tracking-wider text-[#64748b] font-semibold mb-2">Case {idx + 1}</div>
                      <div className="grid grid-cols-2 gap-3 text-xs font-mono">
                        <div><span className="text-[#475569]">Input:</span> <span className="text-[#cbd5e1]">{sc.input}</span></div>
                        <div><span className="text-[#475569]">Expected:</span> <span className="text-[#00d285]">{sc.expected_output}</span></div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-sm font-mono">
                  {runResult ? (
                    <pre className="text-[#cbd5e1] whitespace-pre-wrap">{runResult}</pre>
                  ) : (
                    <p className="text-[#64748b]">Run or submit your code to see results.</p>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
