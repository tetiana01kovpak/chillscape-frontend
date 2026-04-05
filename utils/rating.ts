import { Feedback } from '@/types/feedback';

export function calcAverageRating(feedbacks: Feedback[]): number {
  if (!feedbacks?.length) return 0;
  const sum = feedbacks.reduce((acc, f) => acc + (f.rate ?? f.rating ?? 0), 0);
  return Math.round((sum / feedbacks.length) * 10) / 10;
}
