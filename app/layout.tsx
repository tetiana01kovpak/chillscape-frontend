import type { Metadata } from 'next';
import { Montserrat } from 'next/font/google';
import { Toaster } from 'react-hot-toast';
import AuthProvider from '@/components/auth/AuthProvider';
import 'modern-normalize/modern-normalize.css';
import './globals.css';

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
  modal,
}: Readonly<{
  children: React.ReactNode;
  modal: React.ReactNode;
}>) {
  return (
    <html lang="uk" data-scroll-behavior="smooth">
      <body className={montserrat.variable}>
        <Toaster position="top-right" />
        <AuthProvider>{children}</AuthProvider>
        {modal}
      </body>
    </html>
  );
}
