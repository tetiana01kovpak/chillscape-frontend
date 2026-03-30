import AuthHeader from '@/components/layout/AuthHeader/AuthHeader';
import AuthFooter from '@/components/layout/AuthFooter/AuthFooter';
import css from './authLayout.module.css';

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className={css.authLayout}>
      <AuthHeader />
      <main className={css.content}>{children}</main>
      <AuthFooter />
    </div>
  );
}
