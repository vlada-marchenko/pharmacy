'use client';

import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import Header from '../Header/Header';
import Footer from '../Footer/Footer';

const PUBLIC_ROUTES = ['/register', '/login'];

export default function ConditionalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const isPublicRoute = PUBLIC_ROUTES.includes(pathname);

  return (
    <div className="layout-wrapper">
      {mounted && !isPublicRoute && <Header />}
      <main>{children}</main>
      {mounted && !isPublicRoute && <Footer />}
    </div>
  );
}
