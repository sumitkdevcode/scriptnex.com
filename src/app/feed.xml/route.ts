import { NextResponse } from 'next/server';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'https://admin.scriptnex.com/api/v1';

interface SuggestionPost {
  id: number;
  title: string;
  slug: string;
  excerpt?: string | null;
  cover_image: string | null;
  published_at: string | null;
}

export async function GET() {
  try {
    // Fetch the latest 50 blog posts for the RSS feed
    const res = await fetch(`${API_BASE}/blog?per_page=50&page=1`, {
      headers: { Accept: 'application/json' },
      next: { revalidate: 3600 },
    });
    
    if (!res.ok) {
      return new NextResponse('Error fetching blog data', { status: 500 });
    }

    const json = await res.json();
    const posts: SuggestionPost[] = json.data || [];

    const siteUrl = 'https://scriptnex.com';
    const feedUrl = `${siteUrl}/feed.xml`;

    const feedXml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:dc="http://purl.org/dc/elements/1.1/">
  <channel>
    <title>ScriptNex Blog</title>
    <link>${siteUrl}/blog</link>
    <description>Learn programming, algorithms, data structures, and more with ScriptNex.</description>
    <language>en-us</language>
    <atom:link href="${feedUrl}" rel="self" type="application/rss+xml"/>
    ${posts
      .filter((post) => post.slug && post.published_at)
      .map((post) => {
        const postUrl = `${siteUrl}/blog/${post.slug}`;
        const pubDate = new Date(post.published_at as string).toUTCString();
        const description = post.excerpt ? post.excerpt : `Read ${post.title} on ScriptNex.`;
        
        return `
    <item>
      <title><![CDATA[${post.title}]]></title>
      <link>${postUrl}</link>
      <guid isPermaLink="true">${postUrl}</guid>
      <pubDate>${pubDate}</pubDate>
      <description><![CDATA[${description}]]></description>
      ${post.cover_image ? `<enclosure url="${post.cover_image}" type="image/jpeg" />` : ''}
    </item>`;
      })
      .join('')}
  </channel>
</rss>`;

    return new NextResponse(feedXml, {
      headers: {
        'Content-Type': 'application/rss+xml; charset=utf-8',
        'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
      },
    });
  } catch (error) {
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
