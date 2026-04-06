'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import FilterPanel from '@/components/blocks/FilterPanel/FilterPanel';
import LocationsGrid from '@/components/blocks/LocationsGrid/LocationsGrid';
import type { Location as LocationCardData } from '@/types/location';
import { Button } from '@/components/ui/Button/Button';
import { Loader } from '@/components/ui/Loader/Loader';
import styles from './LocationsPageClient.module.css';

import {
  fetchRegions,
  fetchLocationTypes,
  fetchLocations,
  normalizeSortValue,
  type Filters,
  type SelectOption,
  type LocationItem,
} from '@/lib/locations';

const getLocationsPageLimit = () => {
  if (typeof window !== 'undefined' && window.innerWidth >= 1440) {
    return 9;
  }

  return 6;
};

const dedupeLocationsById = (items: LocationItem[]) => {
  const uniqueLocations = new Map<string, LocationItem>();

  items.forEach(item => {
    uniqueLocations.set(item.id, item);
  });

  return [...uniqueLocations.values()];
};

const getStableRatingSortedLocations = (items: LocationItem[]) => {
  const getSortableRating = (value: number) =>
    Number.isFinite(value) ? value : Number.NEGATIVE_INFINITY;

  return [...items].sort((a, b) => {
    const ratingA = getSortableRating(a.rating);
    const ratingB = getSortableRating(b.rating);

    if (ratingB !== ratingA) {
      return ratingB - ratingA;
    }

    if (a.createdAt && b.createdAt) {
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    }

    return a.id.localeCompare(b.id);
  });
};

export default function LocationsPageClient() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const filters = useMemo<Filters>(
    () => ({
      search: searchParams.get('search') ?? '',
      region: searchParams.get('region') ?? '',
      type: searchParams.get('type') ?? '',
      sort: normalizeSortValue(searchParams.get('sort')),
    }),
    [searchParams]
  );

  const page = useMemo(() => {
    const currentPage = Number(searchParams.get('page') ?? '1');
    return Number.isInteger(currentPage) && currentPage > 0 ? currentPage : 1;
  }, [searchParams]);

  const [totalPages, setTotalPages] = useState(1);
  const [limit, setLimit] = useState(6);
  const [regions, setRegions] = useState<SelectOption[]>([]);
  const [types, setTypes] = useState<SelectOption[]>([]);
  const [locations, setLocations] = useState<LocationItem[]>([]);
  const [isLoadingFilters, setIsLoadingFilters] = useState(false);
  const [isLoadingLocations, setIsLoadingLocations] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [error, setError] = useState('');

  const requestIdRef = useRef(0);
  const previousPageRef = useRef(1);
  const previousRequestContextKeyRef = useRef('');
  const gridSectionRef = useRef<HTMLDivElement | null>(null);
  const pendingScrollIndexRef = useRef<number | null>(null);

  const filtersKey = useMemo(() => JSON.stringify(filters), [filters]);

  const requestContextKey = useMemo(() => JSON.stringify({ filters, limit }), [filters, limit]);

  const typeLabelMap = useMemo(
    () => new Map(types.map(typeOption => [typeOption.value, typeOption.label])),
    [types]
  );

  useEffect(() => {
    const updateLimit = () => {
      setLimit(getLocationsPageLimit());
    };

    updateLimit();
    window.addEventListener('resize', updateLimit);

    return () => {
      window.removeEventListener('resize', updateLimit);
    };
  }, []);

  useEffect(() => {
    const loadFilterOptions = async () => {
      try {
        setIsLoadingFilters(true);

        const [regionsData, typesData] = await Promise.all([fetchRegions(), fetchLocationTypes()]);

        setRegions(regionsData);
        setTypes(typesData);
      } catch (loadError) {
        console.error('Помилка при завантаженні фільтрів:', loadError);
      } finally {
        setIsLoadingFilters(false);
      }
    };

    loadFilterOptions();
  }, []);

  useEffect(() => {
    const currentRequestId = requestIdRef.current + 1;
    requestIdRef.current = currentRequestId;

    const sameFilters = previousRequestContextKeyRef.current === requestContextKey;
    const shouldAppend = sameFilters && page > 1 && page === previousPageRef.current + 1;

    const loadLocations = async () => {
      try {
        setError('');

        if (shouldAppend) {
          setIsLoadingMore(true);
          pendingScrollIndexRef.current = locations.length;
        } else {
          setIsLoadingLocations(true);
          setIsLoadingMore(false);
          setLocations([]);
          pendingScrollIndexRef.current = null;
        }

        if (shouldAppend) {
          const data = await fetchLocations({
            search: filters.search,
            region: filters.region,
            type: filters.type,
            sort: filters.sort,
            page,
            limit,
          });

          if (requestIdRef.current !== currentRequestId) {
            return;
          }

          setLocations(prev => dedupeLocationsById([...prev, ...data.locations]));
          setTotalPages(data.totalPages);

          requestAnimationFrame(() => {
            const scrollIndex = pendingScrollIndexRef.current;
            const cards = gridSectionRef.current?.querySelectorAll('article');
            const nextCard = scrollIndex !== null ? cards?.[scrollIndex] : null;

            nextCard?.scrollIntoView({
              behavior: 'smooth',
              block: 'start',
            });

            pendingScrollIndexRef.current = null;
          });
        } else {
          const pagesToLoad = Array.from({ length: page }, (_, index) => index + 1);

          const pagesData = await Promise.all(
            pagesToLoad.map(pageNumber =>
              fetchLocations({
                search: filters.search,
                region: filters.region,
                type: filters.type,
                sort: filters.sort,
                page: pageNumber,
                limit,
              })
            )
          );

          if (requestIdRef.current !== currentRequestId) {
            return;
          }

          const lastPage = pagesData.at(-1);

          setLocations(dedupeLocationsById(pagesData.flatMap(data => data.locations)));
          setTotalPages(lastPage?.totalPages ?? 1);
          pendingScrollIndexRef.current = null;
        }

        previousRequestContextKeyRef.current = requestContextKey;
        previousPageRef.current = page;
      } catch (loadError) {
        if (requestIdRef.current !== currentRequestId) {
          return;
        }

        console.error('Помилка при завантаженні локацій:', loadError);

        if (!shouldAppend) {
          setError('Не вдалося завантажити локації');
          setLocations([]);
          setTotalPages(1);
        }

        pendingScrollIndexRef.current = null;
      } finally {
        if (requestIdRef.current !== currentRequestId) {
          return;
        }

        setIsLoadingLocations(false);
        setIsLoadingMore(false);
      }
    };

    loadLocations();
  }, [filters, filtersKey, limit, page, requestContextKey]);

  const onFiltersChange = (next: Partial<Filters>) => {
    const nextParams = new URLSearchParams(searchParams.toString());
    const nextFilters = {
      ...filters,
      ...next,
    };

    Object.entries(nextFilters).forEach(([key, value]) => {
      const normalizedValue = value.trim();

      if (normalizedValue) {
        nextParams.set(key, normalizedValue);
      } else {
        nextParams.delete(key);
      }
    });

    requestIdRef.current += 1;
    previousPageRef.current = 1;
    previousRequestContextKeyRef.current = '';
    pendingScrollIndexRef.current = null;
    setLocations([]);
    setTotalPages(1);
    setError('');
    setIsLoadingLocations(true);
    setIsLoadingMore(false);

    nextParams.set('page', '1');
    router.replace(`${pathname}?${nextParams.toString()}`, { scroll: false });
  };

  const handlePageChange = (nextPage: number) => {
    if (nextPage < 1 || nextPage > totalPages || nextPage === page || isLoadingMore) {
      return;
    }

    const nextParams = new URLSearchParams(searchParams.toString());
    nextParams.set('page', String(nextPage));
    router.replace(`${pathname}?${nextParams.toString()}`, { scroll: false });
  };

  const orderedLocations = useMemo(
    () => (filters.sort === 'rating' ? getStableRatingSortedLocations(locations) : locations),
    [filters.sort, locations]
  );

  const cardLocations: LocationCardData[] = orderedLocations.map(location => ({
    id: location.id,
    imageUrl: location.imageUrl || '/images/placeholder.jpg',
    name: location.name,
    typeName: typeLabelMap.get(location.locationType) || location.locationType,
    rating: location.rating,
  }));
  const isInitialLoading = isLoadingFilters || isLoadingLocations;

  return (
    <section className={`section ${styles.page}`}>
      <div className="container">
        <FilterPanel
          filters={filters}
          regions={regions}
          types={types}
          onFiltersChange={onFiltersChange}
        />

        {isLoadingFilters && !isLoadingLocations && (
          <div className={styles.filtersLoaderWrap}>
            <Loader />
          </div>
        )}

        {isInitialLoading ? (
          <div className={styles.locationsLoaderWrap}>
            <Loader />
          </div>
        ) : error ? (
          <p className={styles.locationsMessage}>{error}</p>
        ) : cardLocations.length === 0 ? (
          <p className={styles.locationsMessage}>За вашим запитом нічого не знайдено.</p>
        ) : (
          <>
            <div ref={gridSectionRef}>
              <LocationsGrid locations={cardLocations} />
            </div>

            {isLoadingMore && (
              <div className={styles.appendLoaderWrap}>
                <Loader />
              </div>
            )}
          </>
        )}

        {page < totalPages && !error && cardLocations.length > 0 && !isInitialLoading && (
          <div className={styles.loadMoreWrap}>
            <Button
              type="button"
              className={styles.loadMoreButton}
              onClick={() => handlePageChange(page + 1)}
              disabled={isLoadingMore}
            >
              Показати ще
            </Button>
          </div>
        )}
      </div>
    </section>
  );
}
