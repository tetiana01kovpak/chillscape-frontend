import Link from 'next/link';
import css from './Logo.module.css';

interface LogoProps {
  className?: string;
}

const Logo = function ({ className }: LogoProps) {
  return (
    <Link className={`${css.logoLink} ${className || ''}`} href="/">
      <svg className={css.icon} width="24" height="24">
        <use href="/icons.svg#icon-map-search" />
      </svg>
      <span className={css.logoText}>Relax Map</span>
    </Link>
  );
};

export default Logo;
