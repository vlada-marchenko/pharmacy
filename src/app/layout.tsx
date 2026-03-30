import type { Metadata } from 'next';
import './globals.css';
import { Viewport } from 'next';
import Header from '../components/Header/Header';
import Footer from '../components/Footer/Footer';
import { Inter } from 'next/font/google';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const inter = Inter({ subsets: ['latin'], display: 'swap' });

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
};

export const metadata: Metadata = {
  title: 'E-Pharmacy',
  description: 'Online pharmacy management system',
  openGraph: {
    title: 'E-Pharmacy',
    description: 'Online pharmacy management system',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="layout-wrapper">
          <Header />
          <main>{children}</main>
          <Footer />
        </div>
        <ToastContainer position="top-center" autoClose={4000} />
      </body>
    </html>
  );
}
