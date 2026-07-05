import { Metadata } from 'next';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'https://admin.scriptnex.com/api/v1';
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
  '/blog': {
    title: 'Developer Blog — 500+ Tutorials, Guides & Tech Insights | ScriptNex',
    description: 'Explore 500+ in-depth programming tutorials on DSA, JavaScript, Python, React, System Design, DevOps & more. Written by senior engineers. Free, updated for 2025.',
    keywords: 'programming blog, coding tutorials, developer guides, tech articles, software engineering blog, DSA tutorials, system design, web development, ScriptNex blog',
  },
  '/sheets': {
    title: 'Coding Sheets — Curated DSA Problem Lists for Systematic Practice',
    description: 'Follow structured coding sheets to master Data Structures and Algorithms step by step. Curated problem lists covering arrays, trees, graphs, dynamic programming, and more on ScriptNex.',
    keywords: 'DSA sheet, coding sheet, problem list, Striver sheet, love babbar sheet, data structures problems, algorithm practice, competitive programming sheet',
  },
  '/daily': {
    title: 'Daily Coding Challenge — Problem of the Day',
    description: 'Solve a new coding problem every day on ScriptNex. Build your streak, track progress with a heatmap calendar, and compete on the daily streak leaderboard.',
    keywords: 'daily coding challenge, problem of the day, coding streak, daily programming practice, coding habit, leetcode daily',
  },
  '/playground': {
    title: 'Online Code Playground — Write, Run & Share Code Instantly',
    description: 'Write, run, and share code in 20+ programming languages directly in your browser. No setup required. Free online code editor and compiler by ScriptNex.',
    keywords: 'online code editor, code playground, online compiler, run code online, code runner, online IDE, free compiler',
  },
  '/interview-prep': {
    title: 'Interview Preparation Kits — Company-Specific Coding Practice',
    description: 'Prepare for coding interviews at Google, Amazon, Microsoft, Meta, and more with curated company-specific problem sets. Practice the exact questions asked in real tech interviews.',
    keywords: 'interview preparation, coding interview, FAANG interview, Google interview questions, Amazon coding, tech interview prep, DSA interview',
  },
  '/internship': {
    title: 'Internship Opportunities at ScriptNex — Apply Now',
    description: 'Join the ScriptNex team as an intern. Work on real-world projects in web development, data analytics, Python, React, and more. Apply for remote internship positions.',
    keywords: 'coding internship, tech internship, remote internship, web development intern, Python internship, React internship, ScriptNex careers',
  },
  '/intern-verification': {
    title: 'Verify Internship Certificate — ScriptNex',
    description: 'Verify the authenticity of a ScriptNex internship certificate by entering the unique internship ID. Instant verification for employers and recruiters.',
    keywords: 'internship verification, verify certificate, ScriptNex internship ID, credential verification',
  },
  '/open-source': {
    title: 'Open Source — Contribute to ScriptNex on GitHub',
    description: 'ScriptNex is proudly open source. Explore our GitHub repositories, contribute to the codebase, and help us build the future of coding education together.',
    keywords: 'open source coding platform, contribute to ScriptNex, GitHub, open source education, developer community',
  },
  '/partners': {
    title: 'Partners & Resources — Trusted Educational Collaborators',
    description: 'Explore our trusted educational partners, sponsors, and coding resources. Exchange links with ScriptNex and grow together in the developer ecosystem.',
    keywords: 'ScriptNex partners, educational resources, coding partners, link exchange, tech education',
  },
};

export function getFallbackMetadata(path: string): Metadata {
  const fb = PAGE_FALLBACKS[path] || PAGE_FALLBACKS['/'];
  const canonicalUrl = path === '/' ? SITE_URL : `${SITE_URL}${path}`;

  const noIndexPaths = ['/login', '/dashboard', '/verify', '/forgot-password', '/register', '/intern-verification', '/playground'];
  const shouldIndex = !noIndexPaths.some(p => path.startsWith(p));

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
      index: shouldIndex,
      follow: shouldIndex,
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

    const robotsParts: string[] = [];
    const noIndexPaths = ['/login', '/dashboard', '/verify', '/forgot-password', '/register', '/intern-verification', '/playground'];
    const shouldIndex = !noIndexPaths.some(p => path.startsWith(p));
    
    let index = seo.robots_index ?? true;
    let follow = seo.robots_follow ?? true;

    if (!shouldIndex) {
      index = false;
      follow = false;
    } else if (path.startsWith('/blog')) {
      // Explicitly allow indexing for all blog pages
      index = true;
      follow = true;
    }

    if (index !== undefined) {
      robotsParts.push(index ? 'index' : 'noindex');
    }
    if (follow !== undefined) {
      robotsParts.push(follow ? 'follow' : 'nofollow');
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
          index: index,
          follow: follow,
        }
      } : {}),
    };
  } catch (error) {
    console.error('Failed to fetch SEO metadata:', error);
    return fallback;
  }
}
