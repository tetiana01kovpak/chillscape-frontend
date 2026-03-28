import Link from 'next/link';
import css from './Footer.module.css';
import Logo from '@/components/ui/Logo/Logo';

export default function Footer() {
  const currentYear = new Date().getFullYear();
  return (
    <footer className={`${css.footer} section`}>
      <div className="container">
        <div className={css.content}>
          <Logo className={css.logoCustom} />
          <div className={css.socials}>
            <a href="https://facebook.com" target="_blank">
              <svg className={css.icon} width="32" height="32">
                <use href="/icons.svg#icon-facebook" />
              </svg>
            </a>
            <a href="https://instagram.com" target="_blank">
              <svg className={css.icon} width="32" height="32">
                <use href="/icons.svg#icon-Instagram" />
              </svg>
            </a>
            <a href="https://x.com" target="_blank">
              <svg className={css.icon} width="32" height="32">
                <use href="/icons.svg#icon-X" />
              </svg>
            </a>
            <a href="https://youtube.com" target="_blank">
              <svg className={css.icon} width="32" height="32">
                <use href="/icons.svg#icon-youtube" />
              </svg>
            </a>
          </div>
          <nav className={css.nav}>
            <Link href="/" className={css.navLink}>
              Головна
            </Link>
            <Link href="/locations" className={css.navLink}>
              Місця відпочинку
            </Link>
          </nav>
        </div>
        <hr className={css.line} />
        <p className={css.copyright}>© {currentYear} Природні Мандри. Усі права захищені.</p>
      </div>
    </footer>
  );
}
