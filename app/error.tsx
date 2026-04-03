'use client';
import Link from 'next/link';
import css from './error-pages.module.css';

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function Error({ error, reset }: ErrorProps) {
  console.error(error); // для дебагу в консолі

  return (
    <div className={css.container}>
      <h2 className={css.title}>Щось пішло не так</h2>
      <p className={css.text}>
        Виникла непередбачена помилка. Спробуйте оновити сторінку або повернутися на головну.
      </p>
      <div className={css.actions}>
        <button className={css.btn} onClick={reset}>
          Спробувати ще раз
        </button>
        <Link href="/" className={css.btn}>
          Повернутися на головну
        </Link>
      </div>
    </div>
  );
}
