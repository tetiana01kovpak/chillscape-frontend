'use client';

import { use } from 'react';
import { useAuthStore } from '@/store/authStore';
import PublicProfilePage from './PublicProfilePage';
import PrivateProfilePage from './PrivateProfilePage';

interface ProfilePageProps {
  params: Promise<{ userId: string }>;
}

export default function ProfilePage({ params }: ProfilePageProps) {
  const { userId } = use(params);
  const { user, isLoggedIn } = useAuthStore();

  const isOwner = isLoggedIn && user?.id === userId;

  if (isOwner) {
    return <PrivateProfilePage />;
  }

  return <PublicProfilePage userId={userId} />;
}
