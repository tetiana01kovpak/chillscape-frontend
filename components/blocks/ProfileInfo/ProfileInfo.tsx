import Image from 'next/image';
import css from './ProfileInfo.module.css';

interface ProfileInfoProps {
  name: string;
  avatar?: string;
  articleCount: number;
}

const DEFAULT_AVATAR = 'https://ac.goit.global/fullstack/react/default-avatar.jpg';

export default function ProfileInfo({ name, avatar, articleCount }: ProfileInfoProps) {
  return (
    <section className={`${css.section} section`}>
      <div className={`container ${css.container}`}>
        <div className={css.profile}>
          <div className={css.avatar}>
            <Image
              src={avatar || DEFAULT_AVATAR}
              alt={name}
              width={145}
              height={145}
              className={css.avatarImage}
            />
          </div>
          <div className={css.info}>
            <h1 className={css.name}>{name}</h1>
            <p className={css.articles}>Статей: {articleCount}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
