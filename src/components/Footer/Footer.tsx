'use client'

import { usePathname } from "next/navigation";
import Image from "next/image";
import css from './Footer.module.css'
import Link from "next/link";
import Icon from "../Icon/Icon";
import { useEffect, useState } from "react";

export default function Footer() {
  const [isTablet, setIsTablet] = useState(false)

  useEffect(() => {
    const handleResize = () => {
      setIsTablet(window.innerWidth >= 768)
    }

    window.addEventListener('resize', handleResize)
    handleResize()

    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [])

   const pathname = usePathname()

   const noFooterRoutes = ['/login', '/register']

   if (noFooterRoutes.includes(pathname)) {
    return null
   }

    return (
    <footer className={css.page}>
      <div className={css.content}>
        <div className={css.cont}>
        <div className={css.left}>
      <Image className={css.image} src="/logo-footer.png" alt="logo" width={135} height={32} />
      <div className={css.textContainer}>
        <p className={css.text}>Get the medicine to help you feel better, get back to your active life, and enjoy every moment.</p>
      </div>
      </div>
      <div className={css.right}>
      <div className={css.links}>
        <Link className={css.link} href='/shop'>Shop</Link>
        <Link className={css.link} href='/medicine'>Medicine</Link>
        <Link className={css.link} href='/statistics'>Statistics</Link>
      </div>
      {isTablet && (
        <div className={css.media}>
          <Link href='https://www.facebook.com/goITclub/' className={css.item}>
            <Icon name='facebook'/>
          </Link>
          <Link href='https://www.instagram.com/goitclub/' className={css.item}>
            <Icon name='instagram'/>
          </Link>
          <Link href='https://www.youtube.com/c/GoIT' className={css.item}>
            <Icon name='youtube'/>
          </Link>
        </div>
      )}
      </div>
      </div>
      <div className={css.line}></div>
      <div className={css.copyright}>© E-Pharmacy 2023. All Rights Reserved   <span className={css.span}> | </span>   Privacy Policy   <span className={css.span}> | </span>   Terms & Conditions</div>
      </div>
    </footer>
  );

}
