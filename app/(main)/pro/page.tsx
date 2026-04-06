'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { useAuthStore } from '@/store/authStore';
import {
  buildLocationTypeMap,
  getLocationTypes,
  getUserLocationsRaw,
  mapLocationToCardData,
} from '@/lib/clientApi';
import ProfileInfo from '@/components/blocks/ProfileInfo/ProfileInfo';
import PrivateProfilePlaceholder from '@/components/blocks/ProfilePlaceholder/PrivateProfilePlaceholder';
import { Loader } from '@/components/ui/Loader/Loader';
import { Button } from '@/components/ui/Button/Button';
import css from './ProPage.module.css';
import LocationsGrid from '@/components/blocks/LocationsGrid/LocationsGrid';
import type { LocationType } from '@/types/locations';
import type { LocationCardData } from '@/types/location';

const getProfilePageLimit = () => {
  if (typeof window !== 'undefined' && window.innerWidth >= 1440) {
    return 6;
  }

  return 4;
};

export default function ProPage() {
  const router = useRouter();
  const { user, isLoggedIn, isAuthLoaded } = useAuthStore();

  const [locations, setLocations] = useState<LocationCardData[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [limit, setLimit] = useState(4);

  useEffect(() => {
    setLimit(getProfilePageLimit());
  }, []);

  const { data: locationTypes = [], isLoading: isTypesLoading } = useQuery<LocationType[]>({
    queryKey: ['locationTypes'],
    queryFn: getLocationTypes,
    enabled: !!user,
  });

  const { data: initialLocationsData, isLoading: isLocationsLoading } = useQuery({
    queryKey: ['userLocations', user?.id, limit],
    queryFn: () => getUserLocationsRaw(user!.id, 1, limit),
    enabled: !!user && !!limit,
  });

  const typeNameMap = useMemo(() => buildLocationTypeMap(locationTypes), [locationTypes]);

  useEffect(() => {
    if (initialLocationsData) {
      const mappedLocations = initialLocationsData.locations.map((location) =>
        mapLocationToCardData(location, typeNameMap)
      );

      setLocations(mappedLocations);
      setPage(1);
      setHasMore(initialLocationsData.page < initialLocationsData.totalPages);
    }
  }, [initialLocationsData, typeNameMap]);

  useEffect(() => {
    if (isAuthLoaded && !isLoggedIn) {
      router.replace('/login');
    }
  }, [isAuthLoaded, isLoggedIn, router]);

  const handleLoadMore = async () => {
    if (!user || isLoadingMore || !hasMore) return;

    setIsLoadingMore(true);

    try {
      const nextPage = page + 1;
      const rawLocationsData = await getUserLocationsRaw(user.id, nextPage, limit);

      const mappedLocations = rawLocationsData.locations.map((location) =>
        mapLocationToCardData(location, typeNameMap)
      );

      setLocations((prev) => [...prev, ...mappedLocations]);
      setPage(nextPage);
      setHasMore(rawLocationsData.page < rawLocationsData.totalPages);
    } finally {
      setIsLoadingMore(false);
    }
  };

  if (!isAuthLoaded || !isLoggedIn || !user) return null;

  return (
    <div className={css.page}>
      <ProfileInfo
        name={user.name}
        avatar={user.avatar}
        articleCount={user.articlesAmount ?? locations.length}
      />

      <section className={`${css.locations} section`}>
        <div className={`${css.pageWrap} container`}>
          <h2 className={css.heading}>Мої локації</h2>

          {isLocationsLoading || isTypesLoading ? (
            <Loader />
          ) : locations.length > 0 ? (
            <>
              <LocationsGrid locations={locations} showEditButton />

              {isLoadingMore && (
                <div className={css.appendLoaderWrap}>
                  <Loader />
                </div>
              )}

              {hasMore && (
                <div className={css.loadMoreWrap}>
                  <Button
                    type="button"
                    variant="primary"
                    onClick={handleLoadMore}
                    disabled={isLoadingMore}
                    className={css.button}
                  >
                    Показати ще
                  </Button>
                </div>
              )}
            </>
          ) : (
            <PrivateProfilePlaceholder />
          )}
        </div>
      </section>
    </div>
  );
}
