'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import { getUserLocations } from '@/lib/clientApi';
import ProfileInfo from '@/components/blocks/ProfileInfo/ProfileInfo';
import PrivateProfilePlaceholder from '@/components/blocks/ProfilePlaceholder/PrivateProfilePlaceholder';
import LocationCard from '@/components/cards/LocationCard/LocationCard';
import { Loader } from '@/components/ui/Loader/Loader';
import type { Location } from '@/types/location';
import css from './ProPage.module.css';

export default function ProPage() {
  const router = useRouter();
  const { user, isLoggedIn, isAuthLoaded } = useAuthStore();
  const [locations, setLocations] = useState<Location[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (isAuthLoaded && !isLoggedIn) {
      router.replace('/login');
    }
  }, [isAuthLoaded, isLoggedIn, router]);

  useEffect(() => {
    if (!user) return;

    setIsLoading(true);
    getUserLocations(user.id)
      .then(setLocations)
      .catch(() => setLocations([]))
      .finally(() => setIsLoading(false));
  }, [user]);

  if (!isAuthLoaded || !isLoggedIn || !user) return null;

  return (
    <div className={css.page}>
      <ProfileInfo
        name={user.name}
        avatar={user.avatar}
        articleCount={locations.length}
      />

      <section className={`${css.locations} section`}>
        <div className="container">
          <h2 className={css.heading}>Мої локації</h2>

          {isLoading ? (
            <Loader />
          ) : locations.length > 0 ? (
            <div className={css.grid}>
              {locations.map(location => (
                <LocationCard
                  key={location.id}
                  location={location}
                  showEditButton
                />
              ))}
            </div>
          ) : (
            <PrivateProfilePlaceholder />
          )}
        </div>
      </section>
    </div>
  );
}
