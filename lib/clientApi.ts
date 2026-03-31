import type { User } from '@/types/user';
import { api } from './api';

// Auth types
export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials {
  name: string;
  email: string;
  password: string;
}

type UserResponse = {
  status: number;
  message: string;
  data: User;
};

// Auth API
export async function registerUser(credentials: RegisterCredentials): Promise<User> {
  const { data } = await api.post<User>('/auth/register', credentials);
  return data;
}

export async function loginUser(credentials: LoginCredentials): Promise<User> {
  const { data } = await api.post<User>('/auth/login', credentials);
  return data;
}

export async function logoutUser(): Promise<void> {
  await api.post('/auth/logout');
}

export async function getCurrentUser(): Promise<User> {
  const { data } = await api.get<UserResponse>('/users/current');
  return data.data;
}
