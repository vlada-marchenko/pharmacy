import type { Metadata } from 'next';
import TanStackProvider from '../components/TanStackProvider/TanStackProvider';
import './globals.css';
import { Viewport } from 'next';
import Header from '../components/Header/Header';
import Footer from '../components/Footer/Footer';


export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
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
      <body>
        <TanStackProvider>
          <Header />
          <main>{children}</main>
          <Footer />
        </TanStackProvider>
      </body>
    </html>
  );
}
