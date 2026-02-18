import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const session = request.cookies.get('userId')?.value;
  const { pathname } = request.nextUrl;

  // Redirect logged-in users away from Public/Auth pages
  if (session && (pathname === '/' || pathname === '/login' || pathname === '/register')) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  // Redirect to login if trying to access dashboard without a session
  if (!session && pathname.startsWith('/dashboard')) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  return NextResponse.next();
}

// Ensure the middleware runs on the root path and all auth/dashboard routes
export const config = {
  matcher: ['/', '/dashboard/:path*', '/login', '/register'],
};
