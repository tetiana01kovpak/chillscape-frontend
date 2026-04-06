import type { Review } from '@/components/blocks/ReviewsBlock/ReviewsBlock';
import { api } from './api';

type FeedbackApiItem = {
  _id: string;
  rate: number;
  description: string;
  userName?: string;
  place?: {
    type?: string;
  };
};

type FeedbacksByPlaceResponse = {
  feedbacks: FeedbackApiItem[];
};

const mapFeedbackToReview = (item: FeedbackApiItem): Review => ({
  id: item._id,
  rating: item.rate,
  text: item.description,
  author: item.userName || 'Невідомий автор',
  locationType: item.place?.type || '',
});

export const fetchReviews = async (): Promise<Review[]> => {
  const { data } = await api.get<FeedbackApiItem[]>('/feedbacks');
  return data.map(mapFeedbackToReview);
};

export const fetchLocationReviews = async (placeId: string): Promise<Review[]> => {
  const { data } = await api.get<FeedbacksByPlaceResponse>(`/feedbacks/${placeId}`);

  return data.feedbacks.map(mapFeedbackToReview);
};


