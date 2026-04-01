import styles from './ReviewCard.module.css';
import RatingStars from '@/components/ui/RatingStars/RatingStars';

type ReviewCardProps = {
  rating: number;
  text: string;
  author: string;
  locationType: string;
};

function ReviewCard({ rating, text, author, locationType }: ReviewCardProps) {
  return (
    <article className={styles.card}>
      <div className={styles.top}>
        <RatingStars rating={rating} />
        <p className={styles.text}>{text}</p>
      </div>
      <div className={styles.bottom}>
        <span className={styles.authorName}>{author}</span>
        <span className={styles.locationType}>{locationType}</span>
      </div>
    </article>
  );
}

export default ReviewCard;
