'use client';

import LocationCard from '@/components/cards/LocationCard/LocationCard';
import ArrowButton from '@/components/ui/ArrowButton/ArrowButton';
import css from '@/components/blocks/PopularLocationsBlock/PopularLocationsBlock.module.css';

import { useQuery } from '@tanstack/react-query';
import { getLocations } from '@/lib/clientApi';
import { Loader } from '@/components/ui/Loader/Loader';

import { Swiper, SwiperSlide } from 'swiper/react';
import type { Swiper as SwiperType } from 'swiper';
import { Navigation } from 'swiper/modules';
import { useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Location } from '@/types/locations';

import 'swiper/css';
import 'swiper/css/navigation';
import { Button } from '@/components/ui/Button/Button';

export default function PopularLocations() {
  const {
    data: locations = [],
    isLoading,
    isError,
  } = useQuery<Location[]>({
    queryKey: ['locations'],
    queryFn: getLocations,
  });

  const prevRef = useRef<HTMLButtonElement | null>(null);
  const nextRef = useRef<HTMLButtonElement | null>(null);
  const router = useRouter();

  if (isLoading) {
    return <Loader />;
  }

  if (isError) {
    return <h2>Не вдалося завантажити локації. Спробуйте пізніше.</h2>;
  }

  return (
    <section className={css.section} suppressHydrationWarning>
      <div className="container">
        <div className={css.locHeader}>
          <h2 className={css.locTitle}>Популярні локації</h2>

          <Button
            variant="primary"
            className={css.allLocBtn}
            onClick={() => router.push('/locations')}
          >
            Всі локації
          </Button>
        </div>

        <Swiper
          modules={[Navigation]}
          spaceBetween={24}
          slidesPerView={1}
          onBeforeInit={(swiper: SwiperType) => {
            if (typeof swiper.params.navigation !== 'boolean') {
              swiper.params.navigation = {
                ...swiper.params.navigation,
                prevEl: prevRef.current,
                nextEl: nextRef.current,
              };
            }
          }}
          breakpoints={{
            768: {
              slidesPerView: 2,
            },
            1440: {
              slidesPerView: 3,
            },
          }}
        >
          {locations.map(location => (
            <SwiperSlide key={location._id}>
              <div className={css.locationCard}>
                <LocationCard
                  location={{
                    id: location._id,
                    name: location.name,
                    imageUrl: location.image,
                    type: location.locationType || location.typeName,
                  }}
                />
              </div>
            </SwiperSlide>
          ))}
        </Swiper>

        <div className={css.btnContainer}>
          <ArrowButton ref={prevRef} direction="prev" ariaLabel="Previous locations" />
          <ArrowButton ref={nextRef} direction="next" ariaLabel="Next locations" />
        </div>
      </div>
    </section>
  );
}
