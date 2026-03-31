import { create } from 'zustand';
import type { User } from '@/types/user';

interface AuthState {
  user: User | null;
  isLoggedIn: boolean;
  isAuthLoading: boolean;
  setUser: (user: User) => void;
  clearUser: () => void;
  setAuthLoading: (value: boolean) => void;
}

export const useAuthStore = create<AuthState>(set => ({
  user: null,
  isLoggedIn: false,
  isAuthLoading: true,

  setUser: (user: User) =>
    set({
      user,
      isLoggedIn: true,
    }),

  clearUser: () =>
    set({
      user: null,
      isLoggedIn: false,
    }),

  setAuthLoading: (value: boolean) =>
    set({
      isAuthLoading: value,
    }),
}));
