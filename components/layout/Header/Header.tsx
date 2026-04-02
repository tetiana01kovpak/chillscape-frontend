'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import Logo from '@/components/ui/Logo/Logo';
import { Icon } from '@/components/ui/Icon/Icon';
import { useAuthStore } from '@/store/authStore';
import { logoutUser } from '@/lib/clientApi';
import css from './Header.module.css';

export default function Header() {
  const router = useRouter();
  const { user, isLoggedIn, clearUser } = useAuthStore();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const closeMenu = () => setIsMenuOpen(false);

  const handleLogout = async () => {
    try {
      await logoutUser();
    } catch {
      // proceed with local logout even if API fails
    }
    localStorage.removeItem('hasSession');
    clearUser();
    closeMenu();
    router.push('/');
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeMenu();
    };

    const handleResize = () => {
      if (window.innerWidth >= 1440) closeMenu();
    };

    if (isMenuOpen) {
      document.addEventListener('keydown', handleKeyDown);
      window.addEventListener('resize', handleResize);
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
            {isLoggedIn && (
              <Link href="/pro" className={css.navLink}>
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
                  <Image
                    src={
                      user?.avatar || 'https://ac.goit.global/fullstack/react/default-avatar.jpg'
                    }
                    alt={user?.name || ''}
                    width={32}
                    height={32}
                  />
                </div>
                <span className={css.userName}>{user?.name}</span>
              </div>
              <span className={css.divider}></span>
              <button className={css.logoutBtn} aria-label="Вийти" onClick={handleLogout}>
                <Icon name="icon-logout" width={24} height={24} />
              </button>
            </div>
          ) : (
            <div className={css.desktopAuthNav}>
              <Link href="/login" className={css.btnSecondary}>
                Вхід
              </Link>
              <Link href="/register" className={css.btnPrimary}>
                Реєстрація
              </Link>
            </div>
          )}
        </div>

        <div className={`${css.mobileRight} ${isMenuOpen ? css.mobileRightMenuOpen : ''}`}>
          <div className={css.authBtns}>
            {isLoggedIn ? (
              <Link href="/locations/add" className={css.btnPrimary}>
                Опублікувати статтю
              </Link>
            ) : (
              <>
                <Link href="/login" className={css.btnSecondary}>
                  Вхід
                </Link>
                <Link href="/register" className={css.btnPrimary}>
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
            {isLoggedIn && (
              <Link href="/pro" className={css.drawerLink} onClick={closeMenu}>
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
                  Опублікувати статтю
                </Link>
                <div className={css.drawerUserRow}>
                  <div className={css.avatar}>
                    <Image
                      src={
                        user?.avatar || 'https://ac.goit.global/fullstack/react/default-avatar.jpg'
                      }
                      alt={user?.name || ''}
                      width={32}
                      height={32}
                    />
                  </div>
                  <span className={css.userName}>{user?.name}</span>
                  <span className={css.divider}></span>
                  <button className={css.logoutBtn} aria-label="Вийти" onClick={handleLogout}>
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
                  href="/register"
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
