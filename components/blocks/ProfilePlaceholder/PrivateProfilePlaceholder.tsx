import Link from 'next/link';
import css from './PrivateProfilePlaceholder.module.css';

export default function PrivateProfilePlaceholder() {
  return (
    <div className={css.card}>
      <h3 className={css.heading}>
        Ви ще нічого не публікували, поділіться своєю першою локацією!
      </h3>
      <div className={css.action}>
        <Link href="/locations/add" className={css.button}>
          Поділитись локацією
        </Link>
      </div>
    </div>
  );
}
