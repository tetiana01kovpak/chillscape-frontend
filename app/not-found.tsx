import Link from 'next/link';
import css from './error-pages.module.css';

export default function NotFound() {
  return (
    <div className={css.container}>
      <h1 className={css.code}>404</h1>
      <h2 className={css.title}>Page not found</h2>
      <p className={css.text}>
        Sorry, the page you are looking for does not exist or has been moved.
      </p>
      <Link href="/" className={css.btn}>
        Back to home
      </Link>
    </div>
  );
}
