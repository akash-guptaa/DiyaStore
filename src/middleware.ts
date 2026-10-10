import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const token = request.cookies.get('admin_token');
  
  // Protect /admin routes
  if (request.nextUrl.pathname.startsWith('/admin')) {
    if (!token || token.value !== 'authenticated') {
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }

  // Allow them to logout easily by unsetting the token
  if (request.nextUrl.pathname === '/logout') {
    const response = NextResponse.redirect(new URL('/login', request.url));
    response.cookies.delete('admin_token');
    return response;
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*', '/logout'],
};