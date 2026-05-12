import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://scriptnex.com';

  const routes = [
    '',
    '/problems',
    '/contests',
    '/tracks',
    '/certifications',
    '/discuss',
    '/leaderboard',
    '/pricing',
    '/login',
    '/register',
    '/privacy',
    '/terms',
    '/refund',
  ];

  return routes.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: route === '' ? 'daily' : 'weekly',
    priority: route === '' ? 1 : 0.8,
  }));
}
