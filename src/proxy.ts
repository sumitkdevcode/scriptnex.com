import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Add paths that require authentication here
const protectedPaths = [
  '/dashboard',
  '/problems',
  '/contests',
  '/certifications',
  '/learn',
  '/discuss'
];

// Add paths that should not be accessible when authenticated (like login/register)
const authPaths = [
  '/login',
  '/register',
  '/forgot-password'
];

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Note: Since we are using an API-only approach without server-side cookies
  // in this specific setup (localStorage token), middleware can't fully 
  // determine auth state reliably on the first hit without an API call.
  // We'll do basic client-side protection primarily, but can add server
  // checks here if we switch to HTTP-only cookies later.
  
  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico, sitemap.xml, robots.txt (metadata files)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)',
  ],
};
