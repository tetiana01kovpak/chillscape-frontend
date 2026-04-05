import Image from 'next/image';
import Link from 'next/link';
import type { LocationCardData } from '@/types/location';
import { Icon } from '@/components/ui/Icon/Icon';
import RatingStars from '@/components/ui/RatingStars/RatingStars';
import css from './LocationCard.module.css';
import styles from '../../ui/Button/Button.module.css';

interface LocationCardProps {
  location: LocationCardData;
  showEditButton?: boolean;
}

export default function LocationCard({ location, showEditButton = false }: LocationCardProps) {
  return (
    <article className={css.card}>
      <div className={css.imageWrapper}>
        <Image
          src={location.imageUrl}
          alt={location.name}
          fill
          sizes="(min-width: 1440px) 400px, (min-width: 768px) 336px, 100vw"
          className={css.image}
          priority
        />
      </div>

      <div className={css.content}>
        <span className={css.type}>{location.typeName}</span>

        <div className={css.rating}>
          <RatingStars rating={location.rating} />
        </div>

        <h3 className={css.name}>{location.name}</h3>

        <div className={css.actions}>
          <Link
            href={`/locations/${location.id}`}
            className={`${styles.secondary} ${styles.btn} ${css.viewBtn}`}
          >
            Переглянути локацію
          </Link>

          {showEditButton && (
            <Link
              href={`/locations/${location.id}/edit`}
              className={`${styles.secondary} ${styles.btn} ${css.editBtn}`}
              aria-label="Редагувати локацію"
            >
              <Icon name="icon-edit" width={20} height={20} />
            </Link>
          )}
        </div>
      </div>
    </article>
  );
}
