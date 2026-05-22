'use client';

import { useEffect, useState, useCallback } from 'react';
import { api } from '@/lib/api';
import { useAuth } from '@/contexts/AuthContext';
import type { BlogPost, CreateBlogPostPayload, UpdateBlogPostPayload } from '@/types/blog';

type BlogCategory = { id: number; name: string; slug: string };
type BlogTag = { id: number; name: string; slug: string };

interface AdminPost extends BlogPost {
  author: { id: number; name: string; username: string; avatar?: string };
  category: { id: number; name: string; slug: string } | null;
  tags: BlogTag[];
}

type StatusFilter = 'all' | 'draft' | 'published' | 'archived';
type EditorTab = 'write' | 'preview';

export default function AdminBlogPage() {
  const { user } = useAuth();
  const [posts, setPosts] = useState<AdminPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');

  // Editor state
  const [editorOpen, setEditorOpen] = useState(false);
  const [editingPost, setEditingPost] = useState<AdminPost | null>(null);
  const [saving, setSaving] = useState(false);
  const [editorTab, setEditorTab] = useState<EditorTab>('write');
  const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null);
  const [deleting, setDeleting] = useState(false);

  // Form fields
  const [title, setTitle] = useState('');
  const [excerpt, setExcerpt] = useState('');
  const [content, setContent] = useState('');
  const [coverImage, setCoverImage] = useState('');
  const [categoryId, setCategoryId] = useState<number | null>(null);
  const [selectedTags, setSelectedTags] = useState<number[]>([]);
  const [status, setStatus] = useState<'draft' | 'published' | 'archived'>('draft');
  const [isFeatured, setIsFeatured] = useState(false);
  const [metaTitle, setMetaTitle] = useState('');
  const [metaDescription, setMetaDescription] = useState('');
  const [publishedAt, setPublishedAt] = useState('');

  // Available categories/tags
  const [categories, setCategories] = useState<BlogCategory[]>([]);
  const [tags, setTags] = useState<BlogTag[]>([]);
  const [error, setError] = useState<string | null>(null);

  const isAdmin = user?.role === 'admin';

  const fetchPosts = useCallback(async () => {
    try {
      const params = statusFilter !== 'all' ? `?status=${statusFilter}` : '';
      const res = await api.get<{ data: AdminPost[] }>(`/admin/blog${params}`, { force: true });
      const data = (res as unknown as { data: AdminPost[] }).data || [];
      setPosts(data);
    } catch {
      setError('Failed to load posts');
    } finally {
      setLoading(false);
    }
  }, [statusFilter]);

  useEffect(() => {
    if (!isAdmin) return;
    fetchPosts();
  }, [fetchPosts, isAdmin]);

  // Load categories and tags
  useEffect(() => {
    async function loadMeta() {
      try {
        // Reuse existing endpoints to get categories and tags
        const [catRes, tagRes] = await Promise.all([
          api.get<{ data: BlogCategory[] }>('/blog/tags').catch(() => ({ data: { tags: [] } })),
          api.get<{ tags: BlogTag[] }>('/blog/tags').catch(() => ({ data: { tags: [] } })),
        ]);
        // Get tags from the blog tags endpoint
        const tagsData = (tagRes as unknown as { data: { tags: BlogTag[] } }).data?.tags || [];
        setTags(tagsData);

        // For categories, we'll just let users type or select from existing posts
        const uniqueCategories: BlogCategory[] = [];
        const seen = new Set<number>();
        posts.forEach(p => {
          if (p.category && !seen.has(p.category.id)) {
            seen.add(p.category.id);
            uniqueCategories.push(p.category);
          }
        });
        setCategories(uniqueCategories);
        void catRes; // used for side effects
      } catch {
        // ignore
      }
    }
    loadMeta();
  }, [posts]);

  const resetForm = () => {
    setTitle('');
    setExcerpt('');
    setContent('');
    setCoverImage('');
    setCategoryId(null);
    setSelectedTags([]);
    setStatus('draft');
    setIsFeatured(false);
    setMetaTitle('');
    setMetaDescription('');
    setPublishedAt('');
    setEditorTab('write');
    setError(null);
  };

  const openNewPost = () => {
    resetForm();
    setEditingPost(null);
    setEditorOpen(true);
  };

  const openEditPost = (post: AdminPost) => {
    setTitle(post.title);
    setExcerpt(post.excerpt || '');
    setContent(post.content);
    setCoverImage(post.cover_image || '');
    setCategoryId(post.category?.id || null);
    setSelectedTags(post.tags.map(t => t.id));
    setStatus(post.status);
    setIsFeatured(post.is_featured);
    setMetaTitle(post.meta_title || '');
    setMetaDescription(post.meta_description || '');
    setPublishedAt(post.published_at ? new Date(post.published_at).toISOString().slice(0, 16) : '');
    setEditorTab('write');
    setEditingPost(post);
    setEditorOpen(true);
    setError(null);
  };

  const handleSave = async () => {
    if (!title.trim() || !content.trim()) {
      setError('Title and content are required.');
      return;
    }

    setSaving(true);
    setError(null);

    try {
      const payload: CreateBlogPostPayload | UpdateBlogPostPayload = {
        title,
        excerpt: excerpt || undefined,
        content,
        cover_image: coverImage || undefined,
        category_id: categoryId,
        tags: selectedTags.length > 0 ? selectedTags : undefined,
        status,
        is_featured: isFeatured,
        meta_title: metaTitle || undefined,
        meta_description: metaDescription || undefined,
        published_at: publishedAt || null,
      };

      if (editingPost) {
        await api.put(`/admin/blog/${editingPost.id}`, payload);
      } else {
        await api.post('/admin/blog', payload);
      }

      setEditorOpen(false);
      resetForm();
      await fetchPosts();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save post');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: number) => {
    setDeleting(true);
    try {
      await api.delete(`/admin/blog/${id}`);
      setDeleteConfirm(null);
      await fetchPosts();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete');
    } finally {
      setDeleting(false);
    }
  };

  const renderMarkdownPreview = (md: string): string => {
    let html = md;
    html = html.replace(/```(\w+)?\n([\s\S]*?)```/g, (_m, lang, code) => {
      return `<pre data-lang="${lang || ''}"><code>${code.replace(/</g, '&lt;').replace(/>/g, '&gt;').trim()}</code></pre>`;
    });
    html = html.replace(/`([^`]+)`/g, '<code>$1</code>');
    html = html.replace(/^#### (.+)$/gm, '<h4>$1</h4>');
    html = html.replace(/^### (.+)$/gm, '<h3>$1</h3>');
    html = html.replace(/^## (.+)$/gm, '<h2>$1</h2>');
    html = html.replace(/^# (.+)$/gm, '<h1>$1</h1>');
    html = html.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
    html = html.replace(/\*(.+?)\*/g, '<em>$1</em>');
    html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>');
    html = html.replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '<img src="$2" alt="$1" style="max-width:100%;border-radius:8px;" />');
    html = html.replace(/^> (.+)$/gm, '<blockquote>$1</blockquote>');
    html = html.replace(/^[\-\*] (.+)$/gm, '<li>$1</li>');
    html = html.replace(/((?:<li>.+<\/li>\n?)+)/g, '<ul>$1</ul>');
    html = html.replace(/^---+$/gm, '<hr />');
    html = html.split('\n\n').map(block => {
      const t = block.trim();
      if (!t) return '';
      if (/^<[a-z]/.test(t)) return t;
      return `<p>${t.replace(/\n/g, '<br />')}</p>`;
    }).join('\n');
    return html;
  };

  const statusColors: Record<string, string> = {
    draft: '#f59e0b',
    published: '#00d285',
    archived: '#ababab',
  };

  const formatDate = (d: string | null) => {
    if (!d) return '—';
    return new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  if (!isAdmin) {
    return (
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2">Access Denied</h2>
          <p className="text-[#ababab]">You need admin privileges to manage blog posts.</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-[#00d285]" />
      </div>
    );
  }

  return (
    <div className="flex-1 w-full max-w-6xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">Blog Management</h1>
          <p className="text-[#ababab] text-sm mt-1">{posts.length} total posts</p>
        </div>
        <button
          onClick={openNewPost}
          className="px-5 py-2.5 bg-[#00d285] text-black font-bold rounded-lg hover:bg-[#00e691] transition-all text-sm flex items-center gap-2"
          id="new-blog-post-btn"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          New Post
        </button>
      </div>

      {/* Status Filter Tabs */}
      <div className="flex gap-2 mb-6">
        {(['all', 'published', 'draft', 'archived'] as StatusFilter[]).map((f) => (
          <button
            key={f}
            onClick={() => setStatusFilter(f)}
            className={`px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all ${
              statusFilter === f
                ? 'bg-[#00d285] text-black'
                : 'bg-[#16181d] text-[#ababab] border border-[#2a2d35] hover:border-[#00d285] hover:text-[#00d285]'
            }`}
            id={`filter-${f}`}
          >
            {f}
          </button>
        ))}
      </div>

      {/* Error */}
      {error && !editorOpen && (
        <div className="error-box mb-4">
          <span>⚠️</span> {error}
        </div>
      )}

      {/* Posts Table */}
      {posts.length > 0 ? (
        <div className="bg-[#16181d] border border-[#2a2d35] rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[#2a2d35]">
                  <th className="text-left px-5 py-3 text-[10px] font-bold uppercase tracking-wider text-[#ababab]">Title</th>
                  <th className="text-left px-5 py-3 text-[10px] font-bold uppercase tracking-wider text-[#ababab]">Status</th>
                  <th className="text-left px-5 py-3 text-[10px] font-bold uppercase tracking-wider text-[#ababab]">Category</th>
                  <th className="text-left px-5 py-3 text-[10px] font-bold uppercase tracking-wider text-[#ababab]">Views</th>
                  <th className="text-left px-5 py-3 text-[10px] font-bold uppercase tracking-wider text-[#ababab]">Date</th>
                  <th className="text-right px-5 py-3 text-[10px] font-bold uppercase tracking-wider text-[#ababab]">Actions</th>
                </tr>
              </thead>
              <tbody>
                {posts.map((post) => (
                  <tr key={post.id} className="border-b border-[#2a2d35]/50 hover:bg-[#1a1c23] transition-colors">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        {post.cover_image ? (
                          <img src={post.cover_image} alt="" className="w-10 h-10 rounded-lg object-cover flex-shrink-0" />
                        ) : (
                          <div className="w-10 h-10 rounded-lg bg-[#2a2d35] flex items-center justify-center text-sm flex-shrink-0">📄</div>
                        )}
                        <div className="min-w-0">
                          <div className="font-semibold text-sm truncate max-w-[280px]">{post.title}</div>
                          <div className="text-[11px] text-[#ababab]">/{post.slug}</div>
                        </div>
                        {post.is_featured && (
                          <span className="text-[9px] font-bold uppercase bg-[#f59e0b]/15 text-[#f59e0b] px-1.5 py-0.5 rounded flex-shrink-0">⭐</span>
                        )}
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <span
                        className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full"
                        style={{
                          color: statusColors[post.status],
                          backgroundColor: `${statusColors[post.status]}15`,
                        }}
                      >
                        {post.status}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-xs text-[#ababab]">{post.category?.name || '—'}</td>
                    <td className="px-5 py-4 text-xs text-[#ababab]">{post.views_count.toLocaleString()}</td>
                    <td className="px-5 py-4 text-xs text-[#ababab]">{formatDate(post.published_at || post.created_at)}</td>
                    <td className="px-5 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => openEditPost(post)}
                          className="p-2 rounded-lg hover:bg-[#2a2d35] transition-colors text-[#ababab] hover:text-[#00d285]"
                          title="Edit"
                          id={`edit-post-${post.id}`}
                        >
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                          </svg>
                        </button>
                        <button
                          onClick={() => setDeleteConfirm(post.id)}
                          className="p-2 rounded-lg hover:bg-[#ef4444]/10 transition-colors text-[#ababab] hover:text-[#ef4444]"
                          title="Delete"
                          id={`delete-post-${post.id}`}
                        >
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <polyline points="3 6 5 6 21 6" /><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                          </svg>
                        </button>
                        {post.status === 'published' && (
                          <a
                            href={`/blog/${post.slug}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-2 rounded-lg hover:bg-[#2a2d35] transition-colors text-[#ababab] hover:text-white"
                            title="View"
                          >
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" /><polyline points="15 3 21 3 21 9" /><line x1="10" y1="14" x2="21" y2="3" />
                            </svg>
                          </a>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="text-center py-20 bg-[#16181d] border border-[#2a2d35] rounded-2xl">
          <div className="text-4xl mb-4">📝</div>
          <h3 className="text-lg font-bold mb-2">No blog posts yet</h3>
          <p className="text-[#ababab] text-sm mb-4">Create your first blog post to get started.</p>
          <button
            onClick={openNewPost}
            className="px-5 py-2.5 bg-[#00d285] text-black font-bold rounded-lg hover:bg-[#00e691] transition-all text-sm"
          >
            Create Post
          </button>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirm !== null && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setDeleteConfirm(null)}>
          <div className="bg-[#16181d] border border-[#2a2d35] rounded-2xl p-6 max-w-sm w-full" onClick={e => e.stopPropagation()}>
            <div className="text-center">
              <div className="w-12 h-12 rounded-full bg-[#ef4444]/10 flex items-center justify-center mx-auto mb-4">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2">
                  <polyline points="3 6 5 6 21 6" /><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                </svg>
              </div>
              <h3 className="text-lg font-bold mb-2">Delete Post?</h3>
              <p className="text-[#ababab] text-sm mb-6">This action cannot be undone. The post will be permanently removed.</p>
              <div className="flex gap-3">
                <button
                  onClick={() => setDeleteConfirm(null)}
                  className="flex-1 px-4 py-2.5 bg-[#2a2d35] text-white font-semibold rounded-lg hover:bg-[#3b3e46] transition-all text-sm"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleDelete(deleteConfirm)}
                  disabled={deleting}
                  className="flex-1 px-4 py-2.5 bg-[#ef4444] text-white font-semibold rounded-lg hover:bg-[#dc2626] transition-all text-sm disabled:opacity-50"
                  id="confirm-delete-btn"
                >
                  {deleting ? 'Deleting...' : 'Delete'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Editor Modal */}
      {editorOpen && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-start justify-center overflow-y-auto p-4 pt-8 pb-8">
          <div className="bg-[#0f1115] border border-[#2a2d35] rounded-2xl w-full max-w-5xl shadow-2xl" onClick={e => e.stopPropagation()}>
            {/* Editor Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-[#2a2d35]">
              <h2 className="text-lg font-bold">
                {editingPost ? 'Edit Post' : 'New Blog Post'}
              </h2>
              <div className="flex items-center gap-3">
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="px-5 py-2 bg-[#00d285] text-black font-bold rounded-lg hover:bg-[#00e691] transition-all text-sm disabled:opacity-50 flex items-center gap-2"
                  id="save-post-btn"
                >
                  {saving ? (
                    <>
                      <span className="spinner" style={{ width: 14, height: 14, borderWidth: 2 }} />
                      Saving...
                    </>
                  ) : (
                    <>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                      {editingPost ? 'Update' : 'Create'}
                    </>
                  )}
                </button>
                <button
                  onClick={() => { setEditorOpen(false); resetForm(); }}
                  className="p-2 rounded-lg hover:bg-[#2a2d35] transition-colors text-[#ababab] hover:text-white"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Editor Body */}
            <div className="p-6 space-y-5">
              {/* Error */}
              {error && (
                <div className="error-box">
                  <span>⚠️</span> {error}
                </div>
              )}

              {/* Title */}
              <div>
                <input
                  type="text"
                  placeholder="Post title..."
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-4 py-3 bg-[#16181d] border border-[#2a2d35] rounded-xl text-xl font-bold text-white placeholder-[#ababab] outline-none focus:border-[#00d285] transition-colors"
                  id="post-title-input"
                />
              </div>

              {/* Excerpt */}
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-[#ababab] mb-2">Excerpt</label>
                <textarea
                  placeholder="Brief summary for cards and SEO..."
                  value={excerpt}
                  onChange={(e) => setExcerpt(e.target.value)}
                  rows={2}
                  className="w-full px-4 py-3 bg-[#16181d] border border-[#2a2d35] rounded-xl text-sm text-white placeholder-[#ababab] outline-none focus:border-[#00d285] transition-colors resize-none"
                  id="post-excerpt-input"
                />
              </div>

              {/* Content Editor with Write/Preview Toggle */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-[#ababab]">Content (Markdown)</label>
                  <div className="flex bg-[#16181d] border border-[#2a2d35] rounded-lg overflow-hidden">
                    <button
                      onClick={() => setEditorTab('write')}
                      className={`px-3 py-1.5 text-xs font-semibold transition-colors ${
                        editorTab === 'write' ? 'bg-[#00d285] text-black' : 'text-[#ababab] hover:text-white'
                      }`}
                    >
                      Write
                    </button>
                    <button
                      onClick={() => setEditorTab('preview')}
                      className={`px-3 py-1.5 text-xs font-semibold transition-colors ${
                        editorTab === 'preview' ? 'bg-[#00d285] text-black' : 'text-[#ababab] hover:text-white'
                      }`}
                    >
                      Preview
                    </button>
                  </div>
                </div>

                {editorTab === 'write' ? (
                  <textarea
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    rows={18}
                    placeholder="Write your blog post content in Markdown..."
                    className="w-full px-4 py-3 bg-[#16181d] border border-[#2a2d35] rounded-xl text-sm text-white placeholder-[#ababab] outline-none focus:border-[#00d285] transition-colors resize-y font-mono leading-relaxed"
                    id="post-content-editor"
                  />
                ) : (
                  <div
                    className="min-h-[400px] px-5 py-4 bg-[#16181d] border border-[#2a2d35] rounded-xl overflow-auto"
                    style={{
                      fontSize: 14,
                      lineHeight: 1.7,
                      color: '#ababab',
                    }}
                  >
                    {content ? (
                      <div dangerouslySetInnerHTML={{ __html: renderMarkdownPreview(content) }}
                        style={{
                          // Inline styles for preview since blog.css might not be loaded
                        }}
                      />
                    ) : (
                      <p className="text-[#ababab] italic">Nothing to preview yet.</p>
                    )}
                  </div>
                )}
              </div>

              {/* Settings Grid */}
              <div className="grid grid-cols-2 gap-4">
                {/* Cover Image */}
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-[#ababab] mb-2">Cover Image URL</label>
                  <input
                    type="text"
                    placeholder="https://..."
                    value={coverImage}
                    onChange={(e) => setCoverImage(e.target.value)}
                    className="w-full px-3 py-2.5 bg-[#16181d] border border-[#2a2d35] rounded-lg text-sm text-white placeholder-[#ababab] outline-none focus:border-[#00d285] transition-colors"
                    id="post-cover-image"
                  />
                  {coverImage && (
                    <img src={coverImage} alt="Preview" className="mt-2 h-20 rounded-lg object-cover" onError={(e) => (e.currentTarget.style.display = 'none')} />
                  )}
                </div>

                {/* Category */}
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-[#ababab] mb-2">Category</label>
                  <select
                    value={categoryId || ''}
                    onChange={(e) => setCategoryId(e.target.value ? Number(e.target.value) : null)}
                    className="w-full px-3 py-2.5 bg-[#16181d] border border-[#2a2d35] rounded-lg text-sm text-white outline-none focus:border-[#00d285] transition-colors"
                    id="post-category"
                  >
                    <option value="">No category</option>
                    {categories.map(c => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>

                {/* Status */}
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-[#ababab] mb-2">Status</label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value as 'draft' | 'published' | 'archived')}
                    className="w-full px-3 py-2.5 bg-[#16181d] border border-[#2a2d35] rounded-lg text-sm text-white outline-none focus:border-[#00d285] transition-colors"
                    id="post-status"
                  >
                    <option value="draft">📝 Draft</option>
                    <option value="published">✅ Published</option>
                    <option value="archived">📦 Archived</option>
                  </select>
                </div>

                {/* Publish Date */}
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-[#ababab] mb-2">Publish Date</label>
                  <input
                    type="datetime-local"
                    value={publishedAt}
                    onChange={(e) => setPublishedAt(e.target.value)}
                    className="w-full px-3 py-2.5 bg-[#16181d] border border-[#2a2d35] rounded-lg text-sm text-white outline-none focus:border-[#00d285] transition-colors"
                    id="post-publish-date"
                  />
                </div>
              </div>

              {/* Tags */}
              {tags.length > 0 && (
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-[#ababab] mb-2">Tags</label>
                  <div className="flex flex-wrap gap-2">
                    {tags.map(tag => (
                      <button
                        key={tag.id}
                        onClick={() => {
                          setSelectedTags(prev =>
                            prev.includes(tag.id)
                              ? prev.filter(t => t !== tag.id)
                              : [...prev, tag.id]
                          );
                        }}
                        className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
                          selectedTags.includes(tag.id)
                            ? 'bg-[#00d285] text-black'
                            : 'bg-[#16181d] border border-[#2a2d35] text-[#ababab] hover:border-[#00d285] hover:text-[#00d285]'
                        }`}
                      >
                        {tag.name}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Featured Toggle */}
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setIsFeatured(!isFeatured)}
                  className={`relative w-11 h-6 rounded-full transition-colors ${
                    isFeatured ? 'bg-[#00d285]' : 'bg-[#2a2d35]'
                  }`}
                  id="post-featured-toggle"
                >
                  <span className={`absolute top-1 left-1 w-4 h-4 rounded-full bg-white transition-transform ${
                    isFeatured ? 'translate-x-5' : ''
                  }`} />
                </button>
                <span className="text-sm font-medium">Featured Post</span>
              </div>

              {/* SEO Section */}
              <details className="bg-[#16181d] border border-[#2a2d35] rounded-xl">
                <summary className="px-4 py-3 text-xs font-bold uppercase tracking-wider text-[#ababab] cursor-pointer hover:text-white transition-colors">
                  🔍 SEO Settings (Optional)
                </summary>
                <div className="px-4 pb-4 space-y-3">
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-[#ababab] mb-1">Meta Title</label>
                    <input
                      type="text"
                      placeholder="Custom SEO title..."
                      value={metaTitle}
                      onChange={(e) => setMetaTitle(e.target.value)}
                      className="w-full px-3 py-2 bg-[#0f1115] border border-[#2a2d35] rounded-lg text-sm text-white placeholder-[#ababab] outline-none focus:border-[#00d285] transition-colors"
                      id="post-meta-title"
                    />
                    <div className="text-[10px] text-[#ababab] mt-1">{metaTitle.length}/60 characters</div>
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-[#ababab] mb-1">Meta Description</label>
                    <textarea
                      placeholder="Custom SEO description..."
                      value={metaDescription}
                      onChange={(e) => setMetaDescription(e.target.value)}
                      rows={2}
                      className="w-full px-3 py-2 bg-[#0f1115] border border-[#2a2d35] rounded-lg text-sm text-white placeholder-[#ababab] outline-none focus:border-[#00d285] transition-colors resize-none"
                      id="post-meta-desc"
                    />
                    <div className="text-[10px] text-[#ababab] mt-1">{metaDescription.length}/160 characters</div>
                  </div>
                </div>
              </details>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
