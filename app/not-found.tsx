import Link from 'next/link';
import css from './error-pages.module.css';

export default function NotFound() {
  return (
    <div className={css.container}>
      <h1 className={css.code}>404</h1>
      <h2 className={css.title}>Сторінку не знайдено</h2>
      <p className={css.text}>На жаль, сторінка, яку ви шукаєте, не існує або була переміщена.</p>
      <Link href="/" className={css.btn}>
        Повернутися на головну
      </Link>
    </div>
  );
}
