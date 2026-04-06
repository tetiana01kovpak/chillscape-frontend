'use client';

import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';
import css from './AuthNav.module.css';

export default function AuthNav() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const redirect = searchParams.get('redirect');
  const registerHref = redirect ? `/register?redirect=${encodeURIComponent(redirect)}` : '/register';
  const loginHref = redirect ? `/login?redirect=${encodeURIComponent(redirect)}` : '/login';

  return (
    <div className={css.tabs} role="tablist" aria-label="Вкладки автентифікації">
      <Link
        href={registerHref}
        className={`${css.tab} ${pathname === '/register' ? css.tabActive : css.tabInactive}`}
        aria-selected={pathname === '/register'}
      >
        Реєстрація
      </Link>
      <Link
        href={loginHref}
        className={`${css.tab} ${pathname === '/login' ? css.tabActive : css.tabInactive}`}
        aria-selected={pathname === '/login'}
      >
        Вхід
      </Link>
    </div>
  );
}
