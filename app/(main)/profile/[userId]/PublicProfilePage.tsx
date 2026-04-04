'use client';

import { useEffect, useState } from 'react';
import { getUserById, getUserLocations } from '@/lib/clientApi';
import ProfileInfo from '@/components/blocks/ProfileInfo/ProfileInfo';
import PublicProfilePlaceholder from '@/components/blocks/ProfilePlaceholder/PublicProfilePlaceholder';
import { Loader } from '@/components/ui/Loader/Loader';
import type { User } from '@/types/user';
import type { Location } from '@/types/location';
import css from './PublicProfilePage.module.css';
import LocationsGrid from '@/components/blocks/LocationsGrid/LocationsGrid';

interface PublicProfilePageProps {
  userId: string;
}

export default function PublicProfilePage({ userId }: PublicProfilePageProps) {
  const [profileUser, setProfileUser] = useState<User | null>(null);
  const [locations, setLocations] = useState<Location[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);

    Promise.all([getUserById(userId).catch(() => null), getUserLocations(userId).catch(() => [])])
      .then(([user, locs]) => {
        setProfileUser(user);
        setLocations(locs);
      })
      .finally(() => setIsLoading(false));
  }, [userId]);

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
        articleCount={locations.length}
      />

      <section className={`${css.locations} section`}>
        <div className="container">
          <h2 className={css.heading}>Локації</h2>

          {locations.length > 0 ? (
            <LocationsGrid locations={locations} />
          ) : (
            <PublicProfilePlaceholder />
          )}
        </div>
      </section>
    </div>
  );
}
