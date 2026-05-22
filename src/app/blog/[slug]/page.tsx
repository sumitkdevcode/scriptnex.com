'use client';

import { useEffect, useState, useRef, useCallback, useMemo } from 'react';
import { useParams } from 'next/navigation';
import { api } from '@/lib/api';
import Link from 'next/link';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import type { BlogPost } from '@/types/blog';
import '../blog.css';

interface RelatedPost {
  id: number;
  title: string;
  slug: string;
  excerpt: string | null;
  cover_image: string | null;
  category: { name: string; slug: string } | null;
  author: { name: string; avatar?: string };
  published_at: string | null;
  reading_time_minutes: number;
}

interface SuggestionPost {
  id: number;
  title: string;
  slug: string;
  cover_image: string | null;
  reading_time_minutes: number;
  published_at: string | null;
  category?: { name: string; slug: string } | null;
}

interface TocItem {
  id: string;
  text: string;
  level: number;
}

export default function BlogPostPage() {
  const params = useParams();
  const slug = params.slug as string;
  const [post, setPost] = useState<BlogPost | null>(null);
  const [related, setRelated] = useState<RelatedPost[]>([]);
  const [suggestions, setSuggestions] = useState<SuggestionPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState(0);
  const [activeHeading, setActiveHeading] = useState('');
  const [copied, setCopied] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    async function load() {
      try {
        const [postRes, suggestRes] = await Promise.all([
          api.get<{ post: BlogPost; related: RelatedPost[] }>(`/blog/${slug}`, { force: true }),
          api.get<{ data: SuggestionPost[] }>('/blog?page=1', { force: true }),
        ]);
        setPost(postRes.data.post);
        setRelated(postRes.data.related);
        // Filter out current post from suggestions
        const allSuggestions = (suggestRes as unknown as { data: SuggestionPost[] }).data || [];
        setSuggestions(allSuggestions.filter((s: SuggestionPost) => s.slug !== slug).slice(0, 10));
      } catch {
        // ignore
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [slug]);

  // Reading progress
  useEffect(() => {
    const handleScroll = () => {
      const windowHeight = window.innerHeight;
      const docHeight = document.documentElement.scrollHeight - windowHeight;
      const scrolled = window.scrollY;
      setProgress(docHeight > 0 ? Math.min((scrolled / docHeight) * 100, 100) : 0);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Parse TOC from content
  const toc = useMemo((): TocItem[] => {
    if (!post?.content) return [];
    const headingRegex = /^(#{2,4})\s+(.+)$/gm;
    const items: TocItem[] = [];
    let match;
    while ((match = headingRegex.exec(post.content)) !== null) {
      const level = match[1].length;
      const text = match[2].trim();
      const id = text
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, '');
      items.push({ id, text, level });
    }
    return items;
  }, [post?.content]);

  // Heading intersection observer for TOC active state
  useEffect(() => {
    if (!contentRef.current || toc.length === 0) return;

    const headings = contentRef.current.querySelectorAll('h2[id], h3[id], h4[id]');
    if (headings.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveHeading(entry.target.id);
          }
        }
      },
      { rootMargin: '-20% 0px -60% 0px', threshold: 0 }
    );

    headings.forEach((h) => observer.observe(h));
    return () => observer.disconnect();
  }, [toc, post]);

  // Render markdown to HTML (simple renderer — no external deps)
  const renderMarkdown = useCallback((md: string): string => {
    let html = md;

    // Code blocks (fenced)
    html = html.replace(/```(\w+)?\n([\s\S]*?)```/g, (_m, lang, code) => {
      const langAttr = lang ? ` data-lang="${lang}"` : '';
      return `<pre${langAttr}><code>${escapeHtml(code.trim())}</code></pre>`;
    });

    // Inline code
    html = html.replace(/`([^`]+)`/g, '<code>$1</code>');

    // Headings with IDs
    html = html.replace(/^#### (.+)$/gm, (_m, text) => {
      const id = text.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
      return `<h4 id="${id}">${text.trim()}</h4>`;
    });
    html = html.replace(/^### (.+)$/gm, (_m, text) => {
      const id = text.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
      return `<h3 id="${id}">${text.trim()}</h3>`;
    });
    html = html.replace(/^## (.+)$/gm, (_m, text) => {
      const id = text.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
      return `<h2 id="${id}">${text.trim()}</h2>`;
    });
    html = html.replace(/^# (.+)$/gm, '<h1>$1</h1>');

    // Bold & italic
    html = html.replace(/\*\*\*(.+?)\*\*\*/g, '<strong><em>$1</em></strong>');
    html = html.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
    html = html.replace(/\*(.+?)\*/g, '<em>$1</em>');

    // Links
    html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>');

    // Images
    html = html.replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '<img src="$2" alt="$1" loading="lazy" />');

    // Blockquotes
    html = html.replace(/^> (.+)$/gm, '<blockquote>$1</blockquote>');
    // Merge consecutive blockquotes
    html = html.replace(/<\/blockquote>\n<blockquote>/g, '\n');

    // Unordered lists
    html = html.replace(/^[\-\*] (.+)$/gm, '<li>$1</li>');
    html = html.replace(/((?:<li>.+<\/li>\n?)+)/g, '<ul>$1</ul>');

    // Ordered lists
    html = html.replace(/^\d+\. (.+)$/gm, '<li>$1</li>');

    // Horizontal rules
    html = html.replace(/^---+$/gm, '<hr />');

    // Tables
    html = html.replace(/^\|(.+)\|\n\|[-| :]+\|\n((?:\|.+\|\n?)+)/gm, (_m, header, body) => {
      const headers = header.split('|').map((h: string) => `<th>${h.trim()}</th>`).join('');
      const rows = body.trim().split('\n').map((row: string) => {
        const cells = row.replace(/^\||\|$/g, '').split('|').map((c: string) => `<td>${c.trim()}</td>`).join('');
        return `<tr>${cells}</tr>`;
      }).join('');
      return `<table><thead><tr>${headers}</tr></thead><tbody>${rows}</tbody></table>`;
    });

    // Paragraphs: wrap remaining lines that aren't already wrapped
    html = html
      .split('\n\n')
      .map((block) => {
        const trimmed = block.trim();
        if (!trimmed) return '';
        if (/^<[a-z]/.test(trimmed)) return trimmed;
        return `<p>${trimmed.replace(/\n/g, '<br />')}</p>`;
      })
      .join('\n');

    return html;
  }, []);

  const escapeHtml = (str: string) =>
    str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return '';
    return new Date(dateStr).toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShareTwitter = () => {
    const url = encodeURIComponent(window.location.href);
    const text = encodeURIComponent(post?.title || '');
    window.open(`https://twitter.com/intent/tweet?url=${url}&text=${text}&via=scriptnex`, '_blank');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0f1115] flex items-center justify-center">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-[#00d285]" />
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen flex flex-col bg-[#0f1115] text-[#f8fafc]">
        <Navbar />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-3xl font-bold mb-4">Post Not Found</h1>
            <p className="text-[#ababab] mb-6">The blog post you&apos;re looking for doesn&apos;t exist.</p>
            <Link href="/blog" className="px-5 py-2.5 bg-[#00d285] text-black font-bold rounded-lg hover:bg-[#00e691] transition-all text-sm">
              ← Back to Blog
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const renderedContent = renderMarkdown(post.content);

  // JSON-LD structured data
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.meta_title || post.title,
    description: post.meta_description || post.excerpt || '',
    image: post.cover_image || 'https://scriptnex.com/og-image.png',
    datePublished: post.published_at,
    dateModified: post.updated_at,
    author: {
      '@type': 'Person',
      name: post.author.name,
      url: `https://scriptnex.com/${post.author.username}`,
    },
    publisher: {
      '@type': 'Organization',
      name: 'ScriptNex',
      logo: {
        '@type': 'ImageObject',
        url: 'https://scriptnex.com/logo.png',
      },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `https://scriptnex.com/blog/${post.slug}`,
    },
    wordCount: post.content.split(/\s+/).length,
    timeRequired: `PT${post.reading_time_minutes}M`,
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#0f1115] text-[#f8fafc]">
      {/* Reading Progress Bar */}
      <div className="reading-progress" style={{ width: `${progress}%` }} />

      {/* JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <Navbar />

      <main className="flex-1 w-full max-w-7xl mx-auto px-6 py-8">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-xs text-[#ababab] mb-6">
          <Link href="/" className="hover:text-[#00d285] transition-colors">Home</Link>
          <span>›</span>
          <Link href="/blog" className="hover:text-[#00d285] transition-colors">Blog</Link>
          <span>›</span>
          <span className="text-[#f8fafc] truncate max-w-[200px]">{post.title}</span>
        </nav>

        {/* Hero */}
        <div className="blog-detail-hero">
          {post.cover_image ? (
            <img src={post.cover_image} alt={post.title} />
          ) : (
            <div className="blog-no-image" style={{ position: 'absolute', inset: 0 }}>📝</div>
          )}
          <div className="blog-detail-hero-overlay">
            {post.category && (
              <Link
                href={`/blog?category=${post.category.slug}`}
                className="inline-block text-[10px] font-bold uppercase tracking-wider text-[#00d285] bg-[#00d285]/15 px-2.5 py-1 rounded mb-3"
              >
                {post.category.name}
              </Link>
            )}
            <h1>{post.title}</h1>
            <div className="blog-detail-meta">
              <div className="author-info">
                <img src="/logo.png" alt="ScriptNex" className="author-avatar" />
                <span className="font-medium text-white">{post.author.name}</span>
              </div>
              <div className="dot" />
              <span>{formatDate(post.published_at)}</span>
              <div className="dot" />
              <span>{post.reading_time_minutes} min read</span>
              <div className="dot" />
              <span>{post.views_count.toLocaleString()} views</span>
            </div>
          </div>
        </div>

        {/* Tags */}
        {post.tags.length > 0 && (
          <div className="blog-tags">
            {post.tags.map((tag) => (
              <Link key={tag.id} href={`/blog?tag=${tag.slug}`} className="blog-tag">
                #{tag.name}
              </Link>
            ))}
          </div>
        )}

        {/* 3-Column Layout: Sidebar | Content | TOC */}
        <div className="blog-detail-layout">
          {/* Left Sidebar — Suggestions */}
          <aside className="blog-sidebar-left">
            <div className="blog-sidebar-section">
              <h4>Suggested Articles</h4>
              <div className="blog-sidebar-list">
                {suggestions.map((sp) => (
                  <Link key={sp.id} href={`/blog/${sp.slug}`} className="blog-sidebar-item" id={`suggest-${sp.id}`}>
                    {sp.cover_image ? (
                      <img src={sp.cover_image} alt={sp.title} className="blog-sidebar-thumb" />
                    ) : (
                      <div className="blog-sidebar-thumb blog-sidebar-thumb-placeholder">📄</div>
                    )}
                    <div className="blog-sidebar-item-info">
                      <span className="blog-sidebar-item-title">{sp.title}</span>
                      <span className="blog-sidebar-item-meta">{sp.reading_time_minutes} min read</span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </aside>

          {/* Main Content */}
          <div>
            <div
              ref={contentRef}
              className="blog-content"
              dangerouslySetInnerHTML={{ __html: renderedContent }}
            />

            {/* Share Buttons */}
            <div className="blog-share">
              <button className="blog-share-btn" onClick={handleCopyLink} id="share-copy-link">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
                  <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
                </svg>
                {copied ? 'Copied!' : 'Copy Link'}
              </button>
              <button className="blog-share-btn" onClick={handleShareTwitter} id="share-twitter">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
                Share on X
              </button>
            </div>

            {/* Author Card */}
            <div className="blog-author-card">
              <img src="/logo.png" alt="ScriptNex" className="avatar" />
              <div className="info">
                <h4>
                  <Link href={`/${post.author.username}`} className="hover:text-[#00d285] transition-colors">
                    {post.author.name}
                  </Link>
                </h4>
                <p>@{post.author.username}</p>
              </div>
            </div>
          </div>

          {/* Right Sidebar — Table of Contents */}
          {toc.length > 0 && (
            <div className="blog-toc">
              <h4>Table of Contents</h4>
              <ul>
                {toc.map((item) => (
                  <li key={item.id} className={item.level >= 3 ? 'depth-3' : ''}>
                    <a
                      href={`#${item.id}`}
                      className={activeHeading === item.id ? 'active' : ''}
                      onClick={(e) => {
                        e.preventDefault();
                        const el = document.getElementById(item.id);
                        if (el) {
                          el.scrollIntoView({ behavior: 'smooth', block: 'start' });
                        }
                      }}
                    >
                      {item.text}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Related Posts */}
        {related.length > 0 && (
          <div className="blog-related">
            <h3>Related Articles</h3>
            <div className="blog-related-grid">
              {related.map((rp) => (
                <Link key={rp.id} href={`/blog/${rp.slug}`} className="blog-card" id={`related-post-${rp.id}`}>
                  {rp.cover_image ? (
                    <img src={rp.cover_image} alt={rp.title} className="blog-card-image" />
                  ) : (
                    <div className="blog-card-image blog-no-image">📄</div>
                  )}
                  <div className="blog-card-body">
                    {rp.category && (
                      <span className="blog-card-category">{rp.category.name}</span>
                    )}
                    <h3 className="blog-card-title">{rp.title}</h3>
                    <p className="blog-card-excerpt">{rp.excerpt || ''}</p>
                    <div className="blog-card-footer">
                      <div className="blog-card-author">
                        <div className="blog-card-avatar">
                          {rp.author.name?.charAt(0)?.toUpperCase() || '?'}
                        </div>
                        <span className="blog-card-author-name">{rp.author.name}</span>
                      </div>
                      <div className="blog-card-meta">
                        <span>{rp.reading_time_minutes} min</span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
