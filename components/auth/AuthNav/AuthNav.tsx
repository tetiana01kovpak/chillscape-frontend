'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import css from './AuthNav.module.css';

export default function AuthNav() {
  const pathname = usePathname();

  return (
    <div className={css.tabs} role="tablist" aria-label="Вкладки автентифікації">
      <Link
        href="/register"
        className={`${css.tab} ${pathname === '/register' ? css.tabActive : css.tabInactive}`}
        aria-selected={pathname === '/register'}
      >
        Реєстрація
      </Link>
      <Link
        href="/login"
        className={`${css.tab} ${pathname === '/login' ? css.tabActive : css.tabInactive}`}
        aria-selected={pathname === '/login'}
      >
        Вхід
      </Link>
    </div>
  );
}
