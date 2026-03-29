import Link from 'next/link';
import styles from './ReviewCard.module.css';
import RatingStars from '@/components/ui/RatingStars/RatingStars';

// Тип пропсів для картки
type ReviewCardProps = {
  rating: number;
  text: string;
  author: string;
  locationName: string;
  locationSlug?: string;
};

function ReviewCard({
  rating,
  text,
  author,
  locationName,
  locationSlug,
}: ReviewCardProps) {
  return (
    <article className={styles.card}>
    <div className={styles.top}>
        <RatingStars rating={rating} />
        <p className={styles.text}>{text}</p>
    </div>
    <div className={styles.bottom}>
        <span className={styles.authorName}>{author}</span>
        {locationSlug ? (
        <Link href={`/locations/${locationSlug}`} className={styles.location}>
            {locationName}
        </Link>
        ) : (
        <span className={styles.location}>{locationName}</span>
        )}
    </div>
    </article>
);
}

export default ReviewCard;