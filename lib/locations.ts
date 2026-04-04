import { api } from './api';

export type SortValue = '' | 'popular' | 'rating' | 'newest';

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

export const sortOptions: SelectOption[] = [
  { value: 'popular', label: 'За популярністю' },
  { value: 'rating', label: 'За рейтингом' },
  { value: 'newest', label: 'Новіші спочатку' },
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
  type?: string;
  locationType?: LocationTypeField;
  region?: string;
  description: string;
  images?: string[];
  createdAt?: string;
};

type LocationsApiResponse = {
  page: number;
  perPage: number;
  totalLocations: number;
  totalPages: number;
  locations: LocationApiItem[];
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
  image: string;
  createdAt?: string;
};

export type FetchLocationsResult = {
  page: number;
  perPage: number;
  totalLocations: number;
  totalPages: number;
  locations: LocationItem[];
};

const FILTERS_FETCH_LIMIT = 50;

const uniqueStrings = (items: string[]): string[] => {
  return [...new Set(items.map((item) => item.trim()).filter(Boolean))];
};

const getNormalizedLocationType = (item: LocationApiItem): string => {
  if (typeof item.locationType === 'string' && item.locationType) {
    return item.locationType;
  }

  if (typeof item.locationType === 'object' && item.locationType !== null) {
    return (
      item.locationType.name ||
      item.locationType.type ||
      item.type ||
      'Невідомий тип'
    );
  }

  if (item.type) {
    return item.type;
  }

  return 'Невідомий тип';
};

const getSafeImage = (images?: string[]): string => {
  const firstImage = images?.[0]?.trim() || '';

  // Тимчасово блокуємо зовнішні URL,
  // щоб next/image не падав без next.config
  if (
    firstImage.startsWith('http://') ||
    firstImage.startsWith('https://')
  ) {
    return '';
  }

  return firstImage;
};

const mapLocationItem = (item: LocationApiItem): LocationItem => {
  return {
    id: item._id,
    name: item.name,
    region: item.region ?? '',
    locationType: getNormalizedLocationType(item),
    description: item.description,
    image: getSafeImage(item.images),
    createdAt: item.createdAt,
  };
};

const fetchAllLocationsForFilters = async (): Promise<LocationApiItem[]> => {
  const { data: firstPageData } = await api.get<LocationsApiResponse>(
    '/locations',
    {
      params: {
        page: 1,
        limit: FILTERS_FETCH_LIMIT,
      },
    },
  );

  const firstPageLocations = firstPageData.locations ?? [];
  const totalPages = firstPageData.totalPages ?? 1;

  if (totalPages <= 1) {
    return firstPageLocations;
  }

  const requests: Promise<{ data: LocationsApiResponse }>[] = [];

  for (let page = 2; page <= totalPages; page += 1) {
    requests.push(
      api.get<LocationsApiResponse>('/locations', {
        params: {
          page,
          limit: FILTERS_FETCH_LIMIT,
        },
      }),
    );
  }

  const responses = await Promise.all(requests);

  const restLocations = responses.flatMap(
    (response) => response.data.locations ?? [],
  );

  return [...firstPageLocations, ...restLocations];
};

export const fetchRegions = async (): Promise<SelectOption[]> => {
  const locations = await fetchAllLocationsForFilters();

  const regions = uniqueStrings(
    locations.map((item) => item.region ?? ''),
  );

  return regions.map((region) => ({
    value: region,
    label: region,
  }));
};

export const fetchLocationTypes = async (): Promise<SelectOption[]> => {
  const locations = await fetchAllLocationsForFilters();

  const types = uniqueStrings(
    locations.map((item) => item.type ?? ''),
  );

  return types.map((type) => ({
    value: type,
    label: type,
  }));
};

//повернути sort після мердж
export const fetchLocations = async (
  params: FetchLocationsParams,
): Promise<FetchLocationsResult> => {
  const queryParams = {
    ...(params.search?.trim() ? { search: params.search.trim() } : {}),
    ...(params.region ? { region: params.region } : {}),
    ...(params.type ? { type: params.type } : {}),
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