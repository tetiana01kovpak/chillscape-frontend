import Image from 'next/image';
import Link from 'next/link';
import type { Location } from '@/types/location';
import { Icon } from '@/components/ui/Icon/Icon';
import css from './LocationCard.module.css';

interface LocationCardProps {
  location: Location;
  showEditButton?: boolean;
}

export default function LocationCard({ location, showEditButton }: LocationCardProps) {
  return (
    <div className={css.card}>
      <div className={css.imageWrapper}>
        {location.imageUrl ? (
          <Image
            src={location.imageUrl}
            alt={location.name}
            fill
            sizes="(min-width: 1440px) 400px, (min-width: 768px) 336px, 100vw"
            className={css.image}
          />
        ) : (
          <div className={css.placeholder} />
        )}
      </div>

      <div className={css.content}>
        {location.type && <span className={css.type}>{location.type}</span>}
        <h3 className={css.name}>{location.name}</h3>

        <div className={css.actions}>
          <Link href={`/locations/${location.id}`} className={css.viewBtn}>
            Переглянути локацію
          </Link>

          {showEditButton && (
            <Link
              href={`/locations/${location.id}/edit`}
              className={css.editBtn}
              aria-label="Редагувати локацію"
            >
              <Icon name="icon-edit" width={20} height={20} />
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
