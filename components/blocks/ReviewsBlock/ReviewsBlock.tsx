'use client';

import Link from "next/link";
import { useId, useRef } from "react";
import styles from "./ReviewsBlock.module.css";
import { Swiper, SwiperSlide } from "swiper/react";
import type { Swiper as SwiperType } from "swiper";
import "swiper/css";

type Review = {
  id: string;
  rating: number;
  text: string;
  author: string;
  locationName: string;
  locationSlug?: string;
};

type StarProps = {
  type: "full" | "half" | "empty";
};

export function Star({ type }: StarProps) {
  const gradientId = useId();

  if (type === "full") {
    return (
      <svg
        viewBox="0 0 24 24"
        width="20"
        height="20"
        fill="currentColor"
        stroke="currentColor"
        strokeWidth="2"
      >
        <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
      </svg>
    );
  }

  if (type === "half") {
    return (
      <svg
        viewBox="0 0 24 24"
        width="20"
        height="20"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      >
        <defs>
          <linearGradient id={gradientId}>
            <stop offset="50%" stopColor="currentColor" />
            <stop offset="50%" stopColor="transparent" />
          </linearGradient>
        </defs>
        <path
          fill={`url(#${gradientId})`}
          d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"
        />
      </svg>
    );
  }

  return (
    <svg
      viewBox="0 0 24 24"
      width="20"
      height="20"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
    </svg>
  );
}

const localReviews: Review[] = [
  {
    id: "1",
    rating: 5,
    text: "Неймовірне місце для перезавантаження. Природа просто вау!",
    author: "Олена Коваль",
    locationName: "Бакота",
    locationSlug: "bakota",
  },
  {
    id: "2",
    rating: 4,
    text: "Тихо, спокійно, дуже атмосферно. Обов'язково повернусь.",
    author: "Ігор Петров",
    locationName: "Карпати",
    locationSlug: "mountains",
  },
  {
    id: "3",
    rating: 5,
    text: "Ідеальне місце для відпочинку від міської метушні.",
    author: "Марія Шевченко",
    locationName: "Ліс",
    locationSlug: "forest",
  },
  {
    id: "4",
    rating: 4.5,
    text: "Дуже затишно і красиво. Гарне місце для вікенду.",
    author: "Анна Бойко",
    locationName: "Озеро",
    locationSlug: "lake",
  },
];

function ReviewsBlock() {
  const swiperRef = useRef<SwiperType | null>(null);
  const reviews = localReviews;

  return (
    <section className={styles.reviews}>
      <h2 className={styles["reviews__title"]}>Останні відгуки</h2>

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
        className={styles["reviews__slider"]}
      >
        {reviews.map((review) => (
          <SwiperSlide key={review.id} className={styles["reviews__slide"]}>
            <article className={styles["review-card"]}>
              <div className={styles["review-card__top"]}>
                <div className={styles["review-card__rating"]}>
                  {Array.from({ length: 5 }).map((_, i) => {
                    let type: "full" | "half" | "empty" = "empty";

                    if (review.rating >= i + 1) {
                      type = "full";
                    } else if (review.rating > i) {
                      type = "half";
                    }

                    return <Star key={i} type={type} />;
                  })}
                </div>

                <p className={styles["review-card__text"]}>{review.text}</p>
              </div>

              <div className={styles["review-card__bottom"]}>
                <span className={styles["review-card__author-name"]}>
                  {review.author}
                </span>

                {review.locationSlug ? (
                  <Link
                    href={`/locations/${review.locationSlug}`}
                    className={styles["review-card__author-location"]}
                  >
                    {review.locationName}
                  </Link>
                ) : (
                  <span className={styles["review-card__author-location"]}>
                    {review.locationName}
                  </span>
                )}
              </div>
            </article>
          </SwiperSlide>
        ))}
      </Swiper>

      <div className={styles["reviews__actions"]}>
        <button
          type="button"
          aria-label="Previous"
          className={styles["reviews__button"]}
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
          className={styles["reviews__button"]}
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