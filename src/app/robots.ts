import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/api/',
          '/login',
          '/register',
          '/dashboard/',
          '/verify/',
          '/forgot-password/',
          '/intern-verification/',
          '/playground/',
        ],
      },
    ],
    sitemap: 'https://scriptnex.com/sitemap.xml',
  };
}
