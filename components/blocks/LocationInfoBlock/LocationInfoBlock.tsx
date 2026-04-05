import Link from 'next/link';
import DynamicRating from '@/components/ui/DynamicRating/DynamicRating';
import { Location } from '@/types/locations';
import css from './LocationInfoBlock.module.css';

interface Props {
  location: Location;
  typeName: string;
  authorName: string;
  regionName: string;
}

export default function LocationInfoBlock({ location, typeName, authorName, regionName }: Props) {
  const { _id, name, ownerId, rate } = location;

  return (
    <div className={css.wrapper}>
      <DynamicRating locationId={_id} initialRating={rate} />

      <h1 className={css.title}>{name}</h1>

      <div className={css.meta}>
        <div>
          <span className={css.label}>Регіон: </span>
          <span className={css.value}>{regionName}</span>
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
