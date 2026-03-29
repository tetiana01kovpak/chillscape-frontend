'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import styles from './HeroBlock.module.css';
import { Input } from '@/components/ui/Input/Input';
import { Button } from '@/components/ui/Button/Button';

const HeroBlock = () => {
  const [search, setSearch] = useState('');
  const router = useRouter();

  const handleSearch = () => {
    if (search.trim() !== '') {
      router.push(`/locations?search=${encodeURIComponent(search)}`);
    }
  };

  return (
    <section className={styles.heroWrapper}>
      <section className={styles.hero}>
        <div className={styles.background}>
          <Image
            src="/hero-bg.jpg"
            alt="Hero Background"
            fill
            style={{ objectFit: 'cover' }}
            sizes="(max-width: 375px) 100vw, (max-width: 1440px) 1400px, 100vw"
            priority
          />
        </div>

        <div className={styles.content}>
          <h1 className={styles.title}>
            Відкрий для себе Україну. Знайди ідеальне місце для відпочинку
          </h1>
          <p className={styles.subtitle}>
            Тисячі перевірених локацій з реальними фото та відгуками від мандрівників
          </p>

          <div className={styles.search}>
            <Input
              placeholder="Введіть назву, тип або регіон..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className={styles.heroInput}
            />
            <Button
              onClick={handleSearch}
              className={styles.heroButton}
            >
              Знайти місце
            </Button>
          </div>
        </div>
      </section>
    </section>
  );
};

export default HeroBlock;
