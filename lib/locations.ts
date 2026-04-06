import { api } from './api';

export type SortValue = '' | 'rating' | 'newest' | 'alphabet_asc' | 'alphabet_desc';

export type Filters = {
  search: string;
  region: string;
  type: string;
  sort: SortValue;
};

export type SelectOption = {
  value: string;
  label: string;
};

type RegionApiItem = {
  slug: string;
  region: string;
};

type LocationTypeCategoryItem = {
  slug: string;
  type: string;
};

const SORT_VALUES: SortValue[] = ['', 'rating', 'newest', 'alphabet_asc', 'alphabet_desc'];

export const normalizeSortValue = (value: string | null | undefined): SortValue => {
  if (!value) {
    return '';
  }

  return SORT_VALUES.includes(value as SortValue) ? (value as SortValue) : '';
};

export const sortOptions: SelectOption[] = [
  { value: 'rating', label: 'За рейтингом' },
  { value: 'newest', label: 'Новіші спочатку' },
  { value: 'alphabet_asc', label: 'За алфавітом А-Я' },
  { value: 'alphabet_desc', label: 'За алфавітом Я-А' },
];

type LocationTypeField =
  | string
  | {
      name?: string;
      type?: string;
    };

type LocationApiItem = {
  _id: string;
  name: string;
  image?: string;
  imageUrl?: string;
  type?: string;
  locationType?: LocationTypeField;
  region?: string;
  description: string;
  images?: string[];
  rate?: number;
  rating?: number | string;
  averageRating?: number | string;
  avgRating?: number | string;
  createdAt?: string;
};

type LocationsApiResponse = {
  page: number;
  perPage: number;
  totalLocations: number;
  totalPages: number;
  locations: LocationApiItem[];
};

type RegionsApiResponse = {
  data: RegionApiItem[];
};

type LocationTypesApiResponse = {
  data: LocationTypeCategoryItem[];
};

export type FetchLocationsParams = {
  search?: string;
  region?: string;
  type?: string;
  page?: number;
  limit?: number;
  sort?: SortValue;
};

export type LocationItem = {
  id: string;
  name: string;
  region: string;
  locationType: string;
  description: string;
  imageUrl: string;
  rating: number;
  createdAt?: string;
};

const getNumericRating = (item: LocationApiItem): number => {
  const rawRating =
    item.rate ??
    item.rating ??
    item.averageRating ??
    item.avgRating;

  if (typeof rawRating === 'number' && Number.isFinite(rawRating)) {
    return rawRating;
  }

  if (typeof rawRating === 'string') {
    const parsed = Number.parseFloat(rawRating);
    return Number.isFinite(parsed) ? parsed : 0;
  }

  return 0;
};

export type FetchLocationsResult = {
  page: number;
  perPage: number;
  totalLocations: number;
  totalPages: number;
  locations: LocationItem[];
};

const getNormalizedLocationType = (item: LocationApiItem): string => {
  if (typeof item.locationType === 'string' && item.locationType) {
    return item.locationType;
  }

  if (typeof item.locationType === 'object' && item.locationType !== null) {
    return item.locationType.name || item.locationType.type || item.type || 'Невідомий тип';
  }

  if (item.type) {
    return item.type;
  }

  return 'Невідомий тип';
};

const getSafeImage = (rawImage?: string, rawImageUrl?: string, images?: string[]): string => {
  const imageCandidate =
    (typeof rawImage === 'string' && rawImage.trim()) ||
    (typeof rawImageUrl === 'string' && rawImageUrl.trim()) ||
    images?.[0]?.trim() ||
    '';

  if (!imageCandidate) return '';

  if (imageCandidate.startsWith('/')) {
    return imageCandidate;
  }

  try {
    new URL(imageCandidate);
    return imageCandidate;
  } catch {
    return '';
  }
};

const mapLocationItem = (item: LocationApiItem): LocationItem => {
  return {
    id: item._id,
    name: item.name,
    region: item.region ?? '',
    locationType: getNormalizedLocationType(item),
    description: item.description,
    imageUrl: getSafeImage(item.image, item.imageUrl, item.images),
    rating: getNumericRating(item),
    createdAt: item.createdAt,
  };
};

export const fetchRegions = async (): Promise<SelectOption[]> => {
  const { data } = await api.get<RegionsApiResponse>('/categories');

  return (data.data ?? []).map((region) => ({
    value: region.slug,
    label: region.region,
  }));
};

export const fetchLocationTypes = async (): Promise<SelectOption[]> => {
  const { data } = await api.get<LocationTypesApiResponse>('/categories/location-types');

  return (data.data ?? []).map((type) => ({
    value: type.slug,
    label: type.type,
  }));
};

export const fetchLocations = async (
  params: FetchLocationsParams,
): Promise<FetchLocationsResult> => {
  const normalizedSort = normalizeSortValue(params.sort);

  const queryParams = {
    ...(params.search?.trim() ? { search: params.search.trim() } : {}),
    ...(params.region ? { region: params.region } : {}),
    ...(params.type ? { type: params.type } : {}),
    ...(normalizedSort ? { sort: normalizedSort } : {}),
    ...(params.page ? { page: params.page } : {}),
    ...(params.limit ? { limit: params.limit } : {}),
  };

  const { data } = await api.get<LocationsApiResponse>('/locations', {
    params: queryParams,
  });

  return {
    page: data.page,
    perPage: data.perPage,
    totalLocations: data.totalLocations,
    totalPages: data.totalPages,
    locations: (data.locations ?? []).map(mapLocationItem),
  };
};
