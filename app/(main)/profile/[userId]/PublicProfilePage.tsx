'use client';

import { useEffect, useState } from 'react';
import {
  buildLocationTypeMap,
  getLocationTypes,
  getUserById,
  getUserLocationsRaw,
  mapLocationToCardData,
} from '@/lib/clientApi';
import ProfileInfo from '@/components/blocks/ProfileInfo/ProfileInfo';
import PublicProfilePlaceholder from '@/components/blocks/ProfilePlaceholder/PublicProfilePlaceholder';
import { Loader } from '@/components/ui/Loader/Loader';
import { Button } from '@/components/ui/Button/Button';
import type { User } from '@/types/user';
import type { LocationCardData } from '@/types/location';
import css from './PublicProfilePage.module.css';
import LocationsGrid from '@/components/blocks/LocationsGrid/LocationsGrid';

interface PublicProfilePageProps {
  userId: string;
}

const getProfilePageLimit = () => {
  if (typeof window !== 'undefined' && window.innerWidth >= 1440) {
    return 6;
  }

  return 4;
};

export default function PublicProfilePage({ userId }: PublicProfilePageProps) {
  const [profileUser, setProfileUser] = useState<User | null>(null);
  const [locations, setLocations] = useState<LocationCardData[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [limit, setLimit] = useState(4);

  useEffect(() => {
    const currentLimit = getProfilePageLimit();
    setLimit(currentLimit);

    async function loadInitialData() {
      setIsLoading(true);

      try {
        const [user, rawLocationsData, locationTypes] = await Promise.all([
          getUserById(userId).catch(() => null),
          getUserLocationsRaw(userId, 1, currentLimit).catch(() => ({
            page: 1,
            limit: currentLimit,
            totalItems: 0,
            totalPages: 0,
            locations: [],
          })),
          getLocationTypes().catch(() => []),
        ]);

        const typeNameMap = buildLocationTypeMap(locationTypes);
        const mappedLocations = rawLocationsData.locations.map((location) =>
          mapLocationToCardData(location, typeNameMap)
        );

        setProfileUser(user);
        setLocations(mappedLocations);
        setPage(1);
        setHasMore(rawLocationsData.page < rawLocationsData.totalPages);
      } finally {
        setIsLoading(false);
      }
    }

    loadInitialData();
  }, [userId]);

  const handleLoadMore = async () => {
    if (isLoadingMore || !hasMore) return;

    setIsLoadingMore(true);

    try {
      const nextPage = page + 1;

      const [rawLocationsData, locationTypes] = await Promise.all([
        getUserLocationsRaw(userId, nextPage, limit),
        getLocationTypes(),
      ]);

      const typeNameMap = buildLocationTypeMap(locationTypes);
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

  if (isLoading) {
    return (
      <div className={css.page}>
        <Loader />
      </div>
    );
  }

  return (
    <div className={css.page}>
      <ProfileInfo
        name={profileUser?.name || ''}
        avatar={profileUser?.avatar}
        articleCount={profileUser?.articlesAmount ?? locations.length}
      />

      <section className={`${css.locations} section`}>
        <div className={`${css.pageWrap} container`}>
          <h2 className={css.heading}>Локації</h2>

          {locations.length > 0 ? (
            <>
              <LocationsGrid locations={locations} />

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
            <PublicProfilePlaceholder />
          )}
        </div>
      </section>
    </div>
  );
}
