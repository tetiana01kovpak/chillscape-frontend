import Image from 'next/image';
import css from './LocationGallery.module.css';

interface Props {
  image?: string;
  name: string;
}

export default function LocationGallery({ image, name }: Props) {
  if (!image) {
    return <div className={css.wrapper} />;
  }
  return (
    <div className={css.wrapper}>
      <Image
        src={image}
        alt={name}
        fill
        sizes="(max-width: 767px) 374px, (max-width: 1439px) 768px, 821px"
        className={css.image}
        priority
      />
    </div>
  );
}
