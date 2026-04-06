'use client';

import Image from 'next/image';
import Link from 'next/link';
import type { LocationCardData } from '@/types/location';
import { Icon } from '@/components/ui/Icon/Icon';
import RatingStars from '@/components/ui/RatingStars/RatingStars';
import css from './LocationCard.module.css';
import styles from '../../ui/Button/Button.module.css';
import DynamicRating from '@/components/ui/DynamicRating/DynamicRating';

interface LocationCardProps {
  location: LocationCardData;
  showEditButton?: boolean;
  eagerImage?: boolean;
}

export default function LocationCard({
  location,
  showEditButton = false,
  eagerImage = false,
}: LocationCardProps) {
  const isLocalUploadImage =
    location.imageUrl.startsWith('http://localhost:3000/uploads/') ||
    location.imageUrl.startsWith('https://localhost:3000/uploads/');

  return (
    <article className={css.card}>
      <div className={css.imageWrapper}>
        <Image
          src={location.imageUrl}
          alt={location.name}
          fill
          sizes="(min-width: 1440px) 400px, (min-width: 768px) 336px, 100vw"
          className={css.image}
          loading={eagerImage ? 'eager' : 'lazy'}
          style={{ objectFit: 'cover' }}
          unoptimized={isLocalUploadImage}
        />
      </div>

      <div className={css.content}>
        <span className={css.type}>{location.typeName}</span>

        <div className={css.rating}>
          <DynamicRating
            locationId={location.id}
            initialRating={location.rating}
            showValue={false}
          />
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
              <Icon name="icon-edit" width={24} height={24} />
            </Link>
          )}
        </div>
      </div>
    </article>
  );
}
