import Image from 'next/image';
import css from './LocationCard.module.css';
import Link from 'next/link';
import { Button } from '@/components/ui/Button/Button';

interface LocationCardTypes {
  id: string;
  src: string;
  alt: string;
  category: string;
  name: string;
}

export default function LocationCard({ id, src, alt, category, name }: LocationCardTypes) {
  return (
    <div className={css.card}>
      {src ? (
        <Image src={src} alt={alt} width={400} height={300} className={css.img} />
      ) : (
        <div className={css.imgPlaceholder} />
      )}
      <div className={css.bottom}>
        <p className={css.category}>{category}</p>
        <h3 className={css.name}>{name}</h3>
        <Link href={`/locations/${id}`}>
          <Button variant="secondary">Переглянути локацію</Button>
        </Link>
      </div>
    </div>
  );
}
