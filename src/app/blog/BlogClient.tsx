'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import { api } from '@/lib/api';
import Link from 'next/link';
import Image from 'next/image';
import type { BlogPostListItem, BlogPostTag } from '@/types/blog';

export interface FeaturedPost {
  id: number;
  title: string;
  slug: string;
  excerpt: string | null;
  cover_image: string | null;
  category: { name: string; slug: string } | null;
  author: { name: string; username: string; avatar?: string };
  published_at: string | null;
  reading_time_minutes: number;
}

interface BlogClientProps {
  initialPosts: BlogPostListItem[];
  initialFeatured: FeaturedPost[];
  initialTags: (BlogPostTag & { posts_count: number })[];
  initialHasMore: boolean;
}

export default function BlogClient({
  initialPosts,
  initialFeatured,
  initialTags,
  initialHasMore
}: BlogClientProps) {
  const [posts, setPosts] = useState<BlogPostListItem[]>(initialPosts);
  const [featured] = useState<FeaturedPost[]>(initialFeatured);
  const [tags] = useState<(BlogPostTag & { posts_count: number })[]>(initialTags);
  const [loadingMore, setLoadingMore] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(initialHasMore);
  const [search, setSearch] = useState('');
  const [activeTag, setActiveTag] = useState<string | null>(null);
  const [searchTimeout, setSearchTimeout] = useState<NodeJS.Timeout | null>(null);
  const [isSearching, setIsSearching] = useState(false);

  const fetchPosts = useCallback(async (pageNum: number, query: string, tag: string | null, append = false) => {
    try {
      const params = new URLSearchParams();
      params.set('page', String(pageNum));
      if (query) params.set('q', query);
      if (tag) params.set('tag', tag);

      const res = await api.get<{ data: BlogPostListItem[] }>(`/blog?${params.toString()}`, { force: true });

      const newPosts: BlogPostListItem[] = (res as any).data || [];
      const meta = (res as any).meta;

      if (append) {
        setPosts(prev => {
          // simple deduplication based on ID
          const existingIds = new Set(prev.map(p => p.id));
          const uniqueNewPosts = newPosts.filter(p => !existingIds.has(p.id));
          return [...prev, ...uniqueNewPosts];
        });
      } else {
        setPosts(newPosts);
      }

      setHasMore(meta?.last_page ? pageNum < meta.last_page : newPosts.length >= 12);
    } catch {
      // ignore
    } finally {
      setIsSearching(false);
    }
  }, []);

  const handleSearch = (value: string) => {
    setSearch(value);
    if (searchTimeout) clearTimeout(searchTimeout);
    
    // Only show loading state if it's a new search and not clearing
    if (value) setIsSearching(true);
    
    const timeout = setTimeout(() => {
      setPage(1);
      fetchPosts(1, value, activeTag);
    }, 400);
    setSearchTimeout(timeout);
  };

  const handleTagClick = (tagSlug: string | null) => {
    setActiveTag(tagSlug);
    setPage(1);
    setIsSearching(true);
    fetchPosts(1, search, tagSlug);
  };

  const observerTarget = useRef<HTMLDivElement>(null);

  const loadMore = useCallback(async () => {
    if (loadingMore || !hasMore || isSearching) return;
    const nextPage = page + 1;
    setLoadingMore(true);
    setPage(nextPage);
    await fetchPosts(nextPage, search, activeTag, true);
    setLoadingMore(false);
  }, [page, search, activeTag, fetchPosts, loadingMore, hasMore, isSearching]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !loadingMore && !isSearching) {
          loadMore();
        }
      },
      { threshold: 0.1, rootMargin: '400px' }
    );

    const target = observerTarget.current;
    if (target) observer.observe(target);

    return () => {
      if (target) observer.unobserve(target);
    };
  }, [loadMore, hasMore, loadingMore, isSearching]);

  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return '';
    return new Date(dateStr).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  return (
    <>
      {/* Hero */}
      <div className="blog-hero">
        <div className="inline-flex items-center gap-1.5 text-[#00d285] text-[10px] font-bold uppercase tracking-[0.15em] px-3 py-1.5 rounded mb-5" style={{ background: 'rgba(0,210,133,0.08)', border: '1px solid rgba(0,210,133,0.12)' }}>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M12 20h9"/><path d="M16.376 3.622a1 1 0 0 1 3.002 3.002L7.368 18.635a2 2 0 0 1-.855.506l-2.872.838a.5.5 0 0 1-.62-.62l.838-2.872a2 2 0 0 1 .506-.855z"/></svg>
          Blog
        </div>
        <h1>Insights &amp; Tutorials</h1>
        <p>
          Deep dives into programming, system design, and developer career growth.
        </p>

        {/* Search */}
        <div className="blog-search">
          <svg className="blog-search-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
          </svg>
          <input
            type="text"
            placeholder="Search articles..."
            value={search}
            onChange={(e) => handleSearch(e.target.value)}
            id="blog-search-input"
          />
        </div>
      </div>

      {/* Tag Filters */}
      {tags.length > 0 && (
        <div className="blog-filters">
          <button
            className={`blog-filter-chip ${!activeTag ? 'active' : ''}`}
            onClick={() => handleTagClick(null)}
          >
            All
          </button>
          {tags.slice(0, 10).map((tag) => (
            <button
              key={tag.id}
              className={`blog-filter-chip ${activeTag === tag.slug ? 'active' : ''}`}
              onClick={() => handleTagClick(tag.slug)}
            >
              {tag.name} ({tag.posts_count})
            </button>
          ))}
        </div>
      )}

      {/* Featured Section */}
      {featured.length > 0 && !search && !activeTag && (
        <div className="blog-featured">
          <div className="blog-featured-grid">
            {featured.slice(0, 3).map((post, i) => (
              <Link
                key={post.id}
                href={`/blog/${post.slug}`}
                className={`blog-featured-card ${i === 0 ? 'primary' : ''}`}
                id={`featured-post-${post.id}`}
              >
                {post.cover_image ? (
                  <Image 
                    src={post.cover_image} 
                    alt={post.title} 
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className="card-image object-cover" 
                    priority={i === 0} 
                  />
                ) : (
                  <div className="blog-no-image card-image flex items-center justify-center text-4xl">📄</div>
                )}
                <div className="blog-featured-overlay">
                  <div className="featured-badge">⭐ Featured</div>
                  {post.category && (
                    <span className="text-[10px] text-[#00d285] font-bold uppercase tracking-wider block mb-1">
                      {post.category.name}
                    </span>
                  )}
                  <h3>{post.title}</h3>
                  <div className="meta">
                    <span>{post.author.name}</span>
                    <span>{formatDate(post.published_at)}</span>
                    <span>{post.reading_time_minutes} min read</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Blog Grid */}
      {isSearching ? (
        <div className="py-20 flex justify-center">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-[#00d285]" />
        </div>
      ) : posts.length > 0 ? (
        <>
          <div className="blog-grid">
            {posts.map((post, i) => (
              <Link
                key={post.id}
                href={`/blog/${post.slug}`}
                className="blog-card"
                style={{ animationDelay: `${(i % 12) * 60}ms` }}
                id={`blog-card-${post.id}`}
              >
                {post.cover_image ? (
                  <div className="relative w-full aspect-[16/10]">
                    <Image 
                      src={post.cover_image} 
                      alt={post.title} 
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      className="blog-card-image object-cover" 
                    />
                  </div>
                ) : (
                  <div className="blog-card-image blog-no-image flex items-center justify-center text-4xl aspect-[16/10]">📄</div>
                )}
                <div className="blog-card-body">
                  {post.category && (
                    <span className="blog-card-category">{post.category.name}</span>
                  )}
                  <h3 className="blog-card-title">{post.title}</h3>
                  <p className="blog-card-excerpt">{post.excerpt || ''}</p>
                  <div className="blog-card-footer">
                    <div className="blog-card-author">
                      <Image src="/logo.png" alt="ScriptNex" width={24} height={24} className="blog-card-avatar" />
                      <span className="blog-card-author-name">{post.author.name}</span>
                    </div>
                    <div className="blog-card-meta">
                      <span>{post.reading_time_minutes} min</span>
                      <span>•</span>
                      <span>{formatDate(post.published_at)}</span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {/* Infinite Scroll Trigger */}
          {hasMore && (
            <div ref={observerTarget} className="flex justify-center items-center py-12">
              {loadingMore && (
                <div className="flex items-center gap-3 text-[#ababab] font-medium text-sm">
                  <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-[#00d285]" />
                  <span>Loading more articles...</span>
                </div>
              )}
            </div>
          )}
        </>
      ) : (
        <div className="blog-empty">
          <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
            <polyline points="14 2 14 8 20 8" />
            <line x1="16" y1="13" x2="8" y2="13" />
            <line x1="16" y1="17" x2="8" y2="17" />
            <polyline points="10 9 9 9 8 9" />
          </svg>
          <h3>No articles found</h3>
          <p>Try adjusting your search or filter criteria.</p>
        </div>
      )}
    </>
  );
}
