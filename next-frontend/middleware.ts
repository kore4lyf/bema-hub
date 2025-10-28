import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Define which routes are protected (require authentication)
const protectedRoutes = [
  '/dashboard',
  '/profile',
  '/events',
  '/campaigns',
  '/leaderboard',
  '/contact'
];

// Define which routes are auth-only (accessible only when NOT authenticated)
const authOnlyRoutes = [
  '/signin',
  '/signup',
  '/reset-password'
];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Check if the route is protected
  const isProtectedRoute = protectedRoutes.some(route => 
    pathname.startsWith(route)
  );
  
  // Check if the route is auth-only
  const isAuthOnlyRoute = authOnlyRoutes.some(route => 
    pathname === route || pathname.startsWith(route)
  );
  
  // Get the auth token from cookies
  const token = request.cookies.get('auth-token')?.value;
  const isAuthenticated = !!token;
  
  // Redirect authenticated users away from auth-only routes
  if (isAuthOnlyRoute && isAuthenticated) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }
  
  // Redirect unauthenticated users away from protected routes
  if (isProtectedRoute && !isAuthenticated) {
    return NextResponse.redirect(new URL('/signin', request.url));
  }
  
  return NextResponse.next();
}

// Configure which paths the middleware should run on
export const config = {
  matcher: [
    '/dashboard/:path*',
    '/profile/:path*',
    '/events/:path*',
    '/campaigns/:path*',
    '/leaderboard/:path*',
    '/contact/:path*',
    '/signin',
    '/signup/:path*',
    '/reset-password/:path*'
  ]
};