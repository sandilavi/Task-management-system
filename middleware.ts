import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Get the session cookie set in the auth action
  const session = request.cookies.get('userId')?.value;

  const isDashboardPage = request.nextUrl.pathname.startsWith('/dashboard');
  const isAuthPage = request.nextUrl.pathname === '/login' || request.nextUrl.pathname === '/register';

  // Redirect to login if trying to access dashboard without a session
  if (isDashboardPage && !session) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // Redirect to dashboard if already logged in and trying to access login/register
  /*if (isAuthPage && session) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }*/

  return NextResponse.next();
}

// Matcher tells Next.js exactly which routes to run this guard on
export const config = {
  matcher: ['/dashboard/:path*', '/login', '/register'],
};
