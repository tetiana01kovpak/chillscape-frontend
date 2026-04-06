import { useQuery } from '@tanstack/react-query';
import { getFeedbacks } from '@/lib/clientApi';
import { FeedbacksResponse } from '@/types/feedback';
import { calcAverageRating } from '@/utils/rating';

const FEEDBACKS_STALE_TIME = 5 * 60 * 1000;
const FEEDBACKS_GC_TIME = 10 * 60 * 1000;

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
    staleTime: FEEDBACKS_STALE_TIME,
    gcTime: FEEDBACKS_GC_TIME,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });

  const feedbacks = data?.feedbacks ?? [];
  const rating = isLoading
    ? (initialRating ?? 0)
    : feedbacks.length
      ? calcAverageRating(feedbacks)
      : (initialRating ?? 0);

  return {
    feedbacks,
    rating,
    totalFeedbacks: data?.totalFeedbacks ?? 0,
    loading: isLoading,
    error: error instanceof Error ? error.message : null,
  };
}
