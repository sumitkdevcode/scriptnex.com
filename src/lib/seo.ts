import { Metadata } from 'next';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1';
const SITE_URL = 'https://scriptnex.com';

interface SeoData {
  title: string | null;
  meta_description: string | null;
  meta_keywords: string | null;
  og_title: string | null;
  og_description: string | null;
  og_image: string | null;
  canonical_url: string | null;
  robots_index: boolean;
  robots_follow: boolean;
}

/**
 * Hardcoded SEO-optimized fallback metadata per page.
 * These are used when the API is unavailable and ensure
 * every page always has a unique, keyword-rich title & description.
 */
const PAGE_FALLBACKS: Record<string, { title: string; description: string; keywords: string }> = {
  '/': {
    title: 'ScriptNex — Learn Programming Online | Free Coding Platform & Certifications',
    description: 'Learn programming online for free with ScriptNex. Practice 500+ coding challenges, follow structured learning tracks, compete in live contests, and earn verified coding certificates to boost your career.',
    keywords: 'learn programming online, learn coding for free, coding certificate online, programming challenges, online coding platform, free coding courses, competitive programming',
  },
  '/problems': {
    title: 'Practice Coding Problems Online — 500+ Challenges',
    description: 'Solve 500+ coding problems across algorithms, data structures, dynamic programming, and more. Filter by difficulty, track progress, and sharpen your programming skills for free on ScriptNex.',
    keywords: 'coding problems, programming challenges, algorithm practice, data structures problems, leetcode alternative, coding practice online, DSA problems',
  },
  '/certifications': {
    title: 'Earn Free Coding Certificates Online — Verified Credentials',
    description: 'Take timed coding exams and earn verified digital certificates in Python, JavaScript, DSA, and more. Add ScriptNex certificates to your resume and LinkedIn profile.',
    keywords: 'coding certificate online, free programming certificate, verified coding credential, Python certificate, JavaScript certificate, DSA certification',
  },
  '/tracks': {
    title: 'Structured Learning Tracks — Learn Programming Step by Step',
    description: 'Follow curated learning tracks to master programming from beginner to advanced. Courses in Python, JavaScript, Data Structures, Algorithms, and more on ScriptNex.',
    keywords: 'learn programming, coding courses, learning tracks, Python course, JavaScript course, DSA course, programming roadmap, coding tutorial',
  },
  '/contests': {
    title: 'Live Coding Contests — Compete & Win',
    description: 'Participate in weekly programming contests on ScriptNex. Test your coding speed, compete on leaderboards, and earn recognition in the developer community.',
    keywords: 'coding contest, programming competition, competitive programming, online coding contest, weekly coding challenge, hackathon',
  },
  '/discuss': {
    title: 'Coding Discussion Forum — Ask & Answer',
    description: 'Join the ScriptNex community. Discuss coding problems, share solutions, ask questions, and learn from fellow programmers worldwide.',
    keywords: 'coding forum, programming discussion, coding help, programming community, coding Q&A, developer forum',
  },
  '/leaderboard': {
    title: 'Global Coding Leaderboard — Top Programmers',
    description: 'See who leads the pack on ScriptNex. Check the global leaderboard ranked by problems solved, contest wins, and coding streaks.',
    keywords: 'coding leaderboard, top programmers, competitive programming ranking, coding ranking, developer leaderboard',
  },
  '/pricing': {
    title: 'ScriptNex Pro Plans — Unlock Premium Features',
    description: 'Upgrade to ScriptNex Pro for advanced certifications, exclusive contests, and premium coding challenges. Choose the plan that fits your learning goals.',
    keywords: 'ScriptNex pricing, coding platform plans, premium coding features, ScriptNex pro, coding subscription',
  },
  '/privacy': {
    title: 'Privacy Policy',
    description: 'Understand how ScriptNex collects, uses, and protects your personal information. Read our full privacy policy.',
    keywords: 'ScriptNex privacy policy, data protection, personal information',
  },
  '/terms': {
    title: 'Terms of Service',
    description: 'Read the terms and conditions governing your use of the ScriptNex coding platform.',
    keywords: 'ScriptNex terms of service, terms and conditions, user agreement',
  },
  '/refund': {
    title: 'Refund Policy',
    description: 'Learn about the ScriptNex refund policy for premium plans and certificate downloads.',
    keywords: 'ScriptNex refund policy, refund, cancellation policy',
  },
};

export function getFallbackMetadata(path: string): Metadata {
  const fb = PAGE_FALLBACKS[path] || PAGE_FALLBACKS['/'];
  const canonicalUrl = path === '/' ? SITE_URL : `${SITE_URL}${path}`;

  return {
    title: fb.title,
    description: fb.description,
    keywords: fb.keywords.split(',').map(k => k.trim()),
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: fb.title,
      description: fb.description,
      url: canonicalUrl,
      siteName: 'ScriptNex',
      type: 'website',
      locale: 'en_US',
    },
    twitter: {
      card: 'summary_large_image',
      title: fb.title,
      description: fb.description,
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}

export async function getPageMetadata(path: string): Promise<Metadata> {
  const fallback = getFallbackMetadata(path);

  try {
    const response = await fetch(`${API_BASE}/seo?path=${encodeURIComponent(path)}`, {
      headers: {
        'Accept': 'application/json'
      },
      next: { revalidate: 3600 }, // Cache for 1 hour
    });
    
    if (!response.ok) {
      return fallback;
    }

    const contentType = response.headers.get("content-type");
    if (!contentType || !contentType.includes("application/json")) {
      return fallback;
    }

    const json = await response.json();
    
    if (!json.success || !json.data?.seo) {
      return fallback;
    }

    const seo: SeoData = json.data.seo;
    const canonicalUrl = seo.canonical_url || (path === '/' ? SITE_URL : `${SITE_URL}${path}`);

    // Build robots directive
    const robotsParts: string[] = [];
    if (seo.robots_index !== undefined) {
      robotsParts.push(seo.robots_index ? 'index' : 'noindex');
    }
    if (seo.robots_follow !== undefined) {
      robotsParts.push(seo.robots_follow ? 'follow' : 'nofollow');
    }

    return {
      // Use API title ONLY if it's meaningful (not just brand name)
      title: (seo.title && seo.title.length > 15) ? seo.title : fallback.title,
      description: seo.meta_description || fallback.description,
      keywords: seo.meta_keywords ? seo.meta_keywords.split(',').map(k => k.trim()) : (fallback.keywords as string[]),
      alternates: {
        canonical: canonicalUrl,
      },
      openGraph: {
        title: seo.og_title || seo.title || (fallback.openGraph as any)?.title,
        description: seo.og_description || seo.meta_description || (fallback.openGraph as any)?.description,
        url: canonicalUrl,
        siteName: 'ScriptNex',
        type: 'website',
        locale: 'en_US',
        images: seo.og_image ? [{ url: seo.og_image }] : undefined,
      },
      twitter: {
        card: 'summary_large_image',
        title: seo.og_title || seo.title || (fallback.twitter as any)?.title,
        description: seo.og_description || seo.meta_description || (fallback.twitter as any)?.description,
      },
      ...(robotsParts.length > 0 ? {
        robots: {
          index: seo.robots_index ?? true,
          follow: seo.robots_follow ?? true,
        }
      } : {}),
    };
  } catch (error) {
    console.error('Failed to fetch SEO metadata:', error);
    return fallback;
  }
}
