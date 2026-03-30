'use client';

import { useEffect } from 'react';
import { getCurrentUser } from '@/lib/clientApi';
import { useAuthStore } from '@/store/authStore';

export default function AuthProvider({ children }: { children: React.ReactNode }) {
  const setUser = useAuthStore(state => state.setUser);

  useEffect(() => {
    getCurrentUser()
      .then(user => setUser(user))
      .catch(() => {});
  }, [setUser]);

  return <>{children}</>;
}
