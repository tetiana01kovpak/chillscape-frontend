'use client';

import Link from 'next/link';
import type { ReactNode } from 'react';
import styles from './LocationsGrid.module.css';
//import { Button } from '@/components/ui/Button/Button';
import type { LocationItem } from '@/lib/locations';

type LocationsGridProps = {
  locations: LocationItem[];
  isLoading?: boolean;
  isLoadingMore?: boolean;
  hasMore?: boolean;
  error?: string;
  onLoadMore?: () => void;
  renderCard?: (location: LocationItem) => ReactNode;
};

export default function LocationsGrid({
  locations,
  isLoading = false,
  //isLoadingMore = false,
  //hasMore = false,
  error = '',
  //onLoadMore,
  renderCard,
}: LocationsGridProps) {
  if (isLoading) {
    return <p className={styles.message}>Завантаження локацій...</p>;
  }

  if (error) {
    return <p className={styles.message}>{error}</p>;
  }

  if (!locations.length) {
    return <p className={styles.message}>За вашим запитом нічого не знайдено.</p>;
  }

  return (
    <>
      <div className={styles.grid}>
        {locations.map((location) => (
          <div key={location.id} className={styles.cardWrapper}>
            {renderCard ? (
              renderCard(location)
            ) : (
              <article className={styles.fallbackCard}>
                <Link
                  href={`/locations/${location.id}`}
                  className={styles.cardLink}
                >
                  <div
                    className={styles.image}
                    style={{
                      backgroundImage: location.image
                        ? `url(${location.image})`
                        : 'none',
                    }}
                  />

                  <div className={styles.content}>
                    <p className={styles.meta}>
                      {location.region} • {location.locationType}
                    </p>

                    <h3 className={styles.title}>{location.name}</h3>

                    <p className={styles.description}>
                      {location.description.length > 120
                        ? `${location.description.slice(0, 120)}...`
                        : location.description}
                    </p>
                  </div>
                </Link>
              </article>
            )}
          </div>
        ))}
      </div>

      {/* {hasMore && onLoadMore && (
        <div className={styles.buttonWrapper}>
          <Button
            type="button"
            onClick={onLoadMore}
            disabled={isLoadingMore}
          >
            {isLoadingMore ? 'Завантаження...' : 'Показати ще'}
          </Button>
        </div>
      )} */}
    </>
  );
}