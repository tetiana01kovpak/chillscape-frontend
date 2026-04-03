import Image from 'next/image';
import css from './LocationGallery.module.css';

interface Props {
  image: string;
  name: string;
}

export default function LocationGallery({ image, name }: Props) {
  return (
    <div className={css.wrapper}>
      <Image src={image} alt={name} fill className={css.image} priority />{' '}
    </div>
  );
}
