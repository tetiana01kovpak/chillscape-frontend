'use client';

import RatingStars from '@/components/ui/RatingStars/RatingStars';
import { useFeedbacks } from '@/hooks/useFeedbacks';
import css from './DynamicRating.module.css';

interface Props {
  locationId: string;
  initialRating: number;
  showValue?: boolean;
}

export default function DynamicRating({ locationId, initialRating, showValue = true }: Props) {
  const { rating, loading } = useFeedbacks(locationId, initialRating);

  if (loading) return <div className={css.rating} style={{ visibility: 'hidden' }} />;

  return (
    <div className={css.rating}>
      <div className={css.ratingContainer}>
        <RatingStars rating={rating} />
      </div>
      {showValue && (
        <>
          <span className={css.ratingDivider}>·</span>
          <span className={css.ratingValue}>{rating.toFixed(1)}</span>
        </>
      )}
    </div>
  );
}
