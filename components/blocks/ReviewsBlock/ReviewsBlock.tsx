'use client';

import { useRef } from 'react';
import styles from './ReviewsBlock.module.css';
import { Swiper, SwiperSlide } from 'swiper/react';
import type { Swiper as SwiperType } from 'swiper';
import 'swiper/css';
import ReviewCard from '@/components/cards/ReviewCard/ReviewCard';

type Review = {
  id: string;
  rating: number;
  text: string;
  author: string;
  locationName: string;
  locationSlug?: string;
};

// Локальні тестові дані
const localReviews: Review[] = [
  {
    id: '1',
    rating: 5,
    text: 'Неймовірне місце для перезавантаження. Природа просто вау!',
    author: 'Олена Коваль',
    locationName: 'Бакота',
    locationSlug: 'bakota',
  },
  {
    id: '2',
    rating: 4,
    text: "Тихо, спокійно, дуже атмосферно. Обов'язково повернусь.",
    author: 'Ігор Петров',
    locationName: 'Карпати',
    locationSlug: 'mountains',
  },
  {
    id: '3',
    rating: 5,
    text: 'Ідеальне місце для відпочинку від міської метушні.',
    author: 'Марія Шевченко',
    locationName: 'Ліс',
    locationSlug: 'forest',
  },
  {
    id: '4',
    rating: 4.5,
    text: 'Дуже затишно і красиво. Гарне місце для вікенду.',
    author: 'Анна Бойко',
    locationName: 'Озеро',
    locationSlug: 'lake',
  },
];

function ReviewsBlock() {
  const swiperRef = useRef<SwiperType | null>(null);

  return (
    <section className={styles.reviews}>
      <h2 className={styles.title}>Останні відгуки</h2>

      <Swiper
        onSwiper={(swiper) => {
          swiperRef.current = swiper;
        }}
        slidesPerView={1}
        slidesPerGroup={1}
        spaceBetween={32}
        breakpoints={{
          768: { slidesPerView: 2 },
          1280: { slidesPerView: 3 },
        }}
        className={styles.slider}
      >
        {localReviews.map((review) => (
          <SwiperSlide key={review.id} className={styles.slider}>
            <ReviewCard
              rating={review.rating}
              text={review.text}
              author={review.author}
              locationName={review.locationName}
              locationSlug={review.locationSlug}
            />
          </SwiperSlide>
        ))}
      </Swiper>

      <div className={styles.actions}>
        <button
          type="button"
          aria-label="Previous"
          className={styles.button}
          onClick={() => swiperRef.current?.slidePrev()}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.8}
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18"
            />
          </svg>
        </button>

        <button
          type="button"
          aria-label="Next"
          className={styles.button}
          onClick={() => swiperRef.current?.slideNext()}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.8}
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"
            />
          </svg>
        </button>
      </div>
    </section>
  );
}

export default ReviewsBlock;