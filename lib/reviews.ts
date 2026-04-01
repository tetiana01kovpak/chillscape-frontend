import type { Review } from '@/components/blocks/ReviewsBlock/ReviewsBlock';
import { api } from './api';

type FeedbackApiItem = {
  _id: string;
  rating: number;
  comment: string;
  user?: {
    name?: string;
  };
  place?: {
    type?: string;
  };
};

export const fetchReviews = async (): Promise<Review[]> => {
  const { data } = await api.get<FeedbackApiItem[]>('/feedbacks');

  return data.map(item => ({
    id: item._id,
    rating: item.rating,
    text: item.comment,
    author: item.user?.name || 'Невідомий автор',
    locationType: item.place?.type || 'Невідомий тип',
  }));
};
