import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const token = request.cookies.get('authToken')?.value || 
               request.headers.get('authorization')?.replace('Bearer ', '');
  
  // Get the pathname
  const pathname = request.nextUrl.pathname;
  
  // Public routes that don't require authentication
  const publicRoutes = ['/auth/login', '/auth/register'];
  
  // Check if the current path is a public route
  const isPublicRoute = publicRoutes.includes(pathname);
  
  // If user is not authenticated and trying to access protected route
  if (!token && !isPublicRoute) {
    // Redirect to login page
    return NextResponse.redirect(new URL('/auth/login', request.url));
  }
  
  // If user is authenticated and trying to access auth pages, redirect to dashboard
  if (token && isPublicRoute) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }
  
  // If accessing root path, redirect based on auth status
  if (pathname === '/') {
    if (token) {
      return NextResponse.redirect(new URL('/dashboard', request.url));
    } else {
      return NextResponse.redirect(new URL('/auth/login', request.url));
    }
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};