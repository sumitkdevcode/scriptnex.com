import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/contexts/AuthContext";
import Script from "next/script";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  metadataBase: new URL('https://scriptnex.com'),
  title: {
    default: "ScriptNex — Learn Programming Online | Free Coding Platform & Certifications",
    template: "%s | ScriptNex",
  },
  description: "Learn programming online for free with ScriptNex. Practice 500+ coding challenges, follow structured learning tracks, compete in live contests, and earn verified coding certificates to boost your career.",
  keywords: [
    "learn programming online",
    "learn coding for free",
    "coding certificate online",
    "programming challenges",
    "online coding platform",
    "free coding courses",
    "competitive programming",
    "coding practice",
    "programming contests",
    "verified coding certificate",
  ],
  authors: [{ name: "ScriptNex", url: "https://scriptnex.com" }],
  creator: "ScriptNex",
  publisher: "ScriptNex",
  openGraph: {
    type: "website",
    siteName: "ScriptNex",
    title: "ScriptNex — Learn Programming Online | Free Coding Platform & Certifications",
    description: "Learn programming online for free with ScriptNex. Practice 500+ coding challenges, follow structured learning tracks, compete in live contests, and earn verified coding certificates to boost your career.",
    locale: "en_US",
    images: [
      {
        url: "https://scriptnex.com/og-image.png",
        width: 1200,
        height: 630,
        alt: "ScriptNex — Learn Programming Online",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@scriptnex",
    creator: "@scriptnex",
    title: "ScriptNex — Learn Programming Online | Free Coding Platform & Certifications",
    description: "Learn programming online for free with ScriptNex. Practice 500+ coding challenges, follow structured learning tracks, compete in live contests, and earn verified coding certificates to boost your career.",
    images: ["https://scriptnex.com/og-image.png"],
  },
  alternates: {
    types: {
      'application/rss+xml': 'https://scriptnex.com/feed.xml',
    },
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  other: {
    'google-adsense-account': 'ca-pub-5730762848368403',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} h-full antialiased`}>
      <head>
        {/* Google AdSense */}
        {process.env.NODE_ENV === 'production' && (
          <script
            async
            src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-5730762848368403"
            crossOrigin="anonymous"
          ></script>
        )}
      </head>
      <body className="min-h-full flex flex-col font-[family-name:var(--font-inter)]">
        {/* GTM — loaded after hydration to avoid blocking first paint */}
        <Script id="gtm-init" strategy="afterInteractive">
          {`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','GTM-5TXCJSNQ');`}
        </Script>
        <noscript>
          <iframe
            src="https://www.googletagmanager.com/ns.html?id=GTM-5TXCJSNQ"
            height="0"
            width="0"
            style={{ display: "none", visibility: "hidden" }}
          />
        </noscript>
        {/* Google Analytics — placed in body, not head, per Next.js App Router best practice */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-W2BD0W4NLP"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-W2BD0W4NLP');
          `}
        </Script>

        <AuthProvider>
          {children}
        </AuthProvider>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@graph': [
                {
                  '@type': 'Organization',
                  '@id': 'https://scriptnex.com/#organization',
                  name: 'ScriptNex',
                  url: 'https://scriptnex.com',
                  logo: {
                    '@type': 'ImageObject',
                    url: 'https://scriptnex.com/logo.png',
                    width: 512,
                    height: 512,
                  },
                  sameAs: [
                    'https://www.linkedin.com/company/scriptnex/',
                    'https://www.instagram.com/scriptnex',
                    'https://github.com/ScriptNex-Learning',
                    'https://www.youtube.com/@scriptnex',
                  ],
                  description: 'ScriptNex is a free online programming platform offering coding challenges, structured learning tracks, live contests, and verified coding certifications.',
                  foundingDate: '2024',
                  contactPoint: {
                    '@type': 'ContactPoint',
                    contactType: 'customer support',
                    email: 'support@scriptnex.com',
                  },
                },
                {
                  '@type': 'WebSite',
                  '@id': 'https://scriptnex.com/#website',
                  url: 'https://scriptnex.com',
                  name: 'ScriptNex',
                  publisher: { '@id': 'https://scriptnex.com/#organization' },
                  potentialAction: {
                    '@type': 'SearchAction',
                    target: {
                      '@type': 'EntryPoint',
                      urlTemplate: 'https://scriptnex.com/problems?search={search_term_string}',
                    },
                    'query-input': 'required name=search_term_string',
                  },
                },
                {
                  '@type': 'EducationalOrganization',
                  '@id': 'https://scriptnex.com/#edu',
                  name: 'ScriptNex',
                  url: 'https://scriptnex.com',
                  sameAs: 'https://scriptnex.com',
                  description: 'Online coding platform with certifications, learning tracks, and programming contests.',
                },
              ],
            }),
          }}
        />
      </body>
    </html>
  );
}
