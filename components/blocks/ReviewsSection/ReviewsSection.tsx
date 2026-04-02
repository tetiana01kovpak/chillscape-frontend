'use client';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import { useQuery } from '@tanstack/react-query';
import { getFeedbacks } from '@/lib/clientApi';
// import ReviewCard from '@/components/cards/ReviewCard/ReviewCard';
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

  const handleReviewClick = () => {
    if (isLoggedIn) {
      router.push(`/locations/${locationId}/add-review`);
    } else {
      router.push(`/locations/${locationId}/auth-prompt`);
    }
  };

  return (
    <section className={css.wrapper}>
      <div className={css.header}>
        <h2 className={css.title}>Відгуки</h2>
        <Button onClick={handleReviewClick} className={css.btnStyle}>
          Залишити відгук
        </Button>
      </div>

      {isLoading && <Loader />}

      {!isLoading && data?.feedbacks && data.feedbacks.length > 0 ? (
        <>
          <ul className={css.list}>
            {data.feedbacks.map(feedback => (
              <li key={feedback._id}>{/* <ReviewCard feedback={feedback} /> */}</li>
            ))}
          </ul>
        </>
      ) : (
        !isLoading && (
          <div className={css.placeholder}>
            <p className={css.placeholderText}>Відгуків ще немає</p>
            <p className={css.placeholderSub}>Будьте першим, хто залишить відгук про це місце</p>
          </div>
        )
      )}
    </section>
  );
}
