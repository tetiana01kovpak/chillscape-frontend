import { useQuery } from '@tanstack/react-query';
import { getFeedbacks } from '@/lib/clientApi';
import { FeedbacksResponse } from '@/types/feedback';
import { calcAverageRating } from '@/utils/rating';

interface UseFeedbacksReturn {
  feedbacks: FeedbacksResponse['feedbacks'];
  rating: number;
  totalFeedbacks: number;
  loading: boolean;
  error: string | null;
}

export function useFeedbacks(placeId: string, initialRating?: number): UseFeedbacksReturn {
  const { data, isLoading, error } = useQuery<FeedbacksResponse>({
    queryKey: ['feedbacks', placeId],
    queryFn: () => getFeedbacks(placeId),
    enabled: !!placeId,
  });

  const feedbacks = data?.feedbacks ?? [];
  const rating = feedbacks.length ? calcAverageRating(feedbacks) : (initialRating ?? 0);

  return {
    feedbacks,
    rating,
    totalFeedbacks: data?.totalFeedbacks ?? 0,
    loading: isLoading,
    error: error instanceof Error ? error.message : null,
  };
}
