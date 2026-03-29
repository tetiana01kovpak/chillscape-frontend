'use client';
import Link from 'next/link';
import css from './error-pages.module.css';

interface ErrorProps {
  reset: () => void;
}

export default function Error({ reset }: ErrorProps) {
  return (
    <div className={css.container}>
      <h1 className={css.code}>500</h1>
      <h2 className={css.title}>Something went wrong</h2>
      <p className={css.text}>
        An unexpected error occurred. Please try again or return to the home page.
      </p>
      <div className={css.actions}>
        <button className={css.btn} onClick={reset}>
          Try again
        </button>
        <Link href="/" className={css.btn}>
          Back to home
        </Link>
      </div>
    </div>
  );
}
