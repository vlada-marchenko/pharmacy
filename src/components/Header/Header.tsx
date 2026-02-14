
import css from "./Header.module.css";
import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { useRouter } from "next/router";
import Cookies from "js-cookie";

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
      <Link href='/register' className={css.link}>
      <Image src='/logo-2.png' alt='logo' width={135} height={32}/>
      </Link>

      {!isLoggedIn && (
        <div></div>
      )}
      </div>
    </div>
  );

}
