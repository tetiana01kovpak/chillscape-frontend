'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import styles from './HeroBlock.module.css';

const HeroBlock = () => {
  const [search, setSearch] = useState('');
  const router = useRouter();

  const handleSearch = () => {
    if (search.trim() !== '') {
      router.push(`/locations?search=${encodeURIComponent(search)}`);
    }
  };

  return (
    <section className={styles.hero}>
      <div className={styles.background}>
        <Image
          src="/hero-bg.jpg" // шлях до зображення з папки public
          alt="Hero Background"
          fill
          style={{ objectFit: 'cover' }}
          priority // щоб завантажувалось швидше при LCP
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
          <input
            type="text"
            placeholder="Введіть назву, тип або регіон..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className={styles.input}
          />
          <button onClick={handleSearch} className={styles.button}>
            Знайти місце
          </button>
        </div>
      </div>
    </section>
  );
};

export default HeroBlock;
