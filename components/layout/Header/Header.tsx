'use client';
import { useState } from 'react';
import { usePathname } from 'next/navigation';
import Logo from '@/components/ui/Logo/Logo';
import Link from 'next/link';
import Image from 'next/image';
import css from './Header.module.css';

const isLoggedIn = true;
const user = {
  username: 'Name',
  avatar: 'https://ac.goit.global/fullstack/react/default-avatar.jpg',
};

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();

  const closeMenu = () => setIsMenuOpen(false);

  return (
    <header className={`${css.header} section`}>
      <div className={`container ${css.inner}`}>
        <Logo />

        <nav className={css.desktopNav}>
          <Link href="/" className={`${css.navLink} ${pathname === '/' ? css.active : ''}`}>
            Головна
          </Link>
          <Link
            href="/locations"
            className={`${css.navLink} ${pathname === '/locations' ? css.active : ''}`}
          >
            Місця відпочинку
          </Link>
          {isLoggedIn && (
            <Link
              href="/profile"
              className={`${css.navLink} ${pathname.startsWith('/profile') ? css.active : ''}`}
            >
              {' '}
              Мій профіль
            </Link>
          )}
        </nav>

        {isLoggedIn ? (
          <div className={css.desktopUserMenu}>
            <Link href="/locations/add" className={css.btnPrimary}>
              Поділитись локацією
            </Link>
            <div className={css.userInfo}>
              <div className={css.avatar}>
                <Image src={user.avatar} alt={user.username} width={32} height={32} />
              </div>
              <span className={css.userName}>{user.username}</span>
            </div>
            <button className={css.logoutBtn} aria-label="Вийти">
              <svg className={css.icon} width="24" height="24">
                <use href="/icons.svg#icon-logout" />
              </svg>
            </button>
          </div>
        ) : (
          <div className={css.desktopAuthNav}>
            <Link href="/login" className={css.btnSecondary}>
              Вхід
            </Link>
            <Link href="/signup" className={css.btnPrimary}>
              Реєстрація
            </Link>
          </div>
        )}

        <div className={css.mobileRight}>
          {isLoggedIn ? (
            <Link href="/location/add" className={css.btnPrimary}>
              Поділитись локацією
            </Link>
          ) : (
            <>
              <Link href="/login" className={css.btnSecondary}>
                Вхід
              </Link>
              <Link href="/signup" className={css.btnPrimary}>
                Реєстрація
              </Link>
            </>
          )}
          <button
            className={css.burgerBtn}
            onClick={() => setIsMenuOpen(true)}
            aria-label="Відкрити меню"
          >
            <svg className={css.icon} width="32" height="32">
              <use href="/icons.svg#icon-menu" />
            </svg>
          </button>
        </div>
      </div>

      {isMenuOpen && (
        <div className={css.overlay} onClick={closeMenu}>
          <div className={css.drawer} onClick={e => e.stopPropagation()}>
            <div className={css.drawerHeader}>
              <Logo />
              <button className={css.closeBtn} onClick={closeMenu} aria-label="Закрити меню">
                <svg className={css.icon} width="32" height="32">
                  <use href="/icons.svg#icon-close" />
                </svg>
              </button>
            </div>

            <nav className={css.drawerNav}>
              <Link
                href="/"
                className={`${css.drawerLink} ${pathname === '/' ? css.active : ''}`}
                onClick={closeMenu}
              >
                Головна
              </Link>
              <Link
                href="/locations"
                className={`${css.drawerLink} ${pathname === '/locations' ? css.active : ''}`}
                onClick={closeMenu}
              >
                Місця відпочинку
              </Link>
              {isLoggedIn && (
                <Link
                  href="/profile"
                  className={`${css.drawerLink} ${pathname.startsWith('/profile') ? css.active : ''}`}
                  onClick={closeMenu}
                >
                  Мій профіль
                </Link>
              )}
            </nav>

            <div className={css.drawerBottom}>
              {isLoggedIn ? (
                <>
                  <Link
                    href="/locations/add"
                    className={`${css.btnPrimary} ${css.btnFull}`}
                    onClick={closeMenu}
                  >
                    Поділитись локацією
                  </Link>
                  <div className={css.drawerUserRow}>
                    <div className={css.avatar}>
                      <Image src={user.avatar} alt={user.username} width={32} height={32} />
                    </div>
                    <span className={css.userName}>{user.username}</span>
                    <span className={css.divider}>|</span>
                    <button className={css.logoutBtn} aria-label="Вийти">
                      <svg className={css.icon} width="24" height="24">
                        <use href="/icons.svg#icon-logout" />
                      </svg>
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <Link
                    href="/login"
                    className={`${css.btnSecondary} ${css.btnFull}`}
                    onClick={closeMenu}
                  >
                    Вхід
                  </Link>
                  <Link
                    href="/signup"
                    className={`${css.btnPrimary} ${css.btnFull}`}
                    onClick={closeMenu}
                  >
                    Реєстрація
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
