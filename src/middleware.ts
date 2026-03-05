import { NextResponse } from 'next/server';
import { NextRequest } from 'next/server';

const protectedRoutes = ['/shop', '/medicine', '/statistics'];
const authRoutes = ['/login', '/register'];

export function middleware(request: NextRequest) {
  const token = request.cookies.get('token')?.value;
  const shopId = request.cookies.get('shopId')?.value;
  const { pathname } = request.nextUrl;

  console.log('=== MIDDLEWARE DEBUG ===');
  console.log('pathname:', pathname);
  console.log('token:', token ? 'exists' : 'missing');
  console.log('shopId cookie:', shopId);

  const isProtectedRoute = protectedRoutes.some((route) =>
    pathname.startsWith(route),
  );

  if (isProtectedRoute && !token) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  if (authRoutes.includes(pathname) && token) {
    if (shopId && shopId !== 'undefined') {
      return NextResponse.redirect(
        new URL(`/shop/${shopId}/product`, request.url),
      );
    }
    return NextResponse.redirect(new URL('/shop/create', request.url));
  }
  return NextResponse.next();
}

export const config = {
  matcher: [
    '/shop/:path*',
    '/medicine/:path*',
    '/statistics/:path*',
    '/login',
    '/register',
  ],
};
