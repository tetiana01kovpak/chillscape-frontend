import type { Metadata } from 'next';
import { Montserrat } from 'next/font/google';
import 'modern-normalize/modern-normalize.css';
import './globals.css';
import Header from '@/components/layout/Header/Header';
import Footer from '@/components/layout/Footer/Footer';

const montserrat = Montserrat({
  variable: '--montserrat-font',
  subsets: ['cyrillic', 'latin'],
});

export const metadata: Metadata = {
  title: 'Relax Map',
  description: 'Relax Map frontend application',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="uk">
      <body className={montserrat.variable}>
        <Header />
        <main style={{ flex: 1 }}>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
