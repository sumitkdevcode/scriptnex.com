import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function proxy(request: NextRequest) {
  void request;

  // Auth is enforced client-side because the app currently stores the token in localStorage.
  // If the project moves to HTTP-only cookies later, route protection can be upgraded here.
  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)',
  ],
};
