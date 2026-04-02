export type Location = {
  _id: string;
  image: string;
  name: string;
  locationType: string;
  region: string;
  rate: number;
  description: string;
  coordinates?: {
    lat: number;
    lon: number;
  };
  ownerId: string;
  feedbacksId: string[];
  typeName: string;
};

export type LocationType = {
  _id: string;
  type: string;
  slug: string;
  shortDescription: string;
};
