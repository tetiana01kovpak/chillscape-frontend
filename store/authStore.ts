import { create } from 'zustand';
import type { User } from '@/types/user';

interface AuthState {
  user: User | null;
  isLoggedIn: boolean;
  isAuthLoaded: boolean;
  setUser: (user: User) => void;
  clearUser: () => void;
  setAuthLoaded: () => void;
}

export const useAuthStore = create<AuthState>(set => ({
  user: null,
  isLoggedIn: false,
  isAuthLoaded: false,
  setUser: (user: User) => set({ user, isLoggedIn: true, isAuthLoaded: true }),
  clearUser: () => set({ user: null, isLoggedIn: false, isAuthLoaded: true }),
  setAuthLoaded: () => set({ isAuthLoaded: true }),
}));
