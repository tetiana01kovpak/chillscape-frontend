'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';

export default function ProfilePage() {
  const router = useRouter();
  const { user, isLoggedIn, isAuthLoaded } = useAuthStore();

  useEffect(() => {
    if (!isAuthLoaded) return;

    if (isLoggedIn && user) {
      router.replace('/pro');
    } else {
      router.replace('/login');
    }
  }, [isAuthLoaded, isLoggedIn, user, router]);

  return null;
}
