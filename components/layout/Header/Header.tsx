'use client';

import { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import Logo from '@/components/ui/Logo/Logo';
import { Icon } from '@/components/ui/Icon/Icon';
import { useAuthStore } from '@/store/authStore';
import css from './Header.module.css';

export default function Header() {
  const router = useRouter();
  const pathname = usePathname();
  const { user, isLoggedIn, isAuthLoaded } = useAuthStore();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isTabletUp, setIsTabletUp] = useState(false);

  const registerHref =
    pathname && pathname !== '/register' && pathname !== '/login'
      ? `/register?redirect=${encodeURIComponent(pathname)}`
      : '/register';

  const closeMenu = () => setIsMenuOpen(false);

  const openLogoutModal = () => {
    closeMenu();
    router.push('/logout');
  };

  useEffect(() => {
    const syncViewport = () => {
      setIsTabletUp(window.innerWidth >= 768);
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeMenu();
    };

    const handleResize = () => {
      syncViewport();
      if (window.innerWidth >= 1440) closeMenu();
    };

    syncViewport();
    window.addEventListener('resize', handleResize);

    if (isMenuOpen) {
      document.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('resize', handleResize);
      document.body.style.overflow = '';
    };
  }, [isMenuOpen]);

  return (
    <header className={`${css.header} section`}>
      <div className={`container ${css.inner}`}>
        <Logo />

        <div className={css.desktopRight}>
          <nav className={css.desktopNav}>
            <Link href="/" className={css.navLink}>
              Головна
            </Link>
            <Link href="/locations" className={css.navLink}>
              Місця відпочинку
            </Link>
            {isAuthLoaded && isLoggedIn && (
              <Link href="/pro" className={css.navLink}>
                Мій профіль
              </Link>
            )}
          </nav>

          {!isAuthLoaded ? (
            <div className={css.authPlaceholder} aria-hidden="true" />
          ) : isLoggedIn ? (
            <div className={css.desktopUserMenu}>
              <Link href="/locations/add" className={css.btnPrimary}>
                Поділитися локацією
              </Link>
              <div className={css.userInfo}>
                <div className={css.avatar}>
                  <Image
                    src={user?.avatar || 'https://ac.goit.global/fullstack/react/default-avatar.jpg'}
                    alt={user?.name || ''}
                    width={32}
                    height={32}
                  />
                </div>
                <span className={css.userName}>{user?.name}</span>
              </div>
              <span className={css.divider}></span>
              <button className={css.logoutBtn} aria-label="Вийти" onClick={openLogoutModal}>
                <Icon name="icon-logout" width={24} height={24} />
              </button>
            </div>
          ) : (
            <div className={css.desktopAuthNav}>
              <Link href="/login" className={css.btnSecondary}>
                Вхід
              </Link>
              <Link href={registerHref} className={css.btnPrimary}>
                Реєстрація
              </Link>
            </div>
          )}
        </div>

        <div className={`${css.mobileRight} ${isMenuOpen ? css.mobileRightMenuOpen : ''}`}>
          <div className={css.authBtns}>
            {!isAuthLoaded ? null : isLoggedIn ? (
              isTabletUp ? (
                <Link href="/locations/add" className={css.btnPrimary}>
                  Опублікувати статтю
                </Link>
              ) : null
            ) : (
              <>
                <Link href="/login" className={css.btnSecondary}>
                  Вхід
                </Link>
                <Link href={registerHref} className={css.btnPrimary}>
                  Реєстрація
                </Link>
              </>
            )}
          </div>

          <button
            className={css.burgerBtn}
            onClick={() => setIsMenuOpen(prev => !prev)}
            aria-label={isMenuOpen ? 'Закрити меню' : 'Відкрити меню'}
          >
            <Icon name={isMenuOpen ? 'icon-close' : 'icon-menu'} width={24} height={24} />
          </button>
        </div>
      </div>

      {isMenuOpen && (
        <div className={css.drawer} onClick={e => e.stopPropagation()}>
          <nav className={css.drawerNav}>
            <Link href="/" className={css.drawerLink} onClick={closeMenu}>
              Головна
            </Link>
            <Link href="/locations" className={css.drawerLink} onClick={closeMenu}>
              Місця відпочинку
            </Link>
            {isAuthLoaded && isLoggedIn && (
              <Link href="/pro" className={css.drawerLink} onClick={closeMenu}>
                Мій профіль
              </Link>
            )}
          </nav>

          <div className={css.drawerBottom}>
            {!isAuthLoaded ? null : isLoggedIn ? (
              <>
                {!isTabletUp && (
                  <Link
                    href="/locations/add"
                    className={`${css.btnPrimary} ${css.btnFull} ${css.publishBottomMobile}`}
                    onClick={closeMenu}
                  >
                    Опублікувати статтю
                  </Link>
                )}

                <div className={css.drawerUserRow}>
                  <div className={css.avatar}>
                    <Image
                      src={user?.avatar || 'https://ac.goit.global/fullstack/react/default-avatar.jpg'}
                      alt={user?.name || ''}
                      width={32}
                      height={32}
                    />
                  </div>
                  <span className={css.userName}>{user?.name}</span>
                  <span className={css.divider}></span>
                  <button className={css.logoutBtn} aria-label="Вийти" onClick={openLogoutModal}>
                    <Icon name="icon-logout" width={24} height={24} />
                  </button>
                </div>
              </>
            ) : (
              <div className={css.drawerAuthBtns}>
                <Link
                  href="/login"
                  className={`${css.btnSecondary} ${css.btnFull}`}
                  onClick={closeMenu}
                >
                  Вхід
                </Link>
                <Link
                  href={registerHref}
                  className={`${css.btnPrimary} ${css.btnFull}`}
                  onClick={closeMenu}
                >
                  Реєстрація
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
