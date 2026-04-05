'use client';

import { useEffect, useState } from 'react';
import FilterPanel from '@/components/blocks/FilterPanel/FilterPanel';
import LocationsGrid from '@/components/blocks/LocationsGrid/LocationsGrid';
import Pagination from '@/components/Pagination/Pagination';
import LocationCard from '@/components/cards/LocationCard/LocationCard';
import type { Location as LocationCardData } from '@/types/location';
import styles from './LocationsPageClient.module.css';

import {
  fetchRegions,
  fetchLocationTypes,
  fetchLocations,
  type Filters,
  type SelectOption,
  type LocationItem,
} from '@/lib/locations';

// к-сть карток за один запит
const PER_PAGE = 3;

export default function LocationsPageClient() {
  // стан фільтрів
  const [filters, setFilters] = useState<Filters>({
    search: '',
    region: '',
    type: '',
    sort: '',
  });

  // поточна сторінка
  const [page, setPage] = useState(1);

  // загальна к-сть сторінок із бекенду
  const [totalPages, setTotalPages] = useState(1);

  // дані для селектів
  const [regions, setRegions] = useState<SelectOption[]>([]);
  const [types, setTypes] = useState<SelectOption[]>([]);

  // список локацій
  const [locations, setLocations] = useState<LocationItem[]>([]);

  // стани завантаження
  const [isLoadingFilters, setIsLoadingFilters] = useState(false);
  const [isLoadingLocations, setIsLoadingLocations] = useState(false);

  // текст помилки
  const [error, setError] = useState('');

  // Завантаження фільтрів
  useEffect(() => {
    const loadFilterOptions = async () => {
      try {
        setIsLoadingFilters(true);

        const [regionsData, typesData] = await Promise.all([
          fetchRegions(),
          fetchLocationTypes(),
        ]);

        setRegions(regionsData);
        setTypes(typesData);
      } catch (error) {
        console.error('Помилка при завантаженні фільтрів:', error);
      } finally {
        setIsLoadingFilters(false);
      }
    };

    loadFilterOptions();
  }, []);

  // Завантаження локацій при зміні фільтрів, сортування або сторінки
  useEffect(() => {
    const loadLocations = async () => {
      try {
        setIsLoadingLocations(true);
        setError('');

        const data = await fetchLocations({
          search: filters.search,
          region: filters.region,
          type: filters.type,
          sort: filters.sort,
          page,
          limit: PER_PAGE,
        });

        setLocations(data.locations);
        setTotalPages(data.totalPages);
      } catch (error) {
        console.error('Помилка при завантаженні локацій:', error);
        setError('Не вдалося завантажити локації');
        setLocations([]);
        setTotalPages(1);
      } finally {
        setIsLoadingLocations(false);
      }
    };

    loadLocations();
  }, [filters.search, filters.region, filters.type, filters.sort, page]);

  // Оновлення фільтрів
  const onFiltersChange = (next: Partial<Filters>) => {
    setFilters((prev) => ({
      ...prev,
      ...next,
    }));

    // При зміні будь-якого фільтра повертаємось на першу сторінку
    setPage(1);
  };

  // Зміна сторінки
  const handlePageChange = (nextPage: number) => {
    if (nextPage < 1 || nextPage > totalPages || nextPage === page) return;

    setPage(nextPage);

    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  return (
    <section className={`section ${styles.page}`}>
      <div className="container">
        <FilterPanel
          filters={filters}
          regions={regions}
          types={types}
          onFiltersChange={onFiltersChange}
        />

        {isLoadingFilters && (
          <p className={styles.filtersMessage}>Завантаження фільтрів...</p>
        )}

        <LocationsGrid
          locations={locations}
          isLoading={isLoadingLocations}
          error={error}
          renderCard={(location) => (
          <LocationCard
            location={{
              id: location.id,
              imageUrl: location.image || '',
              name: location.name,
              type: location.locationType,
          } as LocationCardData}
      />
)}
  />
        <Pagination
          totalPages={totalPages}
          currentPage={page}
          setCurrentPage={handlePageChange}
        />
      </div>
    </section>
  );
}