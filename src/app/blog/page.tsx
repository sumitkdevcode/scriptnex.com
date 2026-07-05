import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import BlogClient, { FeaturedPost } from './BlogClient';
import type { BlogPostListItem, BlogPostTag } from '@/types/blog';
import { getPageMetadata } from '@/lib/seo';
import { Metadata } from 'next';
import './blog.css';

export async function generateMetadata(): Promise<Metadata> {
  return await getPageMetadata("/blog");
}

export default async function BlogPage() {
  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000/api/v1';

  try {
    const [featuredRes, tagsRes, postsRes] = await Promise.all([
      fetch(`${API_URL}/blog/featured`, { next: { revalidate: 60 } }),
      fetch(`${API_URL}/blog/tags`, { next: { revalidate: 3600 } }),
      fetch(`${API_URL}/blog?page=1`, { next: { revalidate: 60 } })
    ]);

    const featuredData = await featuredRes.json();
    const tagsData = await tagsRes.json();
    const postsData = await postsRes.json();

    const initialFeatured: FeaturedPost[] = featuredData?.data?.posts || [];
    const initialTags: (BlogPostTag & { posts_count: number })[] = tagsData?.data?.tags || [];
    const initialPosts: BlogPostListItem[] = postsData?.data || [];
    
    // Safety check for pagination meta
    let initialHasMore = false;
    if (postsData?.meta?.last_page) {
      initialHasMore = 1 < postsData.meta.last_page;
    } else {
      initialHasMore = initialPosts.length >= 12;
    }

    return (
      <div className="min-h-screen flex flex-col bg-[#0f1115] text-[#f8fafc]">
        <Navbar />

        <main className="flex-1 w-full max-w-7xl mx-auto px-6 py-8">
          <BlogClient 
            initialPosts={initialPosts}
            initialFeatured={initialFeatured}
            initialTags={initialTags}
            initialHasMore={initialHasMore}
          />
        </main>

        <Footer />
      </div>
    );
  } catch (error) {
    console.error("Failed to fetch blog initial data:", error);
    // Fallback if API is down
    return (
      <div className="min-h-screen flex flex-col bg-[#0f1115] text-[#f8fafc]">
        <Navbar />
        <main className="flex-1 w-full max-w-7xl mx-auto px-6 py-8 flex items-center justify-center">
          <div className="text-center py-20 text-[#ababab]">
            <h2 className="text-xl font-bold text-white mb-2">Service Unavailable</h2>
            <p>Failed to load the blog. Please try again later.</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }
}
