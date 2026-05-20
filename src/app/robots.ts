import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/dashboard/',
          '/dashboard',
          '/verify/',
          '/forgot-password/',
          '/login',
          '/login/',
          '/login/callback',
          '/api/',
        ],
      },
    ],
    sitemap: 'https://scriptnex.com/sitemap.xml',
  };
}
