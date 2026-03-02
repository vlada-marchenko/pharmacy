'use client';

import css from './Header.module.css';
import Link from 'next/link';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';
import Icon from '../Icon/Icon';
import { useParams } from 'next/navigation';

export default function Header() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const router = useRouter();
  const pathname = usePathname();
  const params = useParams()

  useEffect(() => {
    const token = Cookies.get('token');
    // eslint-disable-next-line react-hooks/set-state-in-effect
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


  const shopId = Cookies.get('shopId');
  const medicineId = params.medicineId as string;


  const getMobileNavClass = (paths: string[]) => {
    return paths.includes(pathname) ? `${css.navLinkMobActive} ${css.navLinkMob}`: css.navLinkMob;
  }

  const getDesktopNavClass = (paths: string[]) => {
    return paths.includes(pathname) ? `${css.navLinkActive} ${css.navLink}`: css.navLink;
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
                <Link href="/shop/create" className={getDesktopNavClass(['/shop/create', `/shop/${shopId}/update`])}>
                  Shop
                </Link>
                <Link href={`/shop/${shopId}/product`} className={getDesktopNavClass([`/medicine`, `/shop/${shopId}/product`, `/medicine/${medicineId}`])}>
                  Medicine
                </Link>
                <Link href={`/shop/${shopId}/statistics`}  className={getDesktopNavClass([`/shop/${shopId}/statistics`])}>
                  Statistics
                </Link>
              </nav>

              {isMenuOpen && (
                <div className={css.mobileOverlay}>
                  <nav className={css.mobileNav}>
                    <Link href="/shop/create" className={getMobileNavClass(['/shop/create', `/shop/${shopId}/update`])}>
                      Shop
                    </Link>
                    <Link href={`/shop/${shopId}/product`} className={getMobileNavClass([`/medicine`, `/shop/${shopId}/product`, `/medicine/${medicineId}`])}>
                      Medicine
                    </Link>
                    <Link href={`/shop/${shopId}/statistics`} className={getMobileNavClass([`/shop/${shopId}/statistics`])}>
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
