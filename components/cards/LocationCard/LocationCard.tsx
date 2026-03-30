import Image from 'next/image';
import css from './LocationCard.module.css';
import Link from 'next/link';

interface LocationCardTypes {
  src: string;
  alt: string;
  category: string;
  name: string;
}
export default function LocationCard({ src, alt, category, name }: LocationCardTypes) {
  return (
    <div className={css.card}>
      <Image src={src} alt={alt} className={css.img}></Image>
      <div className={css.bottom}>
        <p className={css.category}>{category}Category</p>
        <p>Stars</p>
        <h3 className={css.name}>{name}Name</h3>
        <Link href={'/locations/[id]'} className={css.link}>
          Переглянути локацію
        </Link>
      </div>
    </div>
  );
}
