'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';

import LocationCard from '@/components/cards/LocationCard/LocationCard';
import ArrowButton from '@/components/ui/ArrowButton/ArrowButton';
import { Button } from '@/components/ui/Button/Button';
import { Loader } from '@/components/ui/Loader/Loader';

import {
  buildLocationTypeMap,
  getLocations,
  getLocationTypes,
  mapLocationToCardData,
} from '@/lib/clientApi';

import type { Location, LocationType } from '@/types/locations';

import css from './PopularLocationsBlock.module.css';

import 'swiper/css';
import 'swiper/css/navigation';

export default function PopularLocationsBlock() {
  const [prevEl, setPrevEl] = useState<HTMLButtonElement | null>(null);
  const [nextEl, setNextEl] = useState<HTMLButtonElement | null>(null);

  const {
    data: locations = [],
    isLoading: isLocationsLoading,
    isError: isLocationsError,
  } = useQuery<Location[]>({
    queryKey: ['locations'],
    queryFn: getLocations,
  });

  const {
    data: locationTypes = [],
    isLoading: isTypesLoading,
    isError: isTypesError,
  } = useQuery<LocationType[]>({
    queryKey: ['locationTypes'],
    queryFn: getLocationTypes,
  });

  const cards = useMemo(() => {
    const typeNameMap = buildLocationTypeMap(locationTypes);

    return locations
      .map(location =>
        mapLocationToCardData(location as unknown as Record<string, unknown>, typeNameMap)
      )
      .sort((a, b) => b.rating - a.rating)
      .slice(0, 6);
  }, [locations, locationTypes]);

  if (isLocationsLoading || isTypesLoading) {
    return <Loader />;
  }

  if (isLocationsError || isTypesError) {
    return (
      <section className={css.section}>
        <div className="container">
          <h2 className={css.locTitle}>Популярні локації</h2>
          <p>Не вдалося завантажити популярні локації.</p>
        </div>
      </section>
    );
  }

  if (cards.length === 0) {
    return null;
  }

  return (
    <section className={css.section}>
      <div className="container">
        <div className={css.locHeader}>
          <h2 className={css.locTitle}>Популярні локації</h2>

          <Link href="/locations">
            <Button variant="primary" className={css.allLocBtn}>
              Всі локації
            </Button>
          </Link>
        </div>

        <Swiper
          key={prevEl && nextEl ? 'popular-swiper-ready' : 'popular-swiper-init'}
          modules={[Navigation]}
          navigation={
            prevEl && nextEl
              ? {
                  prevEl,
                  nextEl,
                }
              : false
          }
          spaceBetween={24}
          slidesPerView={1}
          breakpoints={{
            768: {
              slidesPerView: 2,
            },
            1440: {
              slidesPerView: 3,
            },
          }}
        >
          {cards.map(location => (
            <SwiperSlide key={location.id}>
              <div className={css.locationCard}>
                <LocationCard location={location} />
              </div>
            </SwiperSlide>
          ))}
        </Swiper>

        <div className={css.btnContainer}>
          <ArrowButton ref={setPrevEl} direction="prev" ariaLabel="Попередній слайд" />
          <ArrowButton ref={setNextEl} direction="next" ariaLabel="Наступний слайд" />
        </div>
      </div>
    </section>
  );
}
