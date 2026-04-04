'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { useAuthStore } from '@/store/authStore';
import { getUserLocations } from '@/lib/clientApi';
import ProfileInfo from '@/components/blocks/ProfileInfo/ProfileInfo';
import PrivateProfilePlaceholder from '@/components/blocks/ProfilePlaceholder/PrivateProfilePlaceholder';
import { Loader } from '@/components/ui/Loader/Loader';
import css from './ProPage.module.css';
import LocationsGrid from '@/components/blocks/LocationsGrid/LocationsGrid';

export default function ProPage() {
  const router = useRouter();
  const { user, isLoggedIn, isAuthLoaded } = useAuthStore();

  const { data: locations = [], isLoading } = useQuery({
    queryKey: ['userLocations', user?.id],
    queryFn: () => getUserLocations(user!.id),
    enabled: !!user,
  });

  useEffect(() => {
    if (isAuthLoaded && !isLoggedIn) {
      router.replace('/login');
    }
  }, [isAuthLoaded, isLoggedIn, router]);

  if (!isAuthLoaded || !isLoggedIn || !user) return null;

  return (
    <div className={css.page}>
      <ProfileInfo name={user.name} avatar={user.avatar} articleCount={locations.length} />

      <section className={`${css.locations} section`}>
        <div className="container">
          <h2 className={css.heading}>Мої локації</h2>

          {isLoading ? (
            <Loader />
          ) : locations.length > 0 ? (
            <div className={css.grid}>
              {locations.map(location => (
                <LocationCard key={location.id} location={location} showEditButton />
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
