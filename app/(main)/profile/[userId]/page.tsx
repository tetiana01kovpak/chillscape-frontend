'use client';

import { use, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import PublicProfilePage from './PublicProfilePage';

interface ProfilePageProps {
  params: Promise<{ userId: string }>;
}

export default function ProfilePage({ params }: ProfilePageProps) {
  const { userId } = use(params);
  const router = useRouter();
  const { user, isLoggedIn, isAuthLoaded } = useAuthStore();

  useEffect(() => {
    if (isAuthLoaded && isLoggedIn && user?.id === userId) {
      router.replace('/pro');
    }
  }, [isAuthLoaded, isLoggedIn, user, userId, router]);

  if (isAuthLoaded && isLoggedIn && user?.id === userId) {
    return null;
  }

  return <PublicProfilePage userId={userId} />;
}
