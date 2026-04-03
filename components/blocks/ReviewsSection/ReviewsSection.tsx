'use client';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import { useQuery } from '@tanstack/react-query';
import { getFeedbacks } from '@/lib/clientApi';
import ReviewsBlock from '../ReviewsBlock/ReviewsBlock';
import css from './ReviewsSection.module.css';
import { Loader } from '@/components/ui/Loader/Loader';
import { Button } from '@/components/ui/Button/Button';

interface Props {
  locationId: string;
}

export default function ReviewsSection({ locationId }: Props) {
  const router = useRouter();
  const { isLoggedIn } = useAuthStore();

  const { data, isLoading } = useQuery({
    queryKey: ['feedbacks', locationId],
    queryFn: () => getFeedbacks(locationId),
  });

  console.log(data);

  const handleReviewClick = () => {
    if (isLoggedIn) {
      router.push(`/locations/${locationId}/add-review`);
    } else {
      router.push(`/locations/${locationId}/auth-prompt`);
    }
  };

  return (
    <section className={css.wrapper}>
      {isLoading && <Loader />}
      <ReviewsBlock placeId={locationId} title="Відгуки" showLocationType={false} />
      <Button onClick={handleReviewClick} className={css.btnStyle}>
        Залишити відгук
      </Button>
    </section>
  );
}
