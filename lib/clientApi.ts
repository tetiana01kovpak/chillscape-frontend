import type { User } from '@/types/user';
import type { LocationCardData, Location as SimpleLocation } from '@/types/location';
import { Location, LocationType, Regions } from '@/types/locations';
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

function normalizeUser(raw: Record<string, unknown>): User {
  return {
    id: String(raw._id || raw.id),
    name: String(raw.name),
    email: raw.email ? String(raw.email) : undefined,
    avatar: raw.avatarUrl ? String(raw.avatarUrl) : raw.avatar ? String(raw.avatar) : undefined,
    articlesAmount: typeof raw.articlesAmount === 'number' ? raw.articlesAmount : undefined,
  };
}

function normalizeLocation(raw: Record<string, unknown>): Location {
  const rawRating =
    raw.rate ??
    raw.rating ??
    raw.averageRating ??
    raw.avgRating;

  const rate =
    typeof rawRating === 'number'
      ? rawRating
      : typeof rawRating === 'string'
        ? Number.parseFloat(rawRating) || 0
        : 0;

  const image =
    typeof raw.image === 'string'
      ? raw.image
      : typeof raw.imageUrl === 'string'
        ? raw.imageUrl
        : Array.isArray(raw.images) && typeof raw.images[0] === 'string'
          ? raw.images[0]
          : '';

  return {
    _id: String(raw._id || raw.id || ''),
    image,
    name: String(raw.name || ''),
    locationType:
      typeof raw.locationType === 'string'
        ? raw.locationType
        : typeof raw.type === 'string'
          ? raw.type
          : '',
    region: String(raw.region || ''),
    rate,
    description: String(raw.description || ''),
    coordinates:
      raw.coordinates &&
      typeof raw.coordinates === 'object' &&
      typeof (raw.coordinates as { lat?: unknown }).lat === 'number' &&
      typeof (raw.coordinates as { lon?: unknown }).lon === 'number'
        ? {
            lat: (raw.coordinates as { lat: number }).lat,
            lon: (raw.coordinates as { lon: number }).lon,
          }
        : undefined,
    ownerId: String(raw.ownerId || ''),
    feedbacksId: Array.isArray(raw.feedbacksId)
      ? raw.feedbacksId.map(item => String(item))
      : [],
    typeName: String(raw.typeName || ''),
  };
}

interface LocationsResponse {
  status: number;
  message: string;
  page: number;
  perPage: number;
  totalLocations: number;
  totalPages: number;
  locations: Location[];
}

export function buildLocationTypeMap(types: LocationType[]): Map<string, string> {
  return new Map(types.map(item => [item.slug, item.type]));
}

export function mapLocationToCardData(
  raw: Record<string, unknown>,
  typeNameMap: Map<string, string>
): LocationCardData {
  const rawRating =
    raw.rate ??
    raw.rating ??
    raw.averageRating ??
    raw.avgRating;

  const rating =
    typeof rawRating === 'number'
      ? rawRating
      : typeof rawRating === 'string'
        ? Number.parseFloat(rawRating) || 0
        : 0;

  const imageUrl =
    typeof raw.image === 'string'
      ? raw.image
      : typeof raw.imageUrl === 'string'
        ? raw.imageUrl
        : Array.isArray(raw.images) && typeof raw.images[0] === 'string'
          ? raw.images[0]
          : '';

  const locationType =
    typeof raw.locationType === 'string'
      ? raw.locationType
      : typeof raw.type === 'string'
        ? raw.type
        : '';

  return {
    id: String(raw._id || raw.id),
    name: String(raw.name || ''),
    imageUrl,
    typeName: typeNameMap.get(locationType) || locationType,
    rating,
  };
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
  const { data } = await api.get<LocationsResponse>('/locations', {
    withCredentials: false,
  });
  return data.locations;
}

export async function getLocationById(id: string): Promise<Location> {
  const { data } = await api.get<{ data: Location }>(`/locations/${id}`);
  return normalizeLocation(data.data as Record<string, unknown>);
}

export async function getLocationTypes(): Promise<LocationType[]> {
  const { data } = await api.get<{ data: LocationType[] }>('/categories/location-types');
  return data.data;
}

export async function getLocationRegions(): Promise<Regions[]> {
  const { data } = await api.get<{ data: Regions[] }>('/categories/');
  return data.data;
}

// Users API
export async function getUserById(userId: string): Promise<User> {
  const { data } = await api.get(`/users/${userId}`);
  return normalizeUser(data.data);
}

export type UserLocationsResponse = {
  data: {
    page: number;
    limit: number;
    totalItems: number;
    totalPages: number;
    locations: Record<string, unknown>[];
  };
};

export async function getUserLocationsRaw(
  userId: string,
  page = 1,
  limit = 6
): Promise<UserLocationsResponse['data']> {
  const { data } = await api.get<UserLocationsResponse>(
    `/users/${userId}/locations?page=${page}&limit=${limit}`
  );

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
