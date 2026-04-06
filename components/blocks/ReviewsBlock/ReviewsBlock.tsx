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
import { fetchLocationReviews } from '@/lib/reviews';

export type Review = {
  id: string;
  rating: number;
  text: string;
  author: string;
  locationType: string;
};

type Feedback = {
  _id: string;
  rate: number;
  description: string;
  userName?: string;
};

type ReviewsBlockProps = {
  placeId?: string;
  feedbacks?: Feedback[];
  title?: string;
  showLocationType?: boolean;
};

function ReviewsBlock({
  placeId,
  feedbacks,
  title = 'Останні відгуки',
  showLocationType = true,
}: ReviewsBlockProps) {
  const swiperRef = useRef<SwiperType | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isBeginning, setIsBeginning] = useState(true);
  const [isEnd, setIsEnd] = useState(false);

  const locationReviews: Review[] = (feedbacks ?? []).map(feedback => ({
    id: feedback._id,
    rating: feedback.rate,
    text: feedback.description,
    author: feedback.userName || 'Невідомий автор',
    locationType: '',
  }));

  const displayedReviews = feedbacks ? locationReviews : reviews;
  const hasReviews = displayedReviews.length > 0;

  useEffect(() => {
    if (feedbacks) return;
    if (!placeId) return;

    const loadReviews = async () => {
      const data = await fetchLocationReviews(placeId); // ← замінити
      setReviews(data);
    };

    loadReviews();
  }, [feedbacks, placeId]);

  const updateNavigationState = (swiper: SwiperType) => {
    setIsBeginning(swiper.isBeginning);
    setIsEnd(swiper.isEnd);
  };

  return (
    <section className={`section ${styles.reviews}`}>
      <div className={'container'}>
        <div className={styles.header}>
          <h2 className={styles.title}>{title}</h2>
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
              pagination={{ clickable: true, dynamicBullets: true }}
              breakpoints={{
                768: { slidesPerView: 2, spaceBetween: 24 },
                1440: { slidesPerView: 3, spaceBetween: 24 },
              }}
              className={styles.slider}
            >
              {displayedReviews.map(review => (
                <SwiperSlide key={review.id} className={styles.slide}>
                  <ReviewCard
                    rating={review.rating}
                    text={review.text}
                    author={review.author}
                    locationType={showLocationType ? review.locationType : undefined}
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
