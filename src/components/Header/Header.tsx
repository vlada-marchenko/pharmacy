'use client';

import css from './Header.module.css';
import Link from 'next/link';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';
import Icon from '../Icon/Icon';

export default function Header() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const token = Cookies.get('token');
    setIsLoggedIn(!!token);
    setIsMenuOpen(false);
  }, [pathname]);

  const handleLogout = () => {
    Cookies.remove('token');
    Cookies.remove('shopId');
    localStorage.removeItem('user');

    setIsLoggedIn(false);
    setIsMenuOpen(false);
    router.push('/login');
  };

  const getMobileNavClass = (path: string) => {
    return pathname === path ? `${css.navLinkMobActive} ${css.navLinkMob}`: css.navLinkMob;
  }

  const getDesktopNavClass = (path: string) => {
    return pathname === path ? `${css.navLinkActive} ${css.navLink}`: css.navLink;
  }

  return (
    <header className={css.page}>
      <div className={css.content}>
        <Link href="/" className={css.logo}>
          <Image src="/logo-2.png" alt="logo" width={135} height={32} />
        </Link>

        {isLoggedIn && (
          <>
            <div>
              <nav className={css.desktopNav}>
                <Link href="/shop" className={getDesktopNavClass('/shop')}>
                  Shop
                </Link>
                <Link href="/medicine" className={getDesktopNavClass('/medicine')}>
                  Medicine
                </Link>
                <Link href="/statistics" className={getDesktopNavClass('/statistics')}>
                  Statistics
                </Link>
              </nav>

              {isMenuOpen && (
                <div className={css.mobileOverlay}>
                  <nav className={css.mobileNav}>
                    <Link href="/shop" className={getMobileNavClass('/shop')}>
                      Shop
                    </Link>
                    <Link href="/medicine" className={getMobileNavClass('/medicine')}>
                      Medicine
                    </Link>
                    <Link href="/statistics" className={getMobileNavClass('/statistics')}>
                      Statistics
                    </Link>
                    <button className={css.logoutMob} onClick={handleLogout}>
                      Log out
                    </button>
                  </nav>
                </div>
              )}
            </div>
            <div>
            <button className={css.logout} onClick={handleLogout}>
              Log out
            </button>

              <button
                className={css.burger}
                onClick={() => setIsMenuOpen(!isMenuOpen)}
              >
                {isMenuOpen ? (
                  <Icon name="x" width={32} height={32} className={css.x} />
                ) : (
                  <Icon
                    name="menu"
                    width={32}
                    height={32}
                    className={css.menu}
                  />
                )}
              </button>
              </div>
          </>
        )}
      </div>
    </header>
  );
}
