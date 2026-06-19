import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Auth is enforced client-side because the app currently stores the token in localStorage.
  // If the project moves to HTTP-only cookies later, route protection can be upgraded here.
  //
  // NOTE: This middleware is intentionally minimal. Previously it ran on every
  // route but did nothing (just `NextResponse.next()`), adding latency for zero
  // benefit. The matcher is now restricted to paths that may need middleware
  // in the future (e.g., dashboard auth gating).
  void request;
  return NextResponse.next();
}

export const config = {
  // Only run middleware on routes that may need it in the future.
  // Previously matched nearly everything, adding unnecessary latency.
  matcher: [
    '/dashboard/:path*',
  ],
};
