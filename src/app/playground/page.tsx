'use client';

import { useEffect, useState, useCallback } from 'react';
import { api } from '@/lib/api';
import dynamic from 'next/dynamic';

import { useAuth } from '@/contexts/AuthContext';

const MonacoEditor = dynamic(() => import('@monaco-editor/react'), { ssr: false });

interface Language { id: number; name: string; version: string; monaco_id: string; boilerplate_code?: string; }

export default function PlaygroundPage() {
  const { isAuthenticated } = useAuth();
  const [languages, setLanguages] = useState<Language[]>([]);
  const [selectedLangId, setSelectedLangId] = useState<number | null>(null);
  const [code, setCode] = useState('// Start coding here...\n');
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [isRunning, setIsRunning] = useState(false);
  const [title, setTitle] = useState('Untitled');
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    api.get<{ languages: Language[] }>('/languages').then(r => {
      setLanguages(r.data.languages);
      const defaultLang = r.data.languages.find(l => l.monaco_id === 'javascript') || r.data.languages[0];
      if (defaultLang) {
        setSelectedLangId(defaultLang.id);
        setCode(defaultLang.boilerplate_code || '// Start coding...\n');
      }
    });
  }, []);

  const selectedLang = languages.find(l => l.id === selectedLangId);

  const handleRun = useCallback(async () => {
    if (!selectedLangId || isRunning) return;
    setIsRunning(true);
    setOutput('Running...');
    try {
      const res = await api.post<{ output?: string; error?: string; message?: string }>('/playground/run', {
        language_id: selectedLangId,
        source_code: code,
        stdin: input,
      });
      setOutput(res.data.message || res.data.output || 'No output');
    } catch (err: unknown) {
      setOutput(`Error: ${err instanceof Error ? err.message : 'Run failed'}`);
    } finally {
      setIsRunning(false);
    }
  }, [code, selectedLangId, isRunning, input]);

  const handleSave = async () => {
    if (!isAuthenticated) { alert('Login to save snippets'); return; }
    try {
      const res = await api.post<{ snippet: { uuid: string } }>('/snippets', {
        title,
        language_id: selectedLangId,
        source_code: code,
        is_public: true,
      });
      setSaved(true);
      const shareUrl = `${window.location.origin}/playground?snippet=${res.data.snippet.uuid}`;
      navigator.clipboard.writeText(shareUrl);
      setTimeout(() => setSaved(false), 3000);
    } catch {
      alert('Failed to save');
    }
  };

  return (
    <div className="h-screen flex flex-col bg-[#0f1115] text-[#f8fafc]">
      {/* Top Bar */}
      <div className="h-[50px] shrink-0 bg-[#1a1c23] border-b border-[#2a2d35] flex items-center justify-between px-4">
        <div className="flex items-center gap-4">
          <a href="/" className="text-[#00d285] font-bold text-sm">ScriptNex</a>
          <span className="text-[#2a2d35]">|</span>
          <span className="text-sm font-semibold">Code Playground</span>
        </div>
        <div className="flex items-center gap-3">
          <input
            value={title}
            onChange={e => setTitle(e.target.value)}
            className="bg-transparent text-sm text-[#ababab] border-none outline-none w-40 text-right"
            placeholder="Untitled"
          />
          <select
            value={selectedLangId || ''}
            onChange={e => {
              const id = Number(e.target.value);
              setSelectedLangId(id);
              const lang = languages.find(l => l.id === id);
              if (lang?.boilerplate_code && code.length < 50) setCode(lang.boilerplate_code);
            }}
            className="bg-[#0f1115] text-xs font-semibold text-white border border-[#2a2d35] rounded px-2 py-1"
          >
            {languages.map(l => <option key={l.id} value={l.id}>{l.name} {l.version}</option>)}
          </select>
          <button onClick={handleRun} disabled={isRunning} className="px-4 py-1.5 bg-[#2a2d35] hover:bg-[#3b3e46] text-white text-xs font-bold rounded transition-colors disabled:opacity-50">
            {isRunning ? '⏳ Running...' : '▶ Run'}
          </button>
          <button onClick={handleSave} className="px-4 py-1.5 bg-[#00d285] hover:bg-[#00e691] text-black text-xs font-bold rounded transition-colors">
            {saved ? '✅ Copied Link!' : '💾 Save & Share'}
          </button>
        </div>
      </div>

      {/* Editor + Output */}
      <div className="flex-1 flex min-h-0">
        {/* Editor */}
        <div className="flex-1 flex flex-col border-r border-[#2a2d35]">
          <MonacoEditor
            height="100%"
            language={selectedLang?.monaco_id || 'javascript'}
            theme="vs-dark"
            value={code}
            onChange={v => setCode(v || '')}
            options={{
              minimap: { enabled: false },
              fontSize: 14,
              fontFamily: "'JetBrains Mono', monospace",
              padding: { top: 16 },
              scrollBeyondLastLine: false,
              wordWrap: 'on',
            }}
          />
        </div>

        {/* Input / Output Panel */}
        <div className="w-[400px] flex flex-col bg-[#0f1115]">
          <div className="flex-1 flex flex-col border-b border-[#2a2d35]">
            <div className="h-[36px] bg-[#1a1c23] border-b border-[#2a2d35] flex items-center px-4 text-xs font-semibold text-[#ababab]">
              Input (stdin)
            </div>
            <textarea
              value={input}
              onChange={e => setInput(e.target.value)}
              placeholder="Enter input here..."
              className="flex-1 bg-transparent text-sm font-mono p-4 resize-none outline-none text-white placeholder-[#3b3e46]"
            />
          </div>
          <div className="flex-1 flex flex-col">
            <div className="h-[36px] bg-[#1a1c23] border-b border-[#2a2d35] flex items-center px-4 text-xs font-semibold text-[#ababab]">
              Output
            </div>
            <pre className="flex-1 p-4 text-sm font-mono text-[#ababab] whitespace-pre-wrap overflow-auto">
              {output || 'Run your code to see output here.'}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
}
