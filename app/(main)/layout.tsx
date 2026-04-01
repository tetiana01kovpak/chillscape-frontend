import Header from '@/components/layout/Header/Header';
import Footer from '@/components/layout/Footer/Footer';
import TanStackProvider from '@/components/TanStackProvider/TanStackProvider';
import AuthProvider from '@/components/auth/AuthProvider';

export default function MainLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <TanStackProvider>
        <AuthProvider>
          <Header />
          <main style={{ flex: 1 }}>{children}</main>
          <Footer />
        </AuthProvider>
      </TanStackProvider>
    </>
  );
}
