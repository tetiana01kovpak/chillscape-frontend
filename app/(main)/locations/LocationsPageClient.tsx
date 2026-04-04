'use client';

import { useEffect, useState } from 'react';
import FilterPanel from '@/components/blocks/FilterPanel/FilterPanel';
import LocationsGrid from '@/components/blocks/LocationsGrid/LocationsGrid';
import LocationCard from '@/components/cards/LocationCard/LocationCard';
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
const PER_PAGE = 10;

// локальне сортування масиву локацій
const sortLocations = (
  items: LocationItem[],
  sort: Filters['sort'],
): LocationItem[] => {
  const sorted = [...items];

  if (sort === 'newest') {
    sorted.sort((a, b) => {
      const aTime = a.createdAt ? new Date(a.createdAt).getTime() : 0;
      const bTime = b.createdAt ? new Date(b.createdAt).getTime() : 0;

      return bTime - aTime;
    });
  }

  // popular і rating поки не чіпаємо,
  // бо під них у поточній моделі нема даних
  return sorted;
};

export default function LocationsPageClient() {
  // стан фільтрів для FilterPanel
  const [filters, setFilters] = useState<Filters>({
    search: '',
    region: '',
    type: '',
    sort: '',
  });

  // поточна сторінка
  const [page, setPage] = useState(1);

  // загальна к-сть сторінок із бек
  const [totalPages, setTotalPages] = useState(1);

  // дані для селектів
  const [regions, setRegions] = useState<SelectOption[]>([]);
  const [types, setTypes] = useState<SelectOption[]>([]);

  // список локацій
  const [locations, setLocations] = useState<LocationItem[]>([]);

  // стани завантаження
  const [isLoadingFilters, setIsLoadingFilters] = useState(false);
  const [isLoadingLocations, setIsLoadingLocations] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  // текст помилки для списку
  const [error, setError] = useState('');

  // регіони і типи локацій для фільтрів
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

  // завантажуємо локації при першому рендері та при зміні фільтрів
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
          page: 1,
          limit: PER_PAGE,
        });

        const sortedLocations = sortLocations(data.locations, filters.sort);

        // при зміні фільтрів повністю замінюємо список
        setLocations(sortedLocations);
        setPage(1);
        setTotalPages(data.totalPages);
      } catch (error) {
        console.error('Помилка при завантаженні локацій:', error);
        setError('Не вдалося завантажити локації');
        setLocations([]);
        setPage(1);
        setTotalPages(1);
      } finally {
        setIsLoadingLocations(false);
      }
    };

    loadLocations();
  }, [filters.search, filters.region, filters.type, filters.sort]);

  // оновлюємо фільтри
  const onFiltersChange = (next: Partial<Filters>) => {
    setFilters((prev) => ({
      ...prev,
      ...next,
    }));

    // при зміні будь-якого фільтра повертаємось на першу сторінку
    setPage(1);
  };

  // довантаження наступної сторінки
  const handleLoadMore = async () => {
    if (isLoadingMore || page >= totalPages) return;

    try {
      setIsLoadingMore(true);
      setError('');

      const nextPage = page + 1;

      const data = await fetchLocations({
        search: filters.search,
        region: filters.region,
        type: filters.type,
        sort: filters.sort,
        page: nextPage,
        limit: PER_PAGE,
      });

      // додаємо нову порцію до поточного списку
      // і після цього ще раз сортуємо
      setLocations((prev) =>
        sortLocations([...prev, ...data.locations], filters.sort),
      );

      setPage(nextPage);
      setTotalPages(data.totalPages);
    } catch (error) {
      console.error('Помилка при довантаженні локацій:', error);
      setError('Не вдалося завантажити наступну сторінку');
    } finally {
      setIsLoadingMore(false);
    }
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
          isLoadingMore={isLoadingMore}
          hasMore={page < totalPages}
          error={error}
          onLoadMore={handleLoadMore}
          renderCard={(location) => (
            <LocationCard
              id={location.id}
              src={location.image || '/images/location-placeholder.jpg'}
              alt={location.name}
              category={location.locationType}
              name={location.name}
            />
          )}
        />
      </div>
    </section>
  );
}
