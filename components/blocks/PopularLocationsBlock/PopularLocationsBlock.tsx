'use client';

import { useEffect, useRef, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import type { Swiper as SwiperType } from 'swiper';
import 'swiper/css';
import Link from 'next/link';

import LocationCard from '@/components/cards/LocationCard/LocationCard';
import { Loader } from '@/components/ui/Loader/Loader';
import css from './PopularLocationsBlock.module.css';
import { Button } from '@/components/ui/Button/Button';
import { getLocations } from '@/lib/clientApi';
import { Icon } from '@/components/ui/Icon/Icon';

interface Location {
  _id: string;
  images: string[];
  name: string;
  locationType: string;
}

interface LocationsResponse {
  locations: Location[];
  page: number;
  perPage: number;
  totalLocations: number;
  totalPages: number;
}

export default function PopularLocationsBlock() {
  const [locations, setLocations] = useState<Location[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const swiperRef = useRef<SwiperType | null>(null);
  const prevRef = useRef<HTMLButtonElement>(null);
  const nextRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const fetchLocations = async () => {
      setLoading(true);
      setError(null);
      try {
        const data: LocationsResponse = await getLocations();
        setLocations(data.locations);
        console.log('locations response', data);
      } catch (err) {
        console.error(err);
        setError('Не вдалося завантажити локації. Спробуйте пізніше.');
      } finally {
        setLoading(false);
      }
    };

    fetchLocations();
  }, []);

  if (loading) {
    return (
      <section className={css.section}>
        <div className={css.container}>
          <Loader size={48} className={css.loader} />
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className={css.section}>
        <div className={css.container}>
          <p className={css.error}>{error}</p>
        </div>
      </section>
    );
  }

  return (
    <section className={css.section}>
      <div className={css.container}>
        <div className={css.header}>
          <h2 className={css.title}>Популярні локації</h2>
          <Link href="/locations" className={css.allLink}>
            Всі локації
          </Link>
        </div>

        <Swiper
          modules={[Navigation]}
          onSwiper={swiper => {
            swiperRef.current = swiper;
          }}
          onInit={swiper => {
            if (typeof swiper.params.navigation === 'object' && swiper.params.navigation !== null) {
              swiper.params.navigation.prevEl = prevRef.current;
              swiper.params.navigation.nextEl = nextRef.current;
            }
            swiper.navigation.init();
            swiper.navigation.update();
          }}
          slidesPerView={1}
          spaceBetween={24}
          breakpoints={{
            0: { slidesPerView: 1, spaceBetween: 24 },
            768: { slidesPerView: 2, spaceBetween: 24 },
            1440: { slidesPerView: 3, spaceBetween: 24 },
          }}
        >
          {locations.map(loc => (
            <SwiperSlide key={loc._id}>
              <LocationCard
                id={loc._id}
                src={loc.images?.[0]}
                alt={loc.name}
                category={loc.locationType}
                name={loc.name}
              />
            </SwiperSlide>
          ))}
        </Swiper>

        <div className={css.navButtons}>
          <Button
            variant="icon"
            className={css.navBtn}
            aria-label="Попередній слайд"
            icon={<Icon name="icon-arrow-back" width="16" height="16" />}
            onClick={() => swiperRef.current?.slidePrev()}
          />
          <Button
            variant="icon"
            className={css.navBtn}
            aria-label="Наступний слайд"
            icon={<Icon name="icon-arrow-forward" width="16" height="16" />}
            onClick={() => swiperRef.current?.slideNext()}
          />
        </div>
      </div>
    </section>
  );
}
