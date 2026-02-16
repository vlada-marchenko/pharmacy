import { NextResponse } from 'next/server';
import { NextRequest } from 'next/server';

const protectedRoutes = ['/shop', '/medicine', '/statistics'];

const authRoutes = ['/login', '/register'];

export function proxy(request: NextRequest) {
  const token = request.cookies.get('token')?.value;
  const shopId = request.cookies.get('shopId')?.value;
  const { pathname } = request.nextUrl;
  const isProtectedRoute = protectedRoutes.some((route) =>
    pathname.startsWith(route),
  );
  if (isProtectedRoute && !token) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  if (authRoutes.includes(pathname) && token) {
    if (shopId) {
    return NextResponse.redirect(new URL(`/shop/${shopId}`, request.url));
  } else {
    return NextResponse.redirect(new URL('/shop/create', request.url));
  }
  }
  return NextResponse.next();
}

export const config = {
  matcher: ['/shop/:path*', '/medicine/:path*', '/statistics/:path*', '/login', '/register'],
};
