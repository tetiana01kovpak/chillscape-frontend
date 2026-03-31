import Link from 'next/link';
import css from './PublicProfilePlaceholder.module.css';

export default function PublicProfilePlaceholder() {
  return (
    <div className={css.card}>
      <h3 className={css.heading}>
        Цей користувач ще не ділився локаціями
      </h3>
      <div className={css.action}>
        <Link href="/" className={css.button}>
          Назад до локацій
        </Link>
      </div>
    </div>
  );
}
