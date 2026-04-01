import type { User } from '@/types/user';
import { Location, LocationType } from '@/types/locations';
import { FeedbacksResponse } from '@/types/feedback';
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

export type UserResponse = {
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
  const { data } = await api.get<User>('/users/current');
  return data;
}

export async function getLocations(): Promise<Location[]> {
  const { data } = await api.get<Location[]>('/locations');
  return data;
}

export async function getLocationById(id: string): Promise<Location> {
  const { data } = await api.get<{ data: Location }>(`/locations/${id}`);
  return data.data;
}

export async function getLocationTypes(): Promise<LocationType[]> {
  const { data } = await api.get<LocationType[]>('/categories/location-types');
  return data;
}

export async function getUserById(id: string): Promise<User> {
  const { data } = await api.get<{ data: User }>(`/users/${id}`);
  return data.data;
}

export async function getFeedbacks(
  placeId: string,
  page = 1,
  limit = 10
): Promise<FeedbacksResponse> {
  const { data } = await api.get<FeedbacksResponse>(
    `/feedbacks/${placeId}?page=${page}&limit=${limit}`
  );
  return data;
}
