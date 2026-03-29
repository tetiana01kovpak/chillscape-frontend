'use client';

import { useEffect, useRef, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import type { Swiper as SwiperType } from 'swiper';
import 'swiper/css';
import axios from 'axios';
import Link from 'next/link';

import LocationCard from '@/components/cards/LocationCard/LocationCard';
import css from './PopularLocationsBlock.module.css';

interface Location {
  _id: string;
  image: string;
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
  const swiperRef = useRef<SwiperType | null>(null);
  const prevRef = useRef<HTMLButtonElement>(null);
  const nextRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    axios
      .get<LocationsResponse>('http://localhost:3000/api/locations')
      .then((res) => setLocations(res.data.locations))
      .catch((err) => console.error(err));
  }, []);

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
          onSwiper={(swiper) => {
            swiperRef.current = swiper;
          }}
          onInit={(swiper) => {
            if (typeof swiper.params.navigation === 'object' && swiper.params.navigation !== null) {
              swiper.params.navigation.prevEl = prevRef.current;
              swiper.params.navigation.nextEl = nextRef.current;
            }
            swiper.navigation.init();
            swiper.navigation.update();
          }}
          slidesPerView={1}
          spaceBetween={16}
          breakpoints={{
            640: { slidesPerView: 2, spaceBetween: 20 },
            900: { slidesPerView: 3, spaceBetween: 24 },
          }}
        >
          {locations.map((loc) => (
            <SwiperSlide key={loc._id}>
              <LocationCard
                src={loc.image}
                alt={loc.name}
                category={loc.locationType}
                name={loc.name}
              />
            </SwiperSlide>
          ))}
        </Swiper>

        <div className={css.navButtons}>
          <button
            ref={prevRef}
            className={css.navBtn}
            aria-label="Попередній слайд"
            onClick={() => swiperRef.current?.slidePrev()}
          >
            &#8592;
          </button>
          <button
            ref={nextRef}
            className={css.navBtn}
            aria-label="Наступний слайд"
            onClick={() => swiperRef.current?.slideNext()}
          >
            &#8594;
          </button>
        </div>

      </div>
    </section>
  );
}