import { Metadata } from 'next';
import Link from 'next/link';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import type { BlogPost } from '@/types/blog';
import '../blog.css';
import { ReadingProgress, ShareButtons, TableOfContents } from './BlogInteractive';

interface RelatedPost {
  id: number;
  title: string;
  slug: string;
  excerpt: string | null;
  cover_image: string | null;
  category: { name: string; slug: string } | null;
  author: { name: string; avatar?: string; username: string };
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

interface PageProps {
  params: Promise<{
    slug: string;
  }>;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000/api/v1';

async function getBlogPost(slug: string) {
  try {
    const res = await fetch(`${API_URL}/blog/${slug}`, {
      headers: { 'Accept': 'application/json' },
      next: { revalidate: 3600 }
    });
    if (!res.ok) return null;
    return res.json();
  } catch (e) {
    return null;
  }
}

async function getSuggestions() {
  try {
    const res = await fetch(`${API_URL}/blog?page=1`, {
      headers: { 'Accept': 'application/json' },
      next: { revalidate: 3600 }
    });
    if (!res.ok) return null;
    return res.json();
  } catch (e) {
    return null;
  }
}

function escapeHtml(str: string) {
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function renderMarkdown(md: string): string {
  let html = md;

  // --- Automated SEO Internal Backlinking ---
  // Safely extract code blocks and existing links to avoid replacing keywords inside them
  const codeBlocks: string[] = [];
  html = html.replace(/```[\s\S]*?```/g, (match) => {
    codeBlocks.push(match);
    return `___CODE_BLOCK_${codeBlocks.length - 1}___`;
  });
  
  const inlineCodes: string[] = [];
  html = html.replace(/`[^`]+`/g, (match) => {
    inlineCodes.push(match);
    return `___INLINE_CODE_${inlineCodes.length - 1}___`;
  });

  const links: string[] = [];
  html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, (match) => {
    links.push(match);
    return `___LINK_${links.length - 1}___`;
  });

  // Auto-link keywords (only the first occurrence per post to avoid spam)
  const seoLinks = [
    { regex: /\b(Python)\b/i, url: '/tracks' },
    { regex: /\b(JavaScript)\b/i, url: '/tracks' },
    { regex: /\b(React)\b/i, url: '/tracks' },
    { regex: /\b(Java)\b/i, url: '/tracks' },
    { regex: /\b(Coding Contests?)\b/i, url: '/contests' },
    { regex: /\b(Hackathons?)\b/i, url: '/contests' },
    { regex: /\b(Certifications?)\b/i, url: '/certifications' },
    { regex: /\b(Practice Problems?)\b/i, url: '/problems' },
    { regex: /\b(Data Structures?)\b/i, url: '/tracks' },
    { regex: /\b(Algorithms?)\b/i, url: '/tracks' },
  ];

  seoLinks.forEach(({ regex, url }) => {
    let replaced = false;
    html = html.replace(new RegExp(regex.source, 'ig'), (match) => {
      if (!replaced) {
        replaced = true;
        return `[${match}](${url})`;
      }
      return match;
    });
  });

  // Restore extracted blocks
  links.forEach((link, i) => { html = html.replace(`___LINK_${i}___`, link); });
  inlineCodes.forEach((code, i) => { html = html.replace(`___INLINE_CODE_${i}___`, code); });
  codeBlocks.forEach((code, i) => { html = html.replace(`___CODE_BLOCK_${i}___`, code); });
  // -------------------------------------------

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
  // Paragraphs
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
}

function extractToc(md: string) {
  const headingRegex = /^(#{2,4})\s+(.+)$/gm;
  const items = [];
  let match;
  while ((match = headingRegex.exec(md)) !== null) {
    const level = match[1].length;
    const text = match[2].trim();
    const id = text
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '');
    items.push({ id, text, level });
  }
  return items;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const data = await getBlogPost(slug);
  const post = data?.data?.post;

  if (!post) {
    return {
      title: 'Post Not Found | ScriptNex',
    };
  }

  return {
    title: `${post.meta_title || post.title} | ScriptNex Blog`,
    description: post.meta_description || post.excerpt,
    alternates: {
      canonical: `https://scriptnex.com/blog/${slug}`,
    },
    openGraph: {
      title: post.meta_title || post.title,
      description: post.meta_description || post.excerpt,
      url: `https://scriptnex.com/blog/${slug}`,
      images: [post.cover_image || 'https://scriptnex.com/og-image.png'],
      type: 'article',
      publishedTime: post.published_at,
    }
  };
}

export default async function BlogPostPage({ params }: PageProps) {
  const { slug } = await params;
  
  const [postData, suggestionsData] = await Promise.all([
    getBlogPost(slug),
    getSuggestions()
  ]);

  const post: BlogPost = postData?.data?.post;
  const related: RelatedPost[] = postData?.data?.related || [];
  
  const allSuggestions: SuggestionPost[] = suggestionsData?.data || [];
  const suggestions = allSuggestions.filter((s) => s.slug !== slug).slice(0, 10);

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
  const toc = extractToc(post.content);

  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return '';
    return new Date(dateStr).toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    });
  };

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
      <ReadingProgress />

      {/* JSON-LD for SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <Navbar />

      <main className="flex-1 w-full max-w-7xl mx-auto px-6 py-8">
        <nav className="flex items-center gap-2 text-xs text-[#ababab] mb-6">
          <Link href="/" className="hover:text-[#00d285] transition-colors">Home</Link>
          <span>›</span>
          <Link href="/blog" className="hover:text-[#00d285] transition-colors">Blog</Link>
          <span>›</span>
          <span className="text-[#f8fafc] truncate max-w-[200px]">{post.title}</span>
        </nav>

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

        {post.tags.length > 0 && (
          <div className="blog-tags">
            {post.tags.map((tag) => (
              <Link key={tag.id} href={`/blog?tag=${tag.slug}`} className="blog-tag">
                #{tag.name}
              </Link>
            ))}
          </div>
        )}

        <div className="blog-detail-layout">
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

          <div>
            <div
              className="blog-content"
              dangerouslySetInnerHTML={{ __html: renderedContent }}
            />

            <ShareButtons title={post.title} />

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

          <TableOfContents toc={toc} />
        </div>

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
