import { api } from "./api";

//тип для селект
export type SelectOption = {
    value: string;
    label: string;
};

//тіло обєкта в response.data для '/categories'
type RegionApiItem = {
    region: string;
};

//тіло обєкта в response.data для '/categories/location-types'
type LocationTypeApiItem = {
    type: string;
};

//відповідь для регіонів
type RegionsResponse = {
    data: RegionApiItem[];
};

//відповідь для типів локацій
type LocationTypesResponse = {
    data: LocationTypeApiItem[];
};

//обєкт з масиву data.locations
type LocationApiItem = {
    _id: string;
    name: string;
    type?: string;
    locationType?: string;
    region: string;
    description: string;
    images?: string[];
};

//повна відповідь бек для списку локацій
type LocationsApiResponse = {
    page: number;
    perPage: number;
    totalLocations: number;
    totalPages: number;
    locations: LocationApiItem[];
};

//query params
export type FetchLocationsParams = {
    search?: string; 
    region?: string; 
    type?: string;   
    page?: number;   
    limit?: number;  
};

//нормалізована локація
export type LocationItem = {
    id: string;            
    name: string;         
    region: string;        
    locationType: string;  
    description: string;   
    image: string;    
};

//результат
export type FetchLocationsResult = {
    page: number;               
    perPage: number;          
    totalLocations: number;    
    totalPages: number;        
    locations: LocationItem[];  
};

export const fetchRegions = async (): Promise<SelectOption[]> => {
    const { data } = await api.get<RegionsResponse>('/categories');
    return data.data.map((item) => ({
        value: item.region,
        label: item.region,
    }));
};

export const fetchLocationTypes = async (): Promise<SelectOption[]> => {
    const { data } = await api.get<LocationTypesResponse>('/categories/location-types');
    return data.data.map((item) => ({
        value: item.type,
        label: item.type,
    }));
};


export const fetchLocations = async (
    params: FetchLocationsParams,
): Promise<FetchLocationsResult> => {
    const { data } = await api.get<LocationsApiResponse>('/locations', {
        params,
    });
    return {
        page: data.page,
        perPage: data.perPage,
        totalLocations: data.totalLocations,
        totalPages: data.totalPages,
        locations: data.locations.map((item) => ({
            id: item._id,
            name: item.name,
            region: item.region,
            locationType: item.locationType || item.type || 'Невідомий тип',
            description: item.description,
            image: item.images?.[0] || '',
        })),
    };
};