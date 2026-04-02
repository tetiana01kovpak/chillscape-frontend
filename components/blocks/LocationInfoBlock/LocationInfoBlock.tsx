import Link from 'next/link';
import StarRating from '@/components/ui/StarRating/StarRating';
import css from './LocationInfoBlock.module.css';

interface Props {
  location: {
    image: string;
    name: string;
    rate: number;
    region: string;
    ownerId: string;
  };
  typeName: string;
  authorName: string;
}

export default function LocationInfoBlock({ location, typeName, authorName }: Props) {
  const { name, rate, region, ownerId } = location;

  return (
    <div className={css.wrapper}>
      <div className={css.rating}>
        <div className={css.ratingContainer}>
          <StarRating value={rate} />
        </div>
        <span className={css.ratingDivider}>·</span>
        <span className={css.ratingValue}>{rate.toFixed(1)}</span>
      </div>

      <h1 className={css.title}>{name}</h1>

      <div className={css.meta}>
        <div>
          <span className={css.label}>Регіон: </span>
          <span className={css.value}>{region}</span>
        </div>
        <div>
          <span className={css.label}>Тип локації: </span>
          <span className={css.value}>{typeName}</span>
        </div>
        <div>
          <span className={css.label}>Автор статті: </span>
          <Link href={`/profile/${ownerId}`} className={css.authorLink}>
            {authorName}
          </Link>
        </div>
      </div>
    </div>
  );
}
