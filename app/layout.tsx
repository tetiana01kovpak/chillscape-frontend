import type { Metadata } from 'next';
import { Montserrat } from 'next/font/google';
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
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={montserrat.variable}>{children}</body>
    </html>
  );
}
