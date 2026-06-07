import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Open Source | ScriptNex',
  description: 'Explore the open-source repositories of ScriptNex. Join our community and contribute to the future of coding education.',
};

export default function OpenSourcePage() {
  return (
    <div className="min-h-screen bg-[#0f1115] text-[#f8fafc] flex flex-col font-sans">
      <Navbar />
      <main className="flex-grow flex flex-col items-center justify-center py-20 px-6 relative overflow-hidden">
        
        {/* Background glow effects */}
        <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-[#00d285] opacity-10 rounded-full blur-[120px] pointer-events-none"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[30rem] h-[30rem] bg-blue-500 opacity-10 rounded-full blur-[150px] pointer-events-none"></div>

        <div className="max-w-5xl mx-auto text-center z-10">
          <div className="inline-flex items-center justify-center p-4 mb-6 rounded-2xl bg-[#1e2128] border border-[#2a2d35] shadow-[0_0_20px_rgba(0,210,133,0.1)]">
            <svg className="w-8 h-8 text-[#00d285]" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path d="M12 2C6.477 2 2 6.477 2 12c0 4.418 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.462-1.11-1.462-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.831.092-.646.35-1.086.636-1.336-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0 1 12 6.836c.85.004 1.705.114 2.504.336 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.164 22 16.418 22 12c0-5.523-4.477-10-10-10z" />
            </svg>
          </div>
          
          <h1 className="text-5xl md:text-6xl font-extrabold mb-6 tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white via-gray-200 to-gray-400">
            Proudly Open Source
          </h1>
          <p className="text-lg md:text-xl text-[#ababab] max-w-2xl mx-auto mb-16 leading-relaxed">
            ScriptNex is built by developers, for developers. We believe in the power of community-driven software. Explore our core repositories, contribute, and help us shape the future of coding education.
          </p>

          <div className="grid md:grid-cols-2 gap-8 text-left">
            {/* Main Application Repo */}
            <div className="group relative bg-[#15171c] border border-[#2a2d35] rounded-2xl p-6 sm:p-8 hover:border-[#00d285] transition-all duration-300 hover:shadow-[0_0_30px_rgba(0,210,133,0.1)] overflow-hidden">
              <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-10 transition-opacity">
                <svg className="w-32 h-32 text-[#00d285]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 6.75 22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3-4.5 16.5" />
                </svg>
              </div>
              <div className="relative z-10">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                  <h2 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-3 break-all sm:break-normal">
                    scriptnex.com
                  </h2>
                  <span className="flex items-center gap-1 text-xs font-medium text-[#ababab] bg-[#1e2128] px-3 py-1.5 rounded-full border border-[#2a2d35]">
                    <span className="w-2 h-2 rounded-full bg-yellow-500"></span> Next.js
                  </span>
                </div>
                <p className="text-[#ababab] mb-8 line-clamp-3">
                  The core web application for ScriptNex. Built with Next.js, React, and Tailwind CSS. This repository contains the student-facing platform, problem solving environment, and interactive learning tracks.
                </p>
                <div className="flex gap-4">
                  <a 
                    href="https://github.com/sumitkdevcode/scriptnex.com" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-white text-black font-semibold rounded-xl hover:bg-gray-200 transition-colors"
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path d="M12 2C6.477 2 2 6.477 2 12c0 4.418 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.462-1.11-1.462-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.831.092-.646.35-1.086.636-1.336-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0 1 12 6.836c.85.004 1.705.114 2.504.336 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.164 22 16.418 22 12c0-5.523-4.477-10-10-10z" />
                    </svg>
                    View Repository
                  </a>
                </div>
              </div>
            </div>

            {/* Admin Dashboard Repo */}
            <div className="group relative bg-[#15171c] border border-[#2a2d35] rounded-2xl p-6 sm:p-8 hover:border-blue-500 transition-all duration-300 hover:shadow-[0_0_30px_rgba(59,130,246,0.1)] overflow-hidden">
              <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-10 transition-opacity">
                <svg className="w-32 h-32 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5.25 14.25h13.5m-13.5 0a3 3 0 0 1-3-3m3 3a3 3 0 1 0 0 6h13.5a3 3 0 1 0 0-6m-16.5-3a3 3 0 0 1 3-3h13.5a3 3 0 0 1 3 3m-19.5 0a4.5 4.5 0 0 1 .9-2.7L5.737 5.1a3.375 3.375 0 0 1 2.7-1.35h7.126c1.062 0 2.062.5 2.7 1.35l2.587 3.45a4.5 4.5 0 0 1 .9 2.7m0 0a3 3 0 0 1-3 3m0 3h.008v.008h-.008v-.008Zm0-6h.008v.008h-.008v-.008Zm-10.5 6h.008v.008h-.008v-.008Zm0-6h.008v.008h-.008v-.008Z" />
                </svg>
              </div>
              <div className="relative z-10">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                  <h2 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-3 break-all sm:break-normal">
                    admin.scriptnex.com
                  </h2>
                  <span className="flex items-center gap-1 text-xs font-medium text-[#ababab] bg-[#1e2128] px-3 py-1.5 rounded-full border border-[#2a2d35]">
                    <span className="w-2 h-2 rounded-full bg-red-500"></span> Laravel
                  </span>
                </div>
                <p className="text-[#ababab] mb-8 line-clamp-3">
                  The powerful backend and administrative dashboard driving the ScriptNex platform. Built with Laravel and PHP. It handles user management, problem execution validation, APIs, and overall system architecture.
                </p>
                <div className="flex gap-4">
                  <a 
                    href="https://github.com/sumitkdevcode/admin.scriptnex.com" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-white text-black font-semibold rounded-xl hover:bg-gray-200 transition-colors"
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path d="M12 2C6.477 2 2 6.477 2 12c0 4.418 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.462-1.11-1.462-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.831.092-.646.35-1.086.636-1.336-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0 1 12 6.836c.85.004 1.705.114 2.504.336 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.164 22 16.418 22 12c0-5.523-4.477-10-10-10z" />
                    </svg>
                    View Repository
                  </a>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-12 sm:mt-20 p-6 sm:p-10 border border-[#2a2d35] rounded-2xl bg-gradient-to-b from-[#15171c] to-[#0f1115]">
            <h3 className="text-2xl font-bold mb-4 text-white">How to Contribute</h3>
            <p className="text-[#ababab] mb-8 max-w-3xl mx-auto">
              We welcome contributions of all kinds! Whether it's fixing a bug, adding a new coding problem, improving documentation, or building an entirely new feature. Read our contributing guidelines on GitHub to get started.
            </p>
            <div className="flex flex-col sm:flex-row justify-center items-start sm:items-center gap-4 sm:gap-8 text-sm text-[#ababab]">
              <span className="flex items-center gap-2">
                <span className="flex items-center justify-center w-6 h-6 rounded-full bg-[#1e2128] text-[#00d285]">1</span>
                Fork the repo
              </span>
              <span className="flex items-center gap-2">
                <span className="flex items-center justify-center w-6 h-6 rounded-full bg-[#1e2128] text-[#00d285]">2</span>
                Create a branch
              </span>
              <span className="flex items-center gap-2">
                <span className="flex items-center justify-center w-6 h-6 rounded-full bg-[#1e2128] text-[#00d285]">3</span>
                Submit a PR
              </span>
            </div>
          </div>

        </div>
      </main>
      <Footer />
    </div>
  );
}
