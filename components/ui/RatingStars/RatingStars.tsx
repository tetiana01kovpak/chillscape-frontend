'use client';

import styles from './RatingStars.module.css';
import { Icon } from '@/components/ui/Icon/Icon';

type RatingStarsProps = {
  rating: number;
};

type StarProps = {
  type: 'full' | 'half' | 'empty';
};

function Star({ type }: StarProps) {
  const iconName =
    type === 'full' ? 'icon-star-filled' : type === 'half' ? 'icon-star-half' : 'icon-star-rate';

  return <Icon name={iconName} className={styles.star} aria-hidden="true" />;
}

function RatingStars({ rating }: RatingStarsProps) {
  return (
    <div className={styles.rating}>
      {Array.from({ length: 5 }).map((_, i) => {
        let type: 'full' | 'half' | 'empty' = 'empty';

        if (rating >= i + 1) {
          type = 'full';
        } else if (rating > i) {
          type = 'half';
        }

        return <Star key={i} type={type} />;
      })}
    </div>
  );
}

export default RatingStars;
