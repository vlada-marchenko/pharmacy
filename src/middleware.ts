import { NextResponse } from 'next/server';
import { NextRequest } from 'next/server';

const protectedRoutes = ['/product', '/medicine', '/statistics'];

const authRoutes = ['/login', '/register'];

export function middleware(request: NextRequest) {
  const token = request.cookies.get('token')?.value;
  const { pathname } = request.nextUrl;
  const isProtectedRoute = protectedRoutes.some((route) =>
    pathname.startsWith(route),
  );
  if (isProtectedRoute && !token) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  if (authRoutes.includes(pathname) && token) {
    return NextResponse.redirect(new URL('/product', request.url));
  }
  return NextResponse.next();
}

export const config = {
  matcher: ['/product', '/medicine', '/statistics'],
};
