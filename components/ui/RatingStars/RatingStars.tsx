'use client';

import { useState } from 'react';
import styles from './RatingStars.module.css';
import { Icon } from '@/components/ui/Icon/Icon';

type RatingStarsProps = {
  rating: number;                  
  readonly?: boolean;              
  onChange?: (rate: number) => void; 
};

type StarType = 'full' | 'half' | 'empty';

function Star({
  type,
  onMouseEnter,
  onMouseLeave,
  onClick,
}: {
  type: StarType;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
  onClick?: () => void;
}) {
  const iconName =
    type === 'full' ? 'icon-star-filled' : type === 'half' ? 'icon-star-half' : 'icon-star-rate';

  return (
    <Icon
      name={iconName}
      className={styles.star}
      aria-hidden="true"
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      onClick={onClick}
    />
  );
}

export default function RatingStars({ rating, readonly = true, onChange }: RatingStarsProps) {
  const [hovered, setHovered] = useState<number | null>(null);
  const displayed = hovered ?? rating;

  return (
    <div className={styles.rating}>
      {Array.from({ length: 5 }).map((_, i) => {
        let type: StarType = 'empty';
        if (displayed >= i + 1) type = 'full';
        else if (displayed > i) type = 'half';

        return (
          <Star
            key={i}
            type={type}
            onMouseEnter={() => !readonly && setHovered(i + 1)}
            onMouseLeave={() => !readonly && setHovered(null)}
            onClick={() => !readonly && onChange?.(i + 1)}
          />
        );
      })}
    </div>
  );
}
