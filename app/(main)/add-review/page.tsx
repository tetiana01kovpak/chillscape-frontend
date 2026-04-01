'use client';

import AddReviewModal from '@/components/blocks/AddReviewModal/AddReviewModal';
import { useRouter } from 'next/navigation';

export default function AddReviewPage() {
  const router = useRouter();

  const handleClose = () => {
    router.back();
  };

  return <AddReviewModal onClose={handleClose} />;
}