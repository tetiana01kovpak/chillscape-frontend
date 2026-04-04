import type { User } from '@/types/user';
import type { Location as SimpleLocation } from '@/types/location';
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

// Backend returns MongoDB _id, frontend expects id
function normalizeUser(raw: Record<string, unknown>): User {
  return {
    id: String(raw._id || raw.id),
    name: String(raw.name),
    email: String(raw.email),
    avatar: raw.avatar ? String(raw.avatar) : undefined,
  };
}

interface LocationsResponse {
  locations: Location[];
}

// Auth API
export async function registerUser(credentials: RegisterCredentials): Promise<User> {
  const { data } = await api.post('/auth/register', credentials);
  return normalizeUser(data);
}

export async function loginUser(credentials: LoginCredentials): Promise<User> {
  const { data } = await api.post('/auth/login', credentials);
  return normalizeUser(data);
}

export async function logoutUser(): Promise<void> {
  await api.post('/auth/logout');
}

export async function getCurrentUser(): Promise<User> {
  const { data } = await api.get('/users/current');
  return normalizeUser(data.data);
}

// Locations API
export async function getLocations(): Promise<Location[]> {
  const { data } = await api.get<LocationsResponse>('/locations', { withCredentials: false });
  return data.locations;
}

export async function getLocationById(id: string): Promise<Location> {
  const { data } = await api.get<{ data: Location }>(`/locations/${id}`);
  return data.data;
}

export async function getLocationTypes(): Promise<LocationType[]> {
  const { data } = await api.get<{ data: LocationType[] }>('/categories/location-types');
  return data.data;
}

// Users API
export async function getUserById(userId: string): Promise<User> {
  const { data } = await api.get(`/users/${userId}`);
  return normalizeUser(data.data);
}

function normalizeLocation(raw: Record<string, unknown>): SimpleLocation {
  const images = Array.isArray(raw.images) ? raw.images : [];

  return {
    id: String(raw._id || raw.id),
    name: String(raw.name),
    imageUrl: raw.imageUrl
      ? String(raw.imageUrl)
      : images.length > 0
        ? String(images[0])
        : undefined,
    type: raw.type ? String(raw.type) : raw.locationType ? String(raw.locationType) : undefined,
  };
}

type UserLocationsResponse = {
  data: {
    page: number;
    limit: number;
    totalItems: number;
    totalPages: number;
    locations: Record<string, unknown>[];
  };
};

export async function getUserLocations(userId: string): Promise<SimpleLocation[]> {
  const { data } = await api.get<UserLocationsResponse>(`/users/${userId}/locations`);
  return data.data.locations.map(normalizeLocation);
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
