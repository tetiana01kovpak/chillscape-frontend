'use client';

import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import ReviewsBlock from '../ReviewsBlock/ReviewsBlock';
import css from './ReviewsSection.module.css';
import { Button } from '@/components/ui/Button/Button';

interface Props {
  locationId: string;
}

export default function ReviewsSection({ locationId }: Props) {
  const router = useRouter();
  const { isLoggedIn } = useAuthStore();

  const handleReviewClick = () => {
    if (isLoggedIn) {
      router.push(`/locations/${locationId}/add-review`);
    } else {
      router.push(`/locations/${locationId}/auth-prompt`);
    }
  };

  return (
    <section className={css.wrapper}>
      <div className={`container ${css.header}`}>
        <h2 className={css.title}>Відгуки</h2>
        <Button onClick={handleReviewClick} className={css.btnStyle}>
          Залишити відгук
        </Button>
      </div>

      <ReviewsBlock placeId={locationId} showTitle={false} showLocationType={false} />
    </section>
  );
}
