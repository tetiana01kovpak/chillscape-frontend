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

  const isLocalUploadImage =
    image.startsWith('http://localhost:3000/uploads/') ||
    image.startsWith('https://localhost:3000/uploads/');

  return (
    <div className={css.wrapper}>
      <Image
        src={image}
        alt={name}
        fill
        sizes="(max-width: 767px) 374px, (max-width: 1439px) 768px, 821px"
        className={css.image}
        loading="eager"
        priority
        unoptimized={isLocalUploadImage}
      />
    </div>
  );
}
