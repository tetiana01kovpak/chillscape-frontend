import Logo from '@/components/ui/Logo/Logo';
import css from './AuthHeader.module.css';

export default function AuthHeader() {
  return (
    <header className={css.header}>
      <nav className={css.nav}>
        <Logo className={css.logo} />
      </nav>
    </header>
  );
}
