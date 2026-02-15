'use client'

import css from "./Header.module.css";
import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import Icon from "../Icon/Icon";

export default function Header() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const router = useRouter();
  const pathname = usePathname()

  useEffect(() => {
    const token = Cookies.get('token')
    setIsLoggedIn(!!token)
    setIsMenuOpen(false)
  }, [pathname])

  const handleLogout = () => {
    Cookies.remove('token')
    Cookies.remove('shopId')
    localStorage.removeItem('user')

    setIsLoggedIn(false)
    setIsMenuOpen(false)
    router.push('/login')
  }

    return (
    <div className={css.page}>
      <div className={css.content}>
      <Link href='/' className={css.logo}>
      <Image src='/logo-2.png' alt='logo' width={135} height={32}/>
      </Link>

      {!isLoggedIn && (
        <div>
          <nav className={css.desktopNav}>
            <Link href='/shop' className={css.navLink}>Shop</Link>
            <Link href='/medicine' className={css.navLink}>Medicine</Link>
            <Link href='/statistics' className={css.navLink}>Statistics</Link>
            <button className={css.logout} onClick={handleLogout}>Log out</button>
          </nav>

          <button className={css.burger} onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? <Icon name=''/> : <Icon name=''/>}
          </button>
        </div>
      )}
      </div>
    </div>
  );

}
