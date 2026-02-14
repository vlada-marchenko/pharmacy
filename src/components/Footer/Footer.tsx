'use client'

import { usePathname } from "next/navigation";


export default function Footer() {
   const pathname = usePathname()

   const noFooterRoutes = ['/login', '/register']

   if (noFooterRoutes.includes(pathname)) {
    return null
   }

    return (
    <footer>Footer</footer>
  );

}
