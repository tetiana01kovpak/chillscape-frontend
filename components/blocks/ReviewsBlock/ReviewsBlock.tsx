'use client';

import { useEffect, useRef, useState } from 'react';
import styles from './ReviewsBlock.module.css';
import { Swiper, SwiperSlide } from 'swiper/react';
import type { Swiper as SwiperType } from 'swiper';
import { Pagination } from 'swiper/modules';

import 'swiper/css';
import 'swiper/css/pagination';

import ReviewCard from '@/components/cards/ReviewCard/ReviewCard';
import ArrowButton from '@/components/ui/ArrowButton/ArrowButton';
import { fetchReviews } from '@/lib/reviews';

export type Review = {
  id: string;
  rating: number;
  text: string;
  author: string;
  locationType: string;
};

function ReviewsBlock() {
  const swiperRef = useRef<SwiperType | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isBeginning, setIsBeginning] = useState(true);
  const [isEnd, setIsEnd] = useState(false);

  const hasReviews = reviews.length > 0;

  useEffect(() => {
    const loadReviews = async () => {
      const data = await fetchReviews();
      console.log(data);
      setReviews(data);
    };

    loadReviews();
  }, []);

  const updateNavigationState = (swiper: SwiperType) => {
    setIsBeginning(swiper.isBeginning);
    setIsEnd(swiper.isEnd);
  };

  return (
    <section className={`section ${styles.reviews}`}>
      <div className={'container'}>
        <div className={styles.header}>
          <h2 className={styles.title}>Останні відгуки</h2>
        </div>

        {hasReviews ? (
          <>
            <Swiper
              modules={[Pagination]}
              onSwiper={swiper => {
                swiperRef.current = swiper;
                updateNavigationState(swiper);
              }}
              onSlideChange={updateNavigationState}
              onResize={updateNavigationState}
              slidesPerView={1}
              slidesPerGroup={1}
              spaceBetween={32}
              pagination={{
                clickable: true,
                dynamicBullets: true,
              }}
              breakpoints={{
                768: {
                  slidesPerView: 2,
                  spaceBetween: 24,
                },
                1440: {
                  slidesPerView: 3,
                  spaceBetween: 24,
                },
              }}
              className={styles.slider}
            >
              {reviews.map(review => (
                <SwiperSlide key={review.id} className={styles.slide}>
                  <ReviewCard
                    rating={review.rating}
                    text={review.text}
                    author={review.author}
                    locationType={review.locationType}
                  />
                </SwiperSlide>
              ))}
            </Swiper>

            <div className={styles.actions}>
              <ArrowButton
                direction="prev"
                ariaLabel="Previous slide"
                onClick={() => swiperRef.current?.slidePrev()}
                disabled={isBeginning}
              />
              <ArrowButton
                direction="next"
                ariaLabel="Next slide"
                onClick={() => swiperRef.current?.slideNext()}
                disabled={isEnd}
              />
            </div>
          </>
        ) : (
          <div className={styles.emptyState}>
            <p className={styles.emptyText}>Відгуків ще немає.</p>
          </div>
        )}
      </div>
    </section>
  );
}

export default ReviewsBlock;
