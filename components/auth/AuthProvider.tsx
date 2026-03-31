'use client';

import { useEffect } from 'react';
import { getCurrentUser } from '@/lib/clientApi';
import { useAuthStore } from '@/store/authStore';

export default function AuthProvider({ children }: { children: React.ReactNode }) {
  const setUser = useAuthStore(state => state.setUser);
  const clearUser = useAuthStore(state => state.clearUser);
  const setAuthLoaded = useAuthStore(state => state.setAuthLoaded);

  useEffect(() => {
    getCurrentUser()
      .then(user => setUser(user))
      .catch(() => clearUser())
      .finally(() => setAuthLoaded());
  }, [setUser, clearUser, setAuthLoaded]);

  return <>{children}</>;
}
