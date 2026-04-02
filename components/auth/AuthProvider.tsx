'use client';

import { useEffect } from 'react';
import { getCurrentUser } from '@/lib/clientApi';
import { useAuthStore } from '@/store/authStore';

const SESSION_KEY = 'hasSession';

export default function AuthProvider({ children }: { children: React.ReactNode }) {
  const setUser = useAuthStore(state => state.setUser);
  const clearUser = useAuthStore(state => state.clearUser);
  const setAuthLoading = useAuthStore(state => state.setAuthLoading);

  useEffect(() => {
    const hasSession = localStorage.getItem(SESSION_KEY) === 'true';

    if (!hasSession) {
      clearUser();
      setAuthLoading(false);
      return;
    }

    getCurrentUser()
      .then(user => {
        setUser(user);
      })
      .catch(() => {
        localStorage.removeItem(SESSION_KEY);
        clearUser();
      })
      .finally(() => {
        setAuthLoading(false);
      });
  }, [setUser, clearUser, setAuthLoading]);

  return <>{children}</>;
}
