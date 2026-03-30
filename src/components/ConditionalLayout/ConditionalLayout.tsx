'use client';

import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import Header from '../Header/Header';
import Footer from '../Footer/Footer';

const NO_FOOTER_ROUTES = ['/register', '/login'];

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

  const isNoFooter = NO_FOOTER_ROUTES.includes(pathname);

  return (
    <div className="layout-wrapper">
      <Header />
      <main>{children}</main>
      <div style={{ display: mounted && isNoFooter ? 'none' : 'block' }}>
        <Footer />
      </div>
    </div>
  );
}
